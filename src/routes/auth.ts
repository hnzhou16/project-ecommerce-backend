import {Router} from "express";
import {AuthController} from "../controllers/AuthController";


const router = Router()
router.post('/signup', AuthController.signUp)
router.post('/login', AuthController.logIn)
router.post('/forgot-password', AuthController.resetToken)
router.post('/reset-password/:resetToken', AuthController.resetPassword)

export default router