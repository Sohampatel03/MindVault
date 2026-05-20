import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useConcepts } from '../hooks/useConcepts';
import Button from '../components/ui/Button';
import ConceptForm from '../components/concepts/ConceptForm';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditConceptPage = () => {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchConceptById, updateConcept, deleteConcept, loading } = useConcepts();

  const [concept, setConcept] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    { label: concept?.conceptName || 'Concept', href: `/concept/${conceptId}` },
    { label: 'Edit', href: '#', current: true },
  ];

  const handleSubmit = async (conceptData) => {
    setIsSubmitting(true);
    try {
      await updateConcept(conceptId, conceptData);
      toast.success('Concept updated successfully! 🎉');
      navigate(`/concept/${conceptId}`);
    } catch {
      toast.error('Failed to update concept. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (loading && !concept) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!loading && !concept) {
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
                onClick={() => navigate(`/concept/${conceptId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Concept</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Concept</h1>
                <p className="text-gray-600">Update your study materials</p>
              </div>
            </div>
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
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ConceptForm
              onSubmit={handleSubmit}
              loading={isSubmitting}
              folderId={folderId}
              initialData={{
                name: concept.conceptName,
                description: concept.description,
                imageUrl: concept.imageUrl,
              }}
              isEdit
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Editing Tips</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📝 For Text Content:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Update key terms and definitions</li>
                  <li>• Add or modify important facts</li>
                  <li>• AI will regenerate quiz questions on save</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📸 For Image Content:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Replace with clearer images</li>
                  <li>• Ensure good image quality for OCR</li>
                  <li>• AI will re-analyze new content</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EditConceptPage;