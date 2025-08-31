// backend/src/controllers/quizController.js
import Concept from "../models/Concept.js";
import QuizResult from "../models/QuizResult.js";

export const generateQuiz = async (req, res) => {
  try {
    const { folderId } = req.params;
    
    // Get concepts that belong to the user and have questions
    const concepts = await Concept.find({ 
      folderId: folderId,
      userId: req.user.id,
      'question.question': { $exists: true, $ne: null }
    });

    if (concepts.length === 0) {
      return res.status(404).json({ 
        message: 'No concepts with quiz questions found in this folder' 
      });
    }

    const quiz = concepts.map(concept => ({
      conceptId: concept._id,
      name: concept.conceptName,
      question: concept.question,
      link: `/concept/${concept._id}`,
      imageUrl: concept.imageUrl
    }));

    res.json({ quiz, totalQuestions: quiz.length });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz results
export const submitQuizResult = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { 
      answers, 
      timeElapsed, 
      totalQuestions, 
      correctAnswers, 
      percentage 
    } = req.body;

    const quizResult = await QuizResult.create({
      userId: req.user.id,
      folderId: folderId,
      answers,
      timeElapsed,
      totalQuestions,
      correctAnswers,
      percentage,
      completedAt: new Date()
    });

    res.status(201).json({
      message: 'Quiz result saved successfully',
      result: quizResult
    });
  } catch (error) {
    console.error('Submit quiz result error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quiz history for user
export const getQuizHistory = async (req, res) => {
  try {
    const { folderId } = req.params;
    
    const results = await QuizResult.find({
      userId: req.user.id,
      ...(folderId && { folderId: folderId })
    })
    .populate('folderId', 'name')
    .sort({ completedAt: -1 })
    .limit(20);

    res.json(results);
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quiz analytics
export const getQuizAnalytics = async (req, res) => {
  try {
    const { folderId } = req.params;
    
    const results = await QuizResult.find({
      userId: req.user.id,
      folderId: folderId
    }).sort({ completedAt: -1 });

    if (results.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        averageTime: 0,
        improvement: 0
      });
    }

    const totalAttempts = results.length;
    const averageScore = Math.round(
      results.reduce((sum, result) => sum + result.percentage, 0) / totalAttempts
    );
    const bestScore = Math.max(...results.map(r => r.percentage));
    const averageTime = Math.round(
      results.reduce((sum, result) => sum + result.timeElapsed, 0) / totalAttempts
    );

    // Calculate improvement (compare last 3 vs first 3 attempts)
    let improvement = 0;
    if (totalAttempts >= 6) {
      const recent = results.slice(0, 3);
      const initial = results.slice(-3);
      const recentAvg = recent.reduce((sum, r) => sum + r.percentage, 0) / 3;
      const initialAvg = initial.reduce((sum, r) => sum + r.percentage, 0) / 3;
      improvement = Math.round(recentAvg - initialAvg);
    }

    res.json({
      totalAttempts,
      averageScore,
      bestScore,
      averageTime,
      improvement,
      recentResults: results.slice(0, 5)
    });
  } catch (error) {
    console.error('Get quiz analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};