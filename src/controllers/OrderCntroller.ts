import {Request, Response} from "express";
import {validate} from "class-validator";
import {ResMsg} from "../helper/ResMsg.js";
import gDB from "../InitDataSource.js";
import {UserEntity} from "../entity/User.entity.js";
import {OrderEntity} from "../entity/Order.entity.js";
import {OrderItemEntity} from "../entity/OrderItem.entity.js";
import {CartItemEntity} from "../entity/CartItem.entity.js";
import {CLog} from "../AppHelper.js";
import {OrderDto} from "../helper/OrderDto.js";

export class OrderController {
  private static validateOrderData(data: any): boolean {
    return (
      data.taxAmount && !isNaN(Number(data.taxAmount))
      && data.shippingFee && !isNaN(Number(data.shippingFee))
      && data.totalBeforeTax && !isNaN(Number(data.totalBeforeTax))
      && data.total && !isNaN(Number(data.total))
    )
  }

  private static createOrderItem(item: any, order: OrderEntity): OrderItemEntity {
    let orderItem = new OrderItemEntity()
    orderItem.productId = item.productId;
    orderItem.colorId = item.colorId;
    orderItem.color = item.color;
    orderItem.size = item.size;
    orderItem.quantity = item.quantity;
    orderItem.price = item.price;
    orderItem.image = item.image;
    orderItem.name = item.name;
    orderItem.order = order; // associate the order item with the order

    return orderItem
  }

  // place order with cart items info in the backend
  // do not need to send cart again from the frontend
  static async placeOrder(req: Request, res: Response) {
    let {userId} = req.params
    const {orderData} = req.body

    // req.params will make userId a string, req.body can keep it as a num
    const userIdNum = Number(userId)

    if (!userIdNum || isNaN(userIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    if (!OrderController.validateOrderData(orderData)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid total amount.'))
    }

    const userRepo = gDB.getRepository(UserEntity);
    const orderRepo = gDB.getRepository(OrderEntity);
    const orderItemRepo = gDB.getRepository(OrderItemEntity);
    const cartItemRepo = gDB.getRepository(CartItemEntity);

    try {
      const user = await userRepo.findOneOrFail({
        where: {id: userIdNum},
        relations: ['cart'],
      })

      if (!user) {
        return res.status(400).send(new ResMsg(400, 'User not found.'))
      }

      if (user.cart.cartItems.length === 0) {
        return res.status(400).send(new ResMsg(400, 'Your shopping cart is empty, cannot place order.'))
      }

      const order = new OrderEntity()

      // todo: price related should be calculate in the backend
      order.taxAmount = Number(orderData.taxAmount);
      order.shippingFee = Number(orderData.shippingFee)
      order.totalBeforeTax = Number(orderData.totalBeforeTax);
      order.total = Number(orderData.total)
      order.user = user;
      order.orderItems = [] // Initialize as an empty array, otherwise, nowhere to push order items

      for (const item of user.cart.cartItems) {
        const newOrderItem = OrderController.createOrderItem(item, order)

        const orderItemErrors = await validate(newOrderItem)

        if (orderItemErrors.length > 0) {
          CLog.bad("Order item validation failed: ", orderItemErrors)
          return res.status(400).send(new ResMsg(400, 'Order item not valid.'))
        }

        // MUST save newOrderItem here (if OrderItem not been defined as 'cascade' in OrderEntity)
        // otherwise, order has nothing to push
        // await orderItemRepo.save(newOrderItem)

        order.orderItems.push(newOrderItem)

        // remove it from the cart
        await cartItemRepo.remove(item)
      }

      const orderErrors = await validate(order)
      if (orderErrors.length > 0) {
        return res.status(400).send(new ResMsg(400, 'Order not valid.'))
      }

      await orderRepo.save(order)

      // MUST clean up the order, otherwise the nested entity will fail to send
      const orderInfo = new OrderDto(order)

      return res.status(200).send(new ResMsg(200, 'Order placed.', orderInfo))
      } catch (err) {
      console.error('Error placing the order:', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async getOrders(req: Request, res: Response) {
    const {userId} = req.params
    const {page = 1, limit = 3} = req.query

    const userIdNum = Number(userId);
    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (!userIdNum || isNaN(userIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Invalid user ID.'));
    }
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
      return res.status(400).send(new ResMsg(400, 'Invalid page number or limit value.'));
    }

    const orderRepo = gDB.getRepository(OrderEntity);

    try{
      // 'findAndCount' returns a 2-item list
      const [orders, totalOrders] = await orderRepo.findAndCount({
        where: { user: { id: userIdNum } },
        relations: ['orderItems'], //
        order: { createdAt: 'DESC' }, // Sort by creation date descending, retrieve the LATEST ones
        skip: (pageNum - 1) * limitNum, // Offset for pagination
        take: limitNum, // num of records per page
      })

      const PaginatedResponse = {
        totalOrders,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        orders: orders
      }

      if (pageNum > PaginatedResponse.totalPages) {
        return res.status(400).send(new ResMsg(400, 'Page number not valid.'))
      }

      return res.status(200).send(new ResMsg(200, 'Order history retrieved.', PaginatedResponse))
    } catch (err) {
      console.error('Error fetching order history:', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
}
}