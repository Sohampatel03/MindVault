// src/components/quiz/QuizCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Brain, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../ui/Button';

const QuizCard = ({ 
  folder, 
  conceptCount = 0, 
  onStartQuiz, 
  lastScore = null,
  averageTime = null,
  onViewFolder 
}) => {
  const hasQuestions = conceptCount > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors"
            >
              <Brain className="w-6 h-6 text-indigo-600" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {folder.name}
              </h3>
              <p className="text-sm text-gray-600">
                {conceptCount} concepts available
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${hasQuestions 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
            }
          `}>
            {hasQuestions ? 'Ready' : 'No Questions'}
          </div>
        </div>

        {/* Folder Metadata */}
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {new Date(folder.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{conceptCount} concepts</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Stats */}
        {hasQuestions && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{conceptCount}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {lastScore ? `${lastScore}%` : '—'}
              </div>
              <div className="text-xs text-gray-500">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {averageTime ? `${averageTime}m` : '—'}
              </div>
              <div className="text-xs text-gray-500">Avg Time</div>
            </div>
          </div>
        )}

        {/* Performance Indicator */}
        {lastScore && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Last Performance</span>
              <span className="font-medium text-gray-900">{lastScore}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lastScore}%` }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className={`h-full rounded-full ${
                  lastScore >= 80 ? 'bg-green-500' :
                  lastScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {hasQuestions ? (
            <Button
              onClick={() => onStartQuiz(folder._id)}
              className="w-full flex items-center justify-center space-x-2 group"
              size="lg"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Quiz</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onViewFolder(folder._id)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Add Concepts First</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={() => onViewFolder(folder._id)}
            className="w-full text-sm"
          >
            View Folder Details
          </Button>
        </div>

        {/* Quick Tips */}
        {hasQuestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Quick Tips</span>
            </div>
            <p className="text-xs text-gray-600">
              Review your concepts before starting • Take your time • 
              You can pause anytime during the quiz
            </p>
          </motion.div>
        )}
      </div>

      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-xl pointer-events-none transition-colors duration-300"
      />
    </motion.div>
  );
};

export default QuizCard;