import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const ProgressBar = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions = {}, 
  onQuestionClick 
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answeredQuestions).length;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Progress Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {answeredCount} answered
          </span>
        </div>
        <span className="text-sm font-medium text-indigo-600">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
          />
        </div>
        
        {/* Current Position Indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow-sm"
          style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />
      </div>

      {/* Question Dots */}
      <div className="flex items-center justify-between space-x-1 overflow-x-auto pb-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isAnswered = answeredQuestions[index] !== undefined;
          const isCurrent = index === currentQuestion;
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onQuestionClick && onQuestionClick(index)}
              className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                transition-all duration-200 relative
                ${isCurrent 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : isAnswered 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
            >
              {isAnswered && !isCurrent ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
              
              {/* Current Question Pulse */}
              {isCurrent && (
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-indigo-600 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1">
          <Circle className="w-3 h-3 text-gray-400" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;