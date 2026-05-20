import express from 'express';
import {
  generateQuiz,
  submitQuizResult,
  getQuizHistory,
  getQuizAnalytics,
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Specific named routes FIRST — before dynamic :folderId
router.get('/history', protect, getQuizHistory);
router.get('/history/:folderId', protect, getQuizHistory);

// Dynamic routes after
router.get('/analytics/:folderId', protect, getQuizAnalytics);
router.get('/:folderId', protect, generateQuiz);
router.post('/:folderId/results', protect, submitQuizResult);

export default router;