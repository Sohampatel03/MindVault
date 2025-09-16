import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, FolderOpen, Trophy, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-800">MindVault</span>
        </div>
        {/* <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button onClick={() => navigate('/register')}>
            Sign Up
          </Button>
        </div> */}
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Brain className="w-20 h-20 text-indigo-600 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Your AI-Powered Study Companion
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your study materials into interactive quizzes. Upload images, add notes, 
              and let AI generate personalized questions for effective revision.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={() => navigate('/register')}>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <FolderOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Organize Everything</h3>
              <p className="text-gray-600">Create folders and concepts to keep your study materials perfectly organized.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">AI-Generated Quizzes</h3>
              <p className="text-gray-600">Upload images or add text, and get intelligent multiple-choice questions instantly.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your learning journey with detailed analytics and performance insights.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Trusted by Students Everywhere</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
                <div className="text-gray-600">Concepts Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">100K+</div>
                <div className="text-gray-600">Quizzes Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6" />
            <span className="text-xl font-bold">MindVault</span>
          </div>
          <p className="text-gray-400 mb-6">Empowering students with AI-driven learning solutions</p>
          <p className="text-sm text-gray-500">© 2024 MindVault. Built with ❤️ for better learning.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;