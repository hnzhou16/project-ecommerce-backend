import {Request, Response, Router} from "express";
import product from "./product.js";
import auth from "./auth.js";
import cart from "./cart.js"
import payment from "./payment.js";
import order from "./order.js";
import filter from "./filter.js";

const rootRouter = Router()
// rootRouter.use('/', (req: Request, res: Response) => {
//   res.send('Server started!')
// })
rootRouter.use('/product', product)
rootRouter.use('/filter', filter)
rootRouter.use('/auth', auth)
rootRouter.use('/cart', cart)
rootRouter.use('/order', order)
rootRouter.use('/payment', payment)
export default rootRouter;