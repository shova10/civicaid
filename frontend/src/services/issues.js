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
  const response = await api.get('/api/issues/heatmap/')
  return response.data
}

export async function getAdminSummary() {
  const response = await api.get('/api/admin/summary/')
  return response.data
}

export async function adminUpdateIssue(id, payload) {
  const response = await api.patch(`/api/admin/complaints/:id/status/`, payload)
  return response.data
}

export async function getStaffList() {
  const response = await api.get('/api/admin/staff/')
  return response.data
}

export async function bulkUpdateIssues(payload) {
  const response = await api.post('/api/admin/issues/bulk-update/', payload)
  return response.data
}

export async function getStaffIssues() {
  const response = await api.get('/api/staff/issues/')
  return response.data
}

export async function staffUpdateStatus(id, status) {
  const response = await api.patch(`/api/staff/issues/:id/status/`, {
    status,
  })
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
