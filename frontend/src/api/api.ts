import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});

export const getApps = (ageGroup?: string, tag?: string) =>
  api.get('/apps/', { params: { age_group: ageGroup, tag } });

export const getAppFeedback = (appId: string) =>
  api.get(`/feedback/${appId}`);

export const postFeedback = (data: {
  app_id: string;
  thumbs_up: boolean;
  comment?: string;
  age_group?: string;
}) => api.post('/feedback/', data);

export default api;