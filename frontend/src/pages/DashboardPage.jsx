import React from 'react';
import { FolderOpen, Brain, Trophy, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">MindVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-indigo-100 mb-4">Ready to continue your learning journey?</p>
            <Button className="bg-white text-indigo-600 hover:bg-gray-50">
              Continue Learning
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Folders</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Concepts</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Quizzes Taken</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">0 days</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">🚀 Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              Phase 2 will include folder management, concept creation, and more exciting features!
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                <FolderOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">My Folders</h3>
                <p className="text-sm text-gray-600">Organize your study materials efficiently</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">AI Concepts</h3>
                <p className="text-sm text-gray-600">Create smart study concepts with AI</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Quiz Results</h3>
                <p className="text-sm text-gray-600">Track progress and performance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;