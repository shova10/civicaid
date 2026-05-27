import api from './api'

export const registerUser = (userData) =>
  api.post('/api/auth/register/', userData)
export const loginUser = (credentials) =>
  api.post('/api/auth/login/', credentials)
export const getProfile = async () => {
  const res = await api.get('/api/auth/profile/')
  return res.data
}
export const getAdminUsers = async () => {
  const res = await api.get(`/api/admin/users/`)
  return res.data
}

export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/api/admin/users/${userId}/`, { role })
  return res.data
}

export const toggleUserActive = async (userId, isActive) => {
  const res = await api.patch(`/api/admin/users/${userId}/`, {
    is_active: isActive,
  })
  return res.data
}

export const forgotPassword = (email) =>
  api.post('/api/auth/forgot-password/', { email })

export const changePassword = (data) =>
  api.post('/api/auth/change-password/', data)

export const resetPassword = (data) =>
  api.post('/api/auth/reset-password/', data)
