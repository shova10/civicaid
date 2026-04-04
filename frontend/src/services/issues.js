import api from './api'

// export const submitIssue = (formData) => {
//   return api.post('/issues', formData)
// }

// export const getIssues = () => {
//   return api.get('/issues')
// }

// export const getIssueById = (id) => {
//   return api.get(`/issues/${id}`)
// }

// src/services/issues.js

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
  const response = await api.patch(`/api/admin/complaints/${id}/`, payload)
  return response.data
}

export async function getStaffList() {
  const response = await api.get('/api/admin/staff/')
  return response.data
}

export async function bulkUpdateIssues(payload) {
  const response = await api.post('/api/admin/complaints/bulk-update/', payload)
  return response.data
}

export async function getStaffIssues() {
  const response = await api.get('/api/staff/complaints/')
  return response.data
}

export async function staffUpdateStatus(id, status) {
  const response = await api.patch(`/api/staff/complaints/${id}/status/`, {
    status,
  })
  return response.data
}
