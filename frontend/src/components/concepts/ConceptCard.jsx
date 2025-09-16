import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Calendar, MoreVertical, Edit, Trash2, Eye, Brain } from 'lucide-react';
import Button from '../ui/Button';

const ConceptCard = ({ concept, onView, onEdit, onDelete, onQuiz }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      {concept.imageUrl && (
        <div className="relative h-48 bg-gray-100">
          <img
            src={concept.imageUrl}
            alt={concept.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                className="bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100"
                onClick={() => onView(concept)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Header with Menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {concept.name}
            </h3>
          </div>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </motion.button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-32"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    onView(concept);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit(concept);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(concept);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        {concept.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {concept.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {concept.imageUrl ? (
                <Image className="w-3 h-3 mr-1" />
              ) : (
                <FileText className="w-3 h-3 mr-1" />
              )}
              <span>{concept.imageUrl ? 'Image' : 'Text'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{new Date(concept.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quiz Question Preview */}
        {concept.question && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg mb-4 border border-indigo-100">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-800">AI Generated Question</span>
            </div>
            <p className="text-sm text-indigo-700 line-clamp-2">
              {concept.question.question}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(concept)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConceptCard;