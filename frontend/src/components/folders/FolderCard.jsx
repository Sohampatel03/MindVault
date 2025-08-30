import React, { useState } from 'react';
import { Folder, MoreHorizontal, Edit2, Trash2, Eye, Calendar } from 'lucide-react';

const FolderCard = ({ folder, onEdit, onDelete, onOpen, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative">
      {/* Main Content */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1" onClick={() => onOpen(folder._id)}>
          <div className="flex items-center mb-3">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4 group-hover:bg-indigo-200 transition-colors">
              <Folder className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {folder.name}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(folder.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-32">
              {/* View */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onView) onView(folder._id);
                  setShowActions(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-2" /> View
              </button>

              {/* Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(folder._id);
                  setShowActions(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder._id);
                  setShowActions(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
