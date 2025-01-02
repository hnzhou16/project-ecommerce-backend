import {Router} from "express";
import product from "./product";
import auth from "./auth";
import cart from "./cart"
import payment from "./payment";
import order from "./order";
import filter from "./filter";

const rootRouter = Router()
rootRouter.use('/product', product)
rootRouter.use('/filter', filter)
rootRouter.use('/auth', auth)
rootRouter.use('/cart', cart)
rootRouter.use('/order', order)
rootRouter.use('/payment', payment)
export default rootRouter;