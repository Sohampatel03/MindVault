import React from 'react';
import { FolderPlus, Upload, BookOpen, Target, Zap } from 'lucide-react';
import Button from '../ui/Button';

const QuickActions = ({ onCreateFolder, onUploadConcept, onTakeQuiz }) => {
  const actions = [
    {
      title: 'New Folder',
      description: 'Organize your study materials',
      icon: FolderPlus,
      onClick: onCreateFolder,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'Upload Notes',
      description: 'Add images or documents',
      icon: Upload,
      onClick: onUploadConcept,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Quick Quiz',
      description: 'Test your knowledge',
      icon: Target,
      onClick: onTakeQuiz,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center mb-6">
        <Zap className="w-5 h-5 text-indigo-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 group`}
          >
            <action.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">{action.title}</p>
            <p className="text-xs opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;