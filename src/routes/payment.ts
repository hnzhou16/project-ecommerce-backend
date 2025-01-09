import {Router} from "express";
import {PaymentController} from "../controllers/PaymentController.js";

const router = Router()
router.post('/', PaymentController.createPayment)

export default router;