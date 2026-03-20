import api from './axios'

export const submitIssue = (formData) => {
  return api.post('/issues', formData)
}

export const getIssues = () => {
  return api.get('/issues')
}

export const getIssueById = (id) => {
  return api.get(`/issues/${id}`)
} 