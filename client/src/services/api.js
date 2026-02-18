import axios from 'axios';

const baseURL = 'http://localhost:5000';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with Authorization header
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API functions
export const createTask = async (data) => {
  const response = await apiClient.post('/api/tasks', data);
  return response.data;
};

export const getTodayTasks = async () => {
  console.log('API: Calling getTodayTasks...');
  const response = await apiClient.get('/api/tasks/today');
  console.log('API: getTodayTasks response:', response.data);
  return response.data;
};

export const getTasksByDate = async (date) => {
  const response = await apiClient.get(`/api/tasks/by-date?date=${date}`);
  return response.data;
};

export const toggleComplete = async (taskId, status) => {
  const response = await apiClient.patch(`/api/tasks/${taskId}/complete`, {
    status,
  });
  return response.data;
};

export const toggleDial = async (taskId) => {
  const response = await apiClient.patch(`/api/tasks/${taskId}/toggle-dial`);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/api/tasks/${taskId}`);
  return response.data;
};

export const getAllTasks = async () => {
  const response = await apiClient.get('/api/tasks/all');
  return response.data;
};
