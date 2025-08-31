// backend/src/routes/quiz.routes.js
import express from "express";
import { 
  generateQuiz, 
  submitQuizResult, 
  getQuizHistory, 
  getQuizAnalytics 
} from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate quiz for a folder
router.get("/:folderId", protect, generateQuiz);

// Submit quiz results
router.post("/:folderId/results", protect, submitQuizResult);

// Get quiz history
router.get("/history/:folderId?", protect, getQuizHistory);

// Get quiz analytics
router.get("/analytics/:folderId", protect, getQuizAnalytics);

export default router;