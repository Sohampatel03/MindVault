import { useState, useEffect, useCallback } from 'react';
import { folderService } from '../services/folderService';
import { useAuth } from '../context/AuthContext';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFolders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await folderService.getAllFolders();
      setFolders(data);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      console.error('Error fetching folders:', message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getFolderById = useCallback(async (folderId) => {
    try {
      return await folderService.getFolderById(folderId);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error('Error fetching folder:', message);
      return null;
    }
  }, []);

  const createFolder = useCallback(async (folderData) => {
    setLoading(true);
    try {
      const newFolder = await folderService.createFolder(folderData);
      setFolders((prev) => [newFolder, ...prev]);
      setError(null);
      return newFolder;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFolder = useCallback(async (folderId) => {
    try {
      await folderService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw new Error(message);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    getFolderById,
    refetch: fetchFolders,
  };
};