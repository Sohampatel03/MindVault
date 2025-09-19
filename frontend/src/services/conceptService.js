import apiClient from './api';

export const conceptService = {
  getConcepts: async (folderId) => {
    const response = await apiClient.get(`/concepts/folder/${folderId}`);
    return response.data;
  },

  createConcept: async (conceptData) => {
    const formData = new FormData();
    formData.append('folderId', conceptData.folderId);
    formData.append('name', conceptData.name);
    
    if (conceptData.description) {
      formData.append('description', conceptData.description);
    }
    if (conceptData.image) {
      formData.append('image', conceptData.image);
    }

    const response = await apiClient.post('/concepts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getConceptById: async (conceptId) => {
    const response = await apiClient.get(`/concepts/${conceptId}`);
    return response.data;
  },

  updateConcept: async (conceptId, updates) => {
    const response = await apiClient.patch(`/concepts/${conceptId}`, updates);
    return response.data;
  },

  deleteConcept: async (conceptId) => {
    const response = await apiClient.delete(`/concepts/${conceptId}`);
    return response.data;
  }
};
