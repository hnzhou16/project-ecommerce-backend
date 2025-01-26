import {Request, Response} from "express";
import {validate} from "class-validator";
import {CLog} from "../AppHelper.js";
import {ResMsg} from "../helper/ResMsg.js";
import gDB from "../InitDataSource.js";
import {CartEntity} from "../entity/Cart.entity.js";
import {UserEntity} from "../entity/User.entity.js";
import {CartItemEntity} from "../entity/CartItem.entity.js";
import cart from "../routes/cart";
import {plainToInstance} from "class-transformer";

export class CartController {
  // static function belongs to class rather than an instance of the class (don't need to create instance to use it)
  // private function is only accessible from within the class
  private static CartRepo = gDB.getRepository(CartEntity)
  private static CartItemRepo = gDB.getRepository(CartItemEntity)
  private static UserRepo = gDB.getRepository(UserEntity)

  private static validateCartItem(item: any): boolean {
    return (
      item.productId &&
      item.colorId &&
      item.color &&
      item.quantity &&
      item.price &&
      item.image &&
      item.name
    )
  }

  private static createCartItem(item: any, cart: CartEntity): CartItemEntity {
    let cartItem = new CartItemEntity()
    cartItem.productId = item.productId;
    cartItem.colorId = item.colorId;
    cartItem.color = item.color;
    cartItem.size = item.size;
    cartItem.quantity = item.quantity;
    cartItem.price = item.price;
    cartItem.image = item.image;
    cartItem.name = item.name;
    cartItem.cart = cart; // associate the cart item with the cart

    return cartItem
  }

