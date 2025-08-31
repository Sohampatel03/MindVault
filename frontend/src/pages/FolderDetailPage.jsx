// src/pages/FolderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Search, 
  Filter,
  Brain,
  Target,
  BarChart3
} from 'lucide-react';
import { useConcepts } from '../hooks/useConcepts';
import { useToast } from '../hooks/useToast';

// Components
import Button from '../components/ui/Button';
import ConceptCard from '../components/concepts/ConceptCard';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const FolderDetailPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { concepts, loading, fetchConcepts, deleteConcept } = useConcepts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, text, image
  const [folderName, setFolderName] = useState('Folder');

  useEffect(() => {
    if (folderId) {
      fetchConcepts(folderId);
    }
  }, [folderId]);

  // Filter concepts based on search and filter
  const filteredConcepts = concepts?.filter(concept => {
    const matchesSearch = concept.conceptName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         concept.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'image' && concept.imageUrl) ||
                         (filter === 'text' && !concept.imageUrl);
    
    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate quiz stats
  const conceptsWithQuestions = concepts?.filter(c => c.question?.question) || [];
  const canStartQuiz = conceptsWithQuestions.length > 0;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Folders', href: '/folders' },
    { label: folderName, href: '#', current: true }
  ];

  const handleDeleteConcept = async (concept) => {
    if (window.confirm(`Delete "${concept.conceptName}"? This cannot be undone.`)) {
      try {
        await deleteConcept(concept._id);
        toast.success('Concept deleted successfully');
      } catch (error) {
        toast.error('Failed to delete concept');
      }
    }
  };

  const handleStartQuiz = () => {
    if (conceptsWithQuestions.length === 0) {
      toast.error('No concepts with quiz questions found. Create some concepts first!');
      return;
    }
    navigate(`/folder/${folderId}/quiz`);
  };

  const handleViewConcept = (concept) => {
    navigate(`/concept/${concept._id}`);
  };

  const handleEditConcept = (concept) => {
    navigate(`/concept/${concept._id}/edit`);
  };

  const handleQuizSingleConcept = (concept) => {
    if (!concept.question?.question) {
      toast.error('This concept does not have a quiz question yet.');
      return;
    }
    // Navigate to single concept quiz (future enhancement)
    navigate(`/concept/${concept._id}/quiz`);
  };

  if (loading && !concepts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/folders')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Folders</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{folderName}</h1>
                <p className="text-gray-600">
                  {filteredConcepts.length} concepts • {conceptsWithQuestions.length} with quiz questions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quiz Actions */}
              <Button
                variant="outline"
                onClick={handleStartQuiz}
                disabled={!canStartQuiz}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz ({conceptsWithQuestions.length})</span>
              </Button>
              
              <Button
                onClick={() => navigate(`/folder/${folderId}/create-concept`)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Concept</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Quiz Stats Banner */}
          {concepts && concepts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quiz Ready</h3>
                    <p className="text-gray-600">
                      {conceptsWithQuestions.length} questions available for practice
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{conceptsWithQuestions.length}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">~{Math.ceil(conceptsWithQuestions.length * 1.5)}m</div>
                    <div className="text-xs text-gray-500">Est. Time</div>
                  </div>
                  <Button
                    onClick={handleStartQuiz}
                    disabled={!canStartQuiz}
                    className="flex items-center space-x-2"
                    size="lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Quiz</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          {concepts && concepts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Concepts</option>
                  <option value="image">With Images</option>
                  <option value="text">Text Only</option>
                </select>
              </div>

              {/* View Analytics */}
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => navigate(`/folder/${folderId}/analytics`)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Button>
            </motion.div>
          )}

          {/* Concepts Grid */}
          {filteredConcepts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredConcepts.map((concept, index) => (
                <motion.div
                  key={concept._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ConceptCard
                    concept={{
                      ...concept,
                      name: concept.conceptName, // Map field name for display
                      createdAt: concept.createdAt || new Date()
                    }}
                    onView={handleViewConcept}
                    onEdit={handleEditConcept}
                    onDelete={handleDeleteConcept}
                    onQuiz={handleQuizSingleConcept}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-xl p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Plus className="w-10 h-10 text-indigo-600" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || filter !== 'all' ? 'No concepts found' : 'No concepts yet'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start adding concepts to this folder. Upload images or add text descriptions to create your study materials.'
                  }
                </p>
                
                {(!searchQuery && filter === 'all') && (
                  <Button
                    onClick={() => navigate(`/folder/${folderId}/create-concept`)}
                    size="lg"
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Concept</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FolderDetailPage;