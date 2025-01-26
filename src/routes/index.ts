import {Router} from "express";
import product from "./product.js";
import auth from "./auth.js";
import cart from "./cart.js"
import payment from "./payment.js";
import filter from "./filter.js";
import openAI from "./openAI";

const rootRouter = Router()
// rootRouter.use('/', (req: Request, res: Response) => {
//   res.send('Server started!')
// })
rootRouter.use('/product', product)
rootRouter.use('/filter', filter)
rootRouter.use('/auth', auth)
rootRouter.use('/cart', cart)
rootRouter.use('/payment', payment)
rootRouter.use('/AI', openAI)

export default rootRouter;