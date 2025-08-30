// src/components/folders/CreateFolderModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CreateFolderModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }
    try {
      await onSubmit({ name: name.trim() });
      setName('');
      setError('');
    } catch (err) {
      setError('Failed to create folder');
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const suggestions = ['Mathematics', 'Science', 'History', 'Literature', 'Programming', 'Languages'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Folder className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Folder Name"
                  placeholder="e.g., Mathematics, History, Science..."
                  value={name}
                  onChange={setName}
                  error={error}
                  required
                />

                {/* Suggestion Chips */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Quick suggestions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setName(suggestion)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={loading}
                  >
                    Create Folder
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;