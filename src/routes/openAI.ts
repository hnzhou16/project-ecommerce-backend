import { Router } from "express";
import {OpenAIController} from "../controllers/OpenAIController.js";

const router = Router();

router.post("/", OpenAIController.getRecommendations);

export default router;