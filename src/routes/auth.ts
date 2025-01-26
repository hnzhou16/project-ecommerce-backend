import {Router} from "express";
import {AuthController} from "../controllers/AuthController.js";


const router = Router()
router.get('/verifyToken', AuthController.verifyToken)
router.post('/signup', AuthController.signUp)
router.post('/login', AuthController.logIn)
router.post('/forgot-password', AuthController.resetToken)
router.post('/reset-password/:resetToken', AuthController.resetPassword)
router.post('/update-info/:userId', AuthController.updateUserInfo)

export default router