import apiClient from './api';

export const quizService = {
  // Get quiz questions for a folder
  generateQuiz: async (folderId) => {
    const response = await apiClient.get(`/quiz/${folderId}`);
    return response.data;
  },

  // Submit quiz results (future enhancement)
  submitQuizResult: async (resultData) => {
    const response = await apiClient.post('/quiz/results', resultData);
    return response.data;
  },

  // Get user's quiz history (future enhancement)
  getQuizHistory: async (userId) => {
    const response = await apiClient.get(`/quiz/history/${userId}`);
    return response.data;
  },

  // Get quiz analytics (future enhancement)
  getQuizAnalytics: async (folderId) => {
    const response = await apiClient.get(`/quiz/analytics/${folderId}`);
    return response.data;
  }
};