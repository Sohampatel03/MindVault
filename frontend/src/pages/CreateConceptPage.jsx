import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useConcepts } from '../hooks/useConcepts';

// Components
import Button from '../components/ui/Button';
import ConceptForm from '../components/concepts/ConceptForm';
import Breadcrumb from '../components/common/Breadcrumb';

const CreateConceptPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createConcept, loading } = useConcepts();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Folders', href: '/folders' },
    { label: 'Folder Details', href: `/folder/${folderId}` },
    { label: 'Create Concept', href: '#', current: true }
  ];

  const handleSubmit = async (conceptData) => {
    try {
      await createConcept(conceptData);
      toast.success('Concept created successfully! 🎉');
      navigate(`/folder/${folderId}`);
    } catch (error) {
      toast.error('Failed to create concept. Please try again.');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-2xl font-bold text-gray-900">Create New Concept</h1>
                <p className="text-gray-600">Add study materials and generate AI quiz questions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ConceptForm
              onSubmit={handleSubmit}
              loading={loading}
              folderId={folderId}
            />
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Better AI Quiz Generation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📝 For Text Content:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Include key terms and definitions</li>
                  <li>• Add important facts and dates</li>
                  <li>• Mention relationships between concepts</li>
                  <li>• Use clear, concise language</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📸 For Image Content:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Upload clear, readable images</li>
                  <li>• Include diagrams and charts</li>
                  <li>• Scan handwritten notes clearly</li>
                  <li>• Avoid blurry or low-quality images</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateConceptPage;