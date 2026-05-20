import apiClient from './api';

export const quizService = {
  generateQuiz: async (folderId) => {
    const response = await apiClient.get(`/quiz/${folderId}`);
    return response.data;
  },

  submitQuizResult: async (folderId, resultData) => {
    const response = await apiClient.post(`/quiz/${folderId}/results`, resultData);
    return response.data;
  },

  getQuizHistory: async (folderId) => {
    const url = folderId ? `/quiz/history/${folderId}` : '/quiz/history';
    const response = await apiClient.get(url);
    return response.data;
  },

  getQuizAnalytics: async (folderId) => {
    const response = await apiClient.get(`/quiz/analytics/${folderId}`);
    return response.data;
  },
};