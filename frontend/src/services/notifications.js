import api from './api'

export async function getNotifications() {
  const response = await api.get('/api/notifications/')
  return response.data
}

export async function markNotificationRead(id) {
  const response = await api.patch(`/api/notifications/${id}/read/`)
  return response.data
}

export async function markAllNotificationsRead() {
  const response = await api.post('/api/notifications/mark-all-read/')
  return response.data
}

export async function getUnreadCount() {
  const response = await api.get('/api/notifications/unread-count/')
  return response.data
}
