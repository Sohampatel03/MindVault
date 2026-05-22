import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import QuizResults from '../components/quiz/QuizResults';

const QuizResultsPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const results = location.state?.results || null;
  const quiz = location.state?.quiz || null;
  const answers = location.state?.answers || {};

  useEffect(() => {
    if (!results || !quiz) {
      navigate(`/folder/${folderId}`, { replace: true });
    }
  }, [results, quiz, folderId, navigate]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Folders', href: '/folders' },
    { label: 'Folder Details', href: `/folder/${folderId}` },
    { label: 'Quiz Results', href: '#', current: true },
  ];

  if (!results || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz results found</p>
          <Button onClick={() => navigate(`/folder/${folderId}`)}>Back to Folder</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/folder/${folderId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Folder</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
                <p className="text-gray-600">
                  {results.correctAnswers}/{results.totalQuestions} correct • {results.percentage}%
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/folder/${folderId}/quiz`)}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <QuizResults
            results={results}
            quiz={quiz}
            answers={answers}
            onRetakeQuiz={() => navigate(`/folder/${folderId}/quiz`)}
            onBackToDashboard={() => navigate('/dashboard')}
            onBackToFolder={() => navigate(`/folder/${folderId}`)}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default QuizResultsPage;