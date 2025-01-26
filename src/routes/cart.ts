import {Router} from "express";
import {CartController} from "../controllers/CartController.js";

const router = Router()

router.post('/getCart', CartController.getCart)
router.post('/addItem', CartController.addItem)
router.put('/changeQuantity/:itemId', CartController.changeQuantity)
router.put('/editItem/:itemId', CartController.editItem)
router.delete('/removeItem/:itemId', CartController.removeItem)
router.delete('/clearCart/:userId', CartController.clearCart)

export default router