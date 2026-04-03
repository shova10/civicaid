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
  const response = await api.get('/api/issues/')
  return response.data
}

export async function getMyIssueById(id) {
  const response = await api.get(`/api/issues/${id}/`)
  return response.data
}

export async function submitIssue(formData) {
  const response = await api.post('/api/issues/', formData)
  return response.data
}

export async function upvoteIssue(id) {
  const response = await api.post(`/api/issues/${id}/upvote/`)
  return response.data
}
export async function getHeatmapData() {
  const response = await api.get('/api/issues/heatmap/')
  return response.data
}