  // Use 'userId' to fetch the cart
  // also merge the frontend and backend cart if any
  static async getCart(req: Request, res: Response) {
    let {userId, shoppingCart} = req.body

    // if user don't have id, Number(undefined)===NaN
    userId = Number(userId)

    if (!userId || isNaN(userId)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    try {
      let existingCart = await CartController.CartRepo.findOne({
        where: {user: {id: userId}},
        relations: ['cartItems', 'user'] // fetch cartItems along with the cart
      })

      if (!existingCart) {
        return res.status(404).send(new ResMsg(404, 'Cart not found.'))
      }

      const backendCartItems = existingCart.cartItems

      if (shoppingCart) {
        for (let item of shoppingCart) {
          item.price = Number(item.price)
          if (!CartController.validateCartItem(item)) {
            return res.status(400).send(new ResMsg(400, 'Invalid cart item.'))
          }

          const existingCartItem = backendCartItems.find((ci) =>
              ci.productId === item.productId &&
              ci.colorId === item.colorId &&
              (ci.size === item.size || (!ci.size && !item.size))
            // (ci.size===null && item.size===null) not working
            // !item.size will consider undefined and "" too
          )

          if (existingCartItem) {
            existingCartItem.quantity = item.quantity
          } else {
            const newCartItem = CartController.createCartItem(item, existingCart)

            const cartItemErrors = await validate(newCartItem)
            if (cartItemErrors.length > 0) {
              CLog.bad("Cart item validation failed: ", cartItemErrors)
              return res.status(400).send(new ResMsg(400, 'Cart item not valid.'))
            }

            existingCart.cartItems.push(newCartItem)
          }
        }

        await CartController.CartRepo.save(existingCart)
      }

      // `@Exclude` only works with 'planToInstance' function
      // do not set 'excludeExtraneousValues' to true, otherwise, have to add @Expose to those that need to be included
      const cartInfo = plainToInstance(CartEntity, existingCart)

      delete cartInfo.user

      // return the cartInfo with cartItems id info, it'll be easier with these id while modifying the cart later
      return res.status(200).send(new ResMsg(200, 'Shopping cart fetched successfully!', cartInfo))
    } catch (err) {
      console.log('Error creating and merging the cart:', err)
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async addItem(req: Request, res: Response) {
    let {userId, cartItem} = req.body

    // if user don't have id, Number(undefined)=NaN
    userId = Number(userId)

    if (!userId || isNaN(userId)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    if (!cartItem) {
      return res.status(400).send(new ResMsg(400, 'Missing cart item information.'))
    }

    try {
      let existingCart = await CartController.CartRepo.findOne({
        where: {user: {id: userId}},
        relations: ['cartItems']
      })

      if (!existingCart) {
        const user = await CartController.UserRepo.findOne({where: {id: userId}})
        if (!user) {
          return res.status(404).send(new ResMsg(404, 'User not found.'))
        }
        existingCart = new CartEntity()
        existingCart.user = user
        existingCart.cartItems = []
        user.cart = existingCart
      }

      const backendCartItems = existingCart.cartItems

      if (!CartController.validateCartItem(cartItem)) {
        return res.status(400).send(new ResMsg(400, 'Invalid cart item.'))
      }

      const existingCartItem = backendCartItems.find((ci) =>
          ci.productId === cartItem.productId &&
          ci.colorId === cartItem.colorId &&
          (ci.size === cartItem.size || (!ci.size && !cartItem.size))
        // (ci.size===null && item.size===null) not working
        // !item.size will consider undefined and "" too
      )

      if (existingCartItem) {
        existingCartItem.quantity += 1
      } else {
        const newCartItem = CartController.createCartItem(cartItem, existingCart)

        const cartItemErrors = await validate(newCartItem)
        if (cartItemErrors.length > 0) {
          CLog.bad("Cart item validation failed: ", cartItemErrors)
          return res.status(400).send(new ResMsg(400, 'Cart item not valid.'))
        }
        existingCart.cartItems.push(newCartItem)
      }

      await CartController.CartRepo.save(existingCart)

      const cartInfo = {...existingCart}
      delete cartInfo.user

      console.log(cartInfo)

      return res.status(200).send(new ResMsg(200, 'Cart item added!', cartInfo))
    } catch (err) {
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async changeQuantity(req: Request, res: Response) {
    let {userId, newQuantity} = req.body
    const {itemId} = req.params

    userId = Number(userId)
    if (!userId || isNaN(userId)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    const cartItemIdNum = Number(itemId)
    if (!cartItemIdNum || isNaN(cartItemIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid cart item id.'))
    }

    const newQuantityNumber = Number(newQuantity)
    if (!newQuantityNumber || isNaN(newQuantityNumber)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid quantity.'))
    }

    try {
      let existingCart = await CartController.CartRepo.findOne({
        where: {user: {id: userId}},
        relations: ['cartItems']
      })

      if (!existingCart) {
        return res.status(404).send(new ResMsg(404, 'Cart not found.'))
      }

      const backendCartItems = existingCart.cartItems

      const existingCartItem = backendCartItems.find((ci) =>
        ci.id === cartItemIdNum
      )

      if (existingCartItem) {
        existingCartItem.quantity = newQuantityNumber
      } else {
        return res.status(400).send(new ResMsg(400, 'Cart item not found.'))
      }

      await CartController.CartRepo.save(existingCart)
      return res.status(200).send(new ResMsg(200, 'Cart item quantity updated!'))
    } catch (err) {
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async editItem(req: Request, res: Response) {
    let {userId, newItemInfo} = req.body
    const {itemId} = req.params

    userId = Number(userId)
    if (!userId || isNaN(userId)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    if (!newItemInfo) {
      return res.status(400).send(new ResMsg(400, 'Missing cart item information.'))
    }

    const cartItemIdNum = Number(itemId)
    if (!cartItemIdNum || isNaN(cartItemIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid cart item id.'))
    }

    try {
      let existingCart = await CartController.CartRepo.findOne({
        where: {user: {id: userId}},
        relations: ['cartItems']
      })

      if (!existingCart) {
        return res.status(400).send(new ResMsg(404, 'Cart not found.'))
      }

      const backendCartItems = existingCart.cartItems

      const existingCartItem = backendCartItems.find((ci) =>
        ci.id === cartItemIdNum
      )

      if (existingCartItem) {
        existingCartItem.colorId = newItemInfo.colorId
        existingCartItem.color = newItemInfo.color
        existingCartItem.size = newItemInfo.size
        existingCartItem.image = newItemInfo.image
      } else {
        return res.status(400).send(new ResMsg(400, 'Cart item not found.'))
      }

      await CartController.CartRepo.save(existingCart)

      return res.status(200).send(new ResMsg(200, 'Cart item updated!'))
    } catch (err) {
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async removeItem(req: Request, res: Response) {
    let {userId} = req.body
    const {itemId} = req.params

    userId = Number(userId)
    if (!userId || isNaN(userId)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    const cartItemIdNum = Number(itemId)
    if (!cartItemIdNum || isNaN(cartItemIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid cart item id.'))
    }

    try {
      let existingCart = await CartController.CartRepo.findOne({
        where: {user: {id: userId}},
        relations: ['cartItems']
      })

      if (!existingCart) {
        return res.status(404).send(new ResMsg(404, 'Cart not found.'))
      }

      const backendCartItems = existingCart.cartItems

      const cartItemToRemove = backendCartItems.find((ci) =>
        ci.id === cartItemIdNum
      )

      if (!cartItemToRemove) {
        return res.status(400).send(new ResMsg(400, 'Cart item not found.'))
      }

      // CartRepo will be automatically updated
      await CartController.CartItemRepo.remove(cartItemToRemove)

      return res.status(200).send(new ResMsg(200, 'Cart item removed!'))
    } catch (err) {
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }

  static async clearCart(req: Request, res: Response) {
    let {userId} = req.params

    // if user don't have id, Number(undefined)===NaN
    const userIdNum = Number(userId)

    if (!userIdNum || isNaN(userIdNum)) {
      return res.status(400).send(new ResMsg(400, 'Missing or invalid user ID.'))
    }

    try {
      const UserRepo = gDB.getRepository(UserEntity)
      const CartRepo = gDB.getRepository(CartEntity)
      const CartItemRepo = gDB.getRepository(CartItemEntity)

      const user = await UserRepo.findOneOrFail({where: {id: userIdNum}})

      if (!user || !user.cart) {
        return res.status(400).send(new ResMsg(400, 'User or cart not found.'));
      }

      const cartItems = user.cart.cartItems

      if (cartItems.length > 0) {
        await CartItemRepo.remove(cartItems)
      }

      user.cart.cartItems = []
      await CartRepo.save(user.cart)
      return res.status(200).send(new ResMsg(200, 'Cart is cleared now!'))
    } catch (err) {
      return res.status(404).send(new ResMsg(404, 'Internal server error.'))
    }
  }
}