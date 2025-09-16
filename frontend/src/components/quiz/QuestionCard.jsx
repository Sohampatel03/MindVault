import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Image as ImageIcon, 
  FileText, 
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../ui/Button';

const QuestionCard = ({ 
  question, 
  currentAnswer, 
  onAnswerSelect, 
  showResult = false,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions
}) => {
  const [selectedOption, setSelectedOption] = useState(currentAnswer || '');
  const [showExplanation, setShowExplanation] = useState(false);

  // Update selectedOption when currentAnswer changes (when moving between questions)
  useEffect(() => {
    setSelectedOption(currentAnswer || '');
  }, [currentAnswer]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onAnswerSelect(option);
  };

  const isCorrect = showResult && selectedOption === question.question?.answer;
  const isIncorrect = showResult && selectedOption && selectedOption !== question.question?.answer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{question.name}</h3>
              <p className="text-sm text-gray-600">
                Question {questionNumber} of {totalQuestions}
              </p>
            </div>
          </div>
          
          {/* Question Type Badge */}
          <div className="flex items-center space-x-2">
            {question.imageUrl ? (
              <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                <ImageIcon className="w-3 h-3" />
                <span>Image</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                <FileText className="w-3 h-3" />
                <span>Text</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {/* Question Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h4 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
            {question.question?.question || 'Question not available'}
          </h4>
        </motion.div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.question?.options?.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === optionLetter;
            const isCorrectOption = showResult && optionLetter === question.question?.answer;
            const isWrongSelected = showResult && isSelected && !isCorrectOption;

            return (
              <motion.button
                key={optionLetter}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => !showResult && handleOptionSelect(optionLetter)}
                disabled={showResult}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all duration-200 relative
                  ${showResult
                    ? isCorrectOption
                      ? 'border-green-500 bg-green-50 cursor-default'
                      : isWrongSelected
                      ? 'border-red-500 bg-red-50 cursor-default'
                      : 'border-gray-200 bg-gray-50 cursor-default'
                    : isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  {/* Option Letter */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${showResult
                      ? isCorrectOption
                        ? 'bg-green-500 text-white'
                        : isWrongSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {optionLetter}
                  </div>

                  {/* Option Text */}
                  <span className={`
                    flex-1 text-sm
                    ${showResult
                      ? isCorrectOption
                        ? 'text-green-800 font-medium'
                        : isWrongSelected
                        ? 'text-red-800'
                        : 'text-gray-600'
                      : isSelected
                      ? 'text-indigo-900 font-medium'
                      : 'text-gray-700'
                    }
                  `}>
                    {option}
                  </span>

                  {/* Result Icons */}
                  {showResult && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {isCorrectOption ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : isWrongSelected ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : null}
                    </motion.div>
                  )}
                </div>

                {/* Selection Animation */}
                {isSelected && !showResult && (
                  <motion.div
                    layoutId="selectedOption"
                    className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="flex items-center space-x-2"
          >
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {/* Link to Concept */}
            {question.link && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(question.link, '_blank')}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Concept</span>
              </Button>
            )}
          </div>

          <Button
            onClick={onNext}
            disabled={!selectedOption}
            className="flex items-center space-x-2"
          >
            <span>{isLast ? 'Submit Quiz' : 'Next'}</span>
          </Button>
        </div>

        {/* Answer Feedback (for result mode) */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 rounded-lg border-l-4"
              style={{
                borderLeftColor: isCorrect ? '#10b981' : '#ef4444',
                backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2'
              }}
            >
              <div className="flex items-start space-x-3">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct! 🎉' : 'Incorrect 😔'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-red-700 mt-1">
                      The correct answer is: <strong>{question.question?.answer}</strong>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionCard;