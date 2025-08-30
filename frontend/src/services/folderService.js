import apiClient from './api';

export const folderService = {
  getAllFolders: async () => {
    const response = await apiClient.get('/folders');
    return response.data;
  },

  createFolder: async (folderData) => {
    const response = await apiClient.post('/folders', folderData);
    return response.data;
  },

  getFolderById: async (folderId) => {
    const response = await apiClient.get(`/folders/${folderId}`);
    return response.data;
  },

  updateFolder: async (folderId, updates) => {
    const response = await apiClient.patch(`/folders/${folderId}`, updates);
    return response.data;
  },

  deleteFolder: async (folderId) => {
    const response = await apiClient.delete(`/folders/${folderId}`);
    return response.data;
  }
};
