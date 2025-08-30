import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { useFolders } from '../hooks/useFolders';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

// Components
import Button from '../components/ui/Button';
import FolderCard from '../components/folders/FolderCard';
import CreateFolderModal from '../components/folders/CreateFolderModal';

const FoldersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { folders, createFolder, deleteFolder, loading } = useFolders();
  const { toast } = useToast();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = folders?.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateFolder = async (folderData) => {
    try {
      await createFolder(folderData);
      toast.success('Folder created successfully!');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const folder = folders.find(f => f._id === folderId);
    if (window.confirm(`Delete "${folder?.name}"? This cannot be undone.`)) {
      try {
        await deleteFolder(folderId);
        toast.success('Folder deleted');
      } catch (error) {
        toast.error('Failed to delete folder');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">My Folders</h1>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Folders Grid */}
          {filteredFolders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredFolders.map((folder, index) => (
                <motion.div
                  key={folder._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FolderCard
                    folder={folder}
                    onOpen={() => navigate(`/folder/${folder._id}`)}
                    onView={() => navigate(`/folder/${folder._id}`)}
                    onEdit={() => {/* TODO: Edit functionality */}}
                    onDelete={() => handleDeleteFolder(folder._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-xl p-12">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No folders found' : 'No folders yet'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `No folders match "${searchQuery}". Try a different search term.`
                    : 'Create your first folder to start organizing your study materials.'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Folder
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
        loading={loading}
      />
    </div>
  );
};

export default FoldersPage;
