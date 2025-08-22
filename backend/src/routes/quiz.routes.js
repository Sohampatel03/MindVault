import express from "express";
import { generateQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate quiz for a folder
router.get("/:folderId",protect,generateQuiz);

export default router;
