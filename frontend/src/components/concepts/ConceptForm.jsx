import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Image as ImageIcon, Wand2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ImageUpload from './ImageUpload';

const ConceptForm = ({ onSubmit, loading = false, folderId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState({});

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
    setErrors(prev => ({ ...prev, content: '' }));
  };

  const handleRemoveImage = () => {
    if (formData.image?.preview) {
      URL.revokeObjectURL(formData.image.preview);
    }
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Concept name is required';
    }
    if (!formData.description.trim() && !formData.image) {
      newErrors.content = 'Please provide either a description or upload an image';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const conceptData = {
        folderId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image?.file
      };

      await onSubmit(conceptData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: null
      });
    } catch (error) {
      setErrors({ submit: 'Failed to create concept. Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Concept</h2>
          <p className="text-gray-600">Add study materials and let AI generate quiz questions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Concept Name */}
        <div>
          <Input
            label="Concept Name"
            placeholder="e.g., Photosynthesis, World War 2, Calculus..."
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            error={errors.name}
            required
            icon={FileText}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            placeholder="Add notes, explanations, or key points about this concept..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={4}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Image <span className="text-gray-400">(optional)</span>
          </label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={formData.image}
            onRemoveImage={handleRemoveImage}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Upload images of notes, diagrams, or textbook pages for better AI quiz generation
          </p>
        </div>

        {/* Content Error */}
        {errors.content && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{errors.content}</p>
          </motion.div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{errors.submit}</p>
          </motion.div>
        )}

        {/* AI Features Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200"
        >
          <div className="flex items-start space-x-3">
            <Wand2 className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">AI-Powered Quiz Generation</h4>
              <p className="text-sm text-purple-700">
                Our AI will analyze your content and automatically generate relevant multiple-choice questions 
                for effective studying and revision.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={loading}
          >
            <Brain className="w-4 h-4 mr-2" />
            {loading ? 'Creating Concept...' : 'Create Concept'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ConceptForm;