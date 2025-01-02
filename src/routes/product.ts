import {Router} from "express";
import {ProductController} from "../controllers/ProductController";

const router = Router()
router.post('/addCategory', ProductController.addCategory)
router.post('/addSwatch', ProductController.addSwatch)
router.post('/addProduct', ProductController.addProduct)
router.get('/:productId', ProductController.getSingleProduct)
router.get('/allProducts', ProductController.getAllProducts)

export default router