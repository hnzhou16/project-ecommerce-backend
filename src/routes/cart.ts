import {Router} from "express";
import {CartController} from "../controllers/CartController";

const router = Router()

router.post('/getcart', CartController.getCart)
router.post('/additem', CartController.addItem)
router.put('/changequantity', CartController.changeQuantity)
router.put('/edititem', CartController.editItem)
router.delete('/removeitem', CartController.removeItem)

export default router