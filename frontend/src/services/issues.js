import api from './api'

export async function getMyIssues() {
  const response = await api.get('/api/complaints/')
  return response.data
}

export async function getMyIssueById(id) {
  const response = await api.get(`/api/complaints/${id}/`)
  return response.data
}

export async function submitIssue(formData) {
  const response = await api.post('/api/complaints/', formData)
  return response.data
}

export async function upvoteIssue(id) {
  const response = await api.post(`/api/complaints/${id}/upvote/`)
  return response.data
}

export async function getHeatmapData() {
  const response = await api.get('/api/complaints/heatmap/')
  return response.data
}

export async function getAdminSummary() {
  const response = await api.get('/api/admin/summary/')
  return response.data
}

export async function adminUpdateIssue(id, payload) {
  const response = await api.patch(
    `/api/admin/complaints/${id}/status/`,
    payload
  )
  return response.data
}

export async function getUserList() {
  const response = await api.get('/api/admin/users/')
  return response.data
}

export async function bulkUpdateIssues(payload) {
  const response = await api.post('/api/admin/complaints/bulk-update/', payload)
  return response.data
}

export async function getAllIssues() {
  const response = await api.get('/api/complaints/')
  return response.data
}

export async function getAdminIssues() {
  const response = await api.get('/api/admin/complaints/')
  return response.data
}

export async function getWeeklyStats() {
  const response = await api.get('/api/admin/trends/')
  return response.data
}
