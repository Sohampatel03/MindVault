import { useState, useEffect } from 'react';
import { folderService } from '../services/folderService';
import { useAuth } from '../context/AuthContext';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFolders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await folderService.getAllFolders();
      setFolders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (folderData) => {
    setLoading(true);
    try {
      const newFolder = await folderService.createFolder(folderData);
      setFolders(prev => [newFolder, ...prev]);
      setError(null);
      return newFolder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await folderService.deleteFolder(folderId);
      setFolders(prev => prev.filter(folder => folder._id !== folderId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  return {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    refetch: fetchFolders
  };
};