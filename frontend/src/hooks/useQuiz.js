// src/hooks/useQuiz.js
import { useState, useEffect, useCallback } from 'react';
import { quizService } from '../services/quizService';

export const useQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Load quiz from API
  const loadQuiz = async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.generateQuiz(folderId);
      if (data.quiz && data.quiz.length > 0) {
        setQuiz(data.quiz);
        setCurrentQuestion(0);
        setAnswers({});
        setTimeElapsed(0);
        return data.quiz;
      } else {
        throw new Error('No quiz questions available');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start quiz timer
  const startQuiz = useCallback(() => {
    setIsActive(true);
    setTimeElapsed(0);
  }, []);

  // Stop quiz timer
  const stopQuiz = useCallback(() => {
    setIsActive(false);
  }, []);

  // Reset quiz state
  const resetQuiz = useCallback(() => {
    setQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeElapsed(0);
    setIsActive(false);
    setError(null);
  }, []);

  // Answer a question
  const answerQuestion = useCallback((questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  }, []);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (quiz && currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [quiz, currentQuestion]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  // Go to specific question
  const goToQuestion = useCallback((index) => {
    if (quiz && index >= 0 && index < quiz.length) {
      setCurrentQuestion(index);
    }
  }, [quiz]);

  // Calculate results
  const calculateResults = useCallback(() => {
    if (!quiz) return null;

    const totalQuestions = quiz.length;
    const answeredQuestions = Object.keys(answers).length;
    let correctAnswers = 0;

    quiz.forEach(question => {
      const userAnswer = answers[question.conceptId];
      if (userAnswer && question.question && userAnswer === question.question.answer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers: answeredQuestions - correctAnswers,
      unansweredQuestions: totalQuestions - answeredQuestions,
      percentage,
      timeElapsed,
      grade: getGrade(percentage)
    };
  }, [quiz, answers, timeElapsed]);

  // Get grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Check if quiz is complete
  const isQuizComplete = quiz && Object.keys(answers).length === quiz.length;

  // Get current question object
  const getCurrentQuestion = () => {
    return quiz && quiz[currentQuestion] ? quiz[currentQuestion] : null;
  };

  // Get progress percentage
  const getProgress = () => {
    if (!quiz) return 0;
    return Math.round(((currentQuestion + 1) / quiz.length) * 100);
  };

  return {
    // State
    quiz,
    currentQuestion,
    answers,
    timeElapsed,
    isActive,
    loading,
    error,
    isQuizComplete,

    // Actions
    loadQuiz,
    startQuiz,
    stopQuiz,
    resetQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,

    // Computed values
    calculateResults,
    getCurrentQuestion,
    getProgress,
    
    // Helper functions
    getGrade
  };
};