import {Router} from "express";
import {FilterController} from "../controllers/FilterController.js";

const router = Router()
router.get('/getFilter', FilterController.getFilterOptions)
router.post('/filteredProducts', FilterController.getFilteredProducts )

export default router