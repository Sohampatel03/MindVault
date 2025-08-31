// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Brain, 
  Trophy, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Play,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFolders } from '../hooks/useFolders';
import { useToast } from '../hooks/useToast';

// Components
import Button from '../components/ui/Button';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import CreateFolderModal from '../components/folders/CreateFolderModal';
import QuizCard from '../components/quiz/QuizCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { folders, createFolder, loading } = useFolders();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { 
      title: 'Total Folders', 
      value: folders?.length || 0, 
      icon: FolderOpen, 
      color: 'indigo', 
      trend: '+12%' 
    },
    { 
      title: 'Concepts', 
      value: '24', 
      icon: Brain, 
      color: 'purple', 
      trend: '+8%' 
    },
    { 
      title: 'Quizzes Taken', 
      value: '12', 
      icon: Trophy, 
      color: 'green', 
      trend: '+15%' 
    },
    { 
      title: 'Study Streak', 
      value: '7 days', 
      icon: TrendingUp, 
      color: 'orange', 
      trend: '+5%' 
    }
  ];

  const handleCreateFolder = async (folderData) => {
    try {
      await createFolder(folderData);
      toast.success('Folder created successfully!');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const handleStartQuiz = (folderId) => {
    navigate(`/folder/${folderId}/quiz`);
  };

  const handleViewFolder = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">MindVault</h1>
              <p className="text-xs text-gray-500">AI Study Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/folders')}
            >
              My Folders
            </Button>
            <span className="text-gray-700 hidden sm:block">Welcome, {user?.name}!</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl mb-8 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black bg-opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
              }} />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-indigo-100 mb-6">Ready to boost your learning with AI-powered quizzes?</p>
              <div className="flex space-x-4">
                <Button 
                  className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white hover:bg-opacity-30"
                  onClick={() => navigate('/folders')}
                >
                  View Folders
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Create
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <QuickActions
              onCreateFolder={() => setShowCreateModal(true)}
              onUploadConcept={() => navigate('/folders')}
              onTakeQuiz={() => navigate('/folders')}
            />
          </motion.div>

          {/* Quiz Cards Section */}
          {folders && folders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Quick Quiz</h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/folders')}
                >
                  View All Folders
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.slice(0, 3).map((folder, index) => (
                  <motion.div
                    key={folder._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                  >
                    <QuizCard
                      folder={folder}
                      conceptCount={Math.floor(Math.random() * 8) + 2} // TODO: Get real count
                      onStartQuiz={handleStartQuiz}
                      onViewFolder={handleViewFolder}
                      lastScore={Math.floor(Math.random() * 40) + 60} // TODO: Get real score
                      averageTime={Math.floor(Math.random() * 5) + 3} // TODO: Get real time
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Folders Preview */}
          {folders && folders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Folders</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/folders')}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.slice(0, 3).map((folder, index) => (
                  <motion.div
                    key={folder._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.9 }}
                    onClick={() => navigate(`/folder/${folder._id}`)}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-indigo-100 rounded-lg mr-4 group-hover:bg-indigo-200 transition-colors">
                        <FolderOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(folder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State for No Folders */}
          {(!folders || folders.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center py-12 bg-white rounded-xl mt-8"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No folders yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Create your first folder to start organizing your study materials and generating AI quizzes.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Folder
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;