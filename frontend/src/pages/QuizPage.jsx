// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Custom Hooks
import { useQuiz } from '../hooks/useQuiz';
import { useToast } from '../hooks/useToast';

// Components
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Breadcrumb from '../components/common/Breadcrumb';
import Timer from '../components/quiz/Timer';
import ProgressBar from '../components/quiz/ProgressBar';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizResults from '../components/quiz/QuizResults';

const QuizPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    quiz,
    currentQuestion,
    answers,
    timeElapsed,
    isActive,
    loading,
    error,
    isQuizComplete,
    loadQuiz,
    startQuiz,
    stopQuiz,
    resetQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    calculateResults,
    getCurrentQuestion,
    getProgress
  } = useQuiz();

  const [quizState, setQuizState] = useState('loading'); // loading, ready, active, paused, completed
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Load quiz on component mount
  useEffect(() => {
    if (folderId) {
      loadQuiz(folderId)
        .then(() => {
          setQuizState('ready');
        })
        .catch(() => {
          setQuizState('error');
        });
    }
  }, [folderId]);

  // Auto-complete quiz when all questions answered
  useEffect(() => {
    if (isQuizComplete && quizState === 'active') {
      handleCompleteQuiz();
    }
  }, [isQuizComplete, quizState]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Folders', href: '/folders' },
    { label: 'Folder Details', href: `/folder/${folderId}` },
    { label: 'Quiz', href: '#', current: true }
  ];

  const handleStartQuiz = () => {
    setQuizState('active');
    startQuiz();
    toast.success('Quiz started! Good luck! 🚀');
  };

  const handlePauseResume = () => {
    if (isActive) {
      stopQuiz();
      setQuizState('paused');
      toast.info('Quiz paused');
    } else {
      startQuiz();
      setQuizState('active');
      toast.info('Quiz resumed');
    }
  };

  const handleCompleteQuiz = () => {
    stopQuiz();
    setQuizState('completed');
    toast.success('Quiz completed! 🎉');
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    setQuizState('ready');
    toast.info('Quiz reset. Ready to start again!');
  };

  const handleExitQuiz = () => {
    if (quizState === 'active' || quizState === 'paused') {
      setShowConfirmExit(true);
    } else {
      navigate(`/folder/${folderId}`);
    }
  };

  const confirmExit = () => {
    resetQuiz();
    navigate(`/folder/${folderId}`);
  };

  const handleAnswerSelect = (answer) => {
    const currentQ = getCurrentQuestion();
    if (currentQ) {
      answerQuestion(currentQ.conceptId, answer);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      nextQuestion();
    } else if (isQuizComplete) {
      handleCompleteQuiz();
    }
  };

  // Loading State
  if (loading || quizState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingSpinner size="xl" />
          <p className="text-gray-600 mt-4">Loading quiz questions...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error || quizState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'No quiz questions found for this folder.'}</p>
          <div className="space-y-3">
            <Button onClick={() => navigate(`/folder/${folderId}`)}>
              Back to Folder
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/folder/${folderId}/create-concept`)}
            >
              Add Concepts
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleExitQuiz}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Quiz</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {quizState === 'completed' ? 'Quiz Results' : 'Quiz Mode'}
                </h1>
                <p className="text-gray-600">
                  {quiz ? `${quiz.length} questions` : 'Loading...'}
                </p>
              </div>
            </div>

            {/* Timer & Controls */}
            {(quizState === 'active' || quizState === 'paused') && (
              <Timer
                timeElapsed={timeElapsed}
                isActive={isActive}
                onToggle={handlePauseResume}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Quiz Ready State */}
            {quizState === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center bg-white rounded-xl p-12 shadow-sm"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Brain className="w-10 h-10 text-indigo-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Quiz?</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Test your knowledge with {quiz?.length || 0} AI-generated questions. 
                  Take your time and do your best!
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handleStartQuiz}
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Quiz</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/folder/${folderId}`)}
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Active Quiz State */}
            {(quizState === 'active' || quizState === 'paused') && quiz && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Progress Bar */}
                <ProgressBar
                  totalQuestions={quiz.length}
                  currentQuestion={currentQuestion}
                  answeredQuestions={answers}
                  onQuestionClick={goToQuestion}
                />

                {/* Pause Overlay */}
                <AnimatePresence>
                  {quizState === 'paused' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white p-8 rounded-xl text-center max-w-sm"
                      >
                        <Pause className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Paused</h3>
                        <p className="text-gray-600 mb-6">Ready to continue?</p>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowConfirmExit(true)}
                          >
                            Exit Quiz
                          </Button>
                          <Button onClick={handlePauseResume}>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Current Question */}
                <QuestionCard
                  question={getCurrentQuestion()}
                  currentAnswer={answers[getCurrentQuestion()?.conceptId]}
                  onAnswerSelect={handleAnswerSelect}
                  onNext={handleNextQuestion}
                  onPrevious={previousQuestion}
                  isFirst={currentQuestion === 0}
                  isLast={currentQuestion === quiz.length - 1}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={quiz.length}
                />
              </motion.div>
            )}

            {/* Quiz Completed State */}
            {quizState === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <QuizResults
                  results={calculateResults()}
                  quiz={quiz}
                  answers={answers}
                  onRetakeQuiz={handleRetakeQuiz}
                  onBackToDashboard={() => navigate('/dashboard')}
                  onBackToFolder={() => navigate(`/folder/${folderId}`)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showConfirmExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full"
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exit Quiz?</h3>
                <p className="text-gray-600 mb-6">
                  Your progress will be lost if you exit now. Are you sure?
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmExit(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmExit}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;