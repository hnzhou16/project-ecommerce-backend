import {OrderItemEntity} from "../entity/OrderItem.entity.js";
import {OrderEntity} from "../entity/Order.entity.js";

// DTO: Data Transfer Object (clean up order format)
class OrderItemDto {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  name: string;

  constructor(orderItem: OrderItemEntity) {
    this.productId = orderItem.productId;
    this.color = orderItem.color;
    this.size = orderItem.size;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.image = orderItem.image;
    this.name = orderItem.name;
  }
}

export class OrderDto {
  id: number;
  taxAmount: number;
  totalBeforeTax: number;
  shippingFee: number;
  total: number;
  orderStatus: string;
  orderItems: OrderItemDto[];
  createdAt: Date;
  user: { id: number; name: string; email: string };

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.taxAmount = order.taxAmount;
    this.totalBeforeTax = order.totalBeforeTax;
    this.shippingFee = order.shippingFee;
    this.total = order.total;

    // Map nested order items
    this.orderItems = order.orderItems.map((item) => new OrderItemDto(item));

    this.orderStatus = order.orderStatus
    this.createdAt = order.createdAt

    // Include only necessary user data
    this.user = {
      id: order.user.id,
      name: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
    };
  }
}