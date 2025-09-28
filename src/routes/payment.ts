import {Router} from "express";
import {PaymentController} from "../controllers/PaymentController.js";

const router = Router()
router.post('/create', PaymentController.createPayment)

export default router;