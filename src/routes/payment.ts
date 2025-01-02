import {Router} from "express";
import {PaymentController} from "../controllers/PaymentController";

const router = Router()
router.post('/', PaymentController.createPayment)

export default router;