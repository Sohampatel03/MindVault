// src/components/quiz/QuizResults.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  RefreshCw, 
  Home,
  Share2,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../ui/Button';

const QuizResults = ({ 
  results, 
  quiz, 
  answers,
  onRetakeQuiz,
  onBackToDashboard,
  onBackToFolder 
}) => {
  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    timeElapsed,
    grade
  } = results;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B') return 'text-blue-600';
    if (grade === 'C') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding! You've mastered this topic! 🌟";
    if (percentage >= 80) return "Excellent work! You're doing great! 🎉";
    if (percentage >= 70) return "Good job! Keep up the momentum! 👏";
    if (percentage >= 60) return "Not bad! A bit more practice will help! 💪";
    return "Keep practicing! You'll improve with more study! 📚";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
        <p className="text-gray-600 text-lg">{getPerformanceMessage(percentage)}</p>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className={`text-4xl font-bold mb-2 ${getGradeColor(grade)}`}
            >
              {percentage}%
            </motion.div>
            <p className="text-indigo-700 font-medium">Overall Score</p>
            <div className={`text-2xl font-bold mt-2 ${getGradeColor(grade)}`}>
              {grade}
            </div>
          </div>
        </motion.div>

        {/* Correct Answers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-green-50 p-6 rounded-xl border border-green-200"
        >
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">{correctAnswers}</span>
          </div>
          <p className="text-green-700 font-medium">Correct</p>
          <p className="text-green-600 text-sm">Out of {totalQuestions}</p>
        </motion.div>

        {/* Incorrect Answers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-red-50 p-6 rounded-xl border border-red-200"
        >
          <div className="flex items-center justify-between mb-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-800">{incorrectAnswers}</span>
          </div>
          <p className="text-red-700 font-medium">Incorrect</p>
          <p className="text-red-600 text-sm">Need review</p>
        </motion.div>

        {/* Time Taken */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-orange-50 p-6 rounded-xl border border-orange-200"
        >
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-800">{formatTime(timeElapsed)}</span>
          </div>
          <p className="text-orange-700 font-medium">Time Taken</p>
          <p className="text-orange-600 text-sm">Average: {Math.round(timeElapsed / totalQuestions)}s per Q</p>
        </motion.div>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Question Breakdown</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {quiz.map((question, index) => {
              const userAnswer = answers[question.conceptId];
              const isCorrect = userAnswer === question.question?.answer;
              const questionNumber = index + 1;

              return (
                <motion.div
                  key={question.conceptId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className={`
                    p-4 rounded-lg border-l-4 
                    ${isCorrect 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Q{questionNumber}:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {question.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {question.question?.question}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                          Your answer: <strong>{userAnswer || 'Not answered'}</strong>
                        </span>
                        {!isCorrect && (
                          <span className="text-green-700">
                            Correct: <strong>{question.question?.answer}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRetakeQuiz}
          size="lg"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Retake Quiz</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onBackToFolder}
          size="lg"
          className="flex items-center space-x-2"
        >
          <Target className="w-5 h-5" />
          <span>Back to Folder</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={onBackToDashboard}
          size="lg"
          className="flex items-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Button>
      </motion.div>

      {/* Share Results (Future Enhancement) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">Share your progress:</span>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResults;