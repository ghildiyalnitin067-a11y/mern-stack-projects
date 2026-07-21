

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiFetch = (path, options = {}) => {
  const token = localStorage.getItem('tasktusk_token')
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  return fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    },
    ...options
  })
}
