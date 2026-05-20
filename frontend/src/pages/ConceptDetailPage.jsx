import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Brain,
  Calendar,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useConcepts } from '../hooks/useConcepts';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ConceptDetailPage = () => {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchConceptById, deleteConcept, loading } = useConcepts();

  const [concept, setConcept] = useState(null);

  useEffect(() => {
    if (!conceptId) return;
    fetchConceptById(conceptId).then((data) => {
      if (data) setConcept(data);
    });
  }, [conceptId, fetchConceptById]);

  const folderId = concept?.folderId;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Folders', href: '/folders' },
    ...(folderId ? [{ label: 'Folder Details', href: `/folder/${folderId}` }] : []),
    { label: concept?.conceptName || 'Concept', href: '#', current: true },
  ];

  const handleEdit = () => navigate(`/concept/${conceptId}/edit`);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${concept.conceptName}"? This cannot be undone.`)) return;
    try {
      await deleteConcept(conceptId);
      toast.success('Concept deleted successfully');
      navigate(folderId ? `/folder/${folderId}` : '/folders');
    } catch {
      toast.error('Failed to delete concept');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!concept && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Concept Not Found</h2>
          <p className="text-gray-600 mb-6">
            This concept doesn't exist or you don't have access.
          </p>
          <Button onClick={() => navigate('/folders')}>Back to Folders</Button>
        </motion.div>
      </div>
    );
  }

  if (!concept) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(folderId ? `/folder/${folderId}` : '/folders')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{concept.conceptName}</h1>
                <p className="text-gray-600">
                  {concept.imageUrl ? 'Image Concept' : 'Text Concept'} •{' '}
                  {new Date(concept.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {concept.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={concept.imageUrl}
                  alt={concept.conceptName}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white bg-opacity-90 text-purple-700 px-3 py-1 rounded-full text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {concept.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {concept.description}
              </p>
            </motion.div>
          )}

          {concept.question?.question && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Generated Question</h3>
                  <p className="text-sm text-gray-600">Test your knowledge</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <p className="text-gray-800 font-medium mb-3">{concept.question.question}</p>
                <div className="space-y-2">
                  {concept.question.options?.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isCorrect = optionLetter === concept.question.answer;
                    return (
                      <div
                        key={optionLetter}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span
                          className={`text-sm ${
                            isCorrect ? 'text-green-800 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {option}
                        </span>
                        {isCorrect && (
                          <span className="text-xs text-green-600 font-medium ml-auto">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-gray-900">
                    {new Date(concept.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {concept.imageUrl ? (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-gray-900">{concept.imageUrl ? 'Image' : 'Text'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ConceptDetailPage;