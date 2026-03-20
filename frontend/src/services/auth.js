import api from './axios'

export const registerUser = (userData) =>
  api.post('/api/auth/register/', userData)
export const loginUser = (credentials) =>
  api.post('/api/auth/login/', credentials)
export const getMe = () => api.get('/api/auth/profile/')
