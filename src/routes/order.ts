import {Router} from "express";
import {OrderController} from "../controllers/OrderCntroller";

const router = Router()

router.get('/get-orders/:userId', OrderController.getOrders)
router.post('/place-order/:userId', OrderController.placeOrder)

export default router