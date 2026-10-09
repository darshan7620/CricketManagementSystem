const API_BASE = import.meta.env.VITE_API_BASE || ''

export const SESSION_STORAGE_KEY = 'ipl-session'

let authToken = null
let onUnauthorized = null

export function setAuthToken(token) {
  authToken = token || null
}

// Fallback used before AuthProvider's effect has run (child effects fire before
// parent effects), so a hard refresh on a protected route still sends the token.
function persistedToken() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)?.token || null
  } catch {
    return null
  }
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function readMessage(data, status) {
  if (data == null || data === '') return `Request failed (${status})`
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    return data.message || data.error || `Request failed (${status})`
  }
  return `Request failed (${status})`
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = auth ? authToken || persistedToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0)
  }

  const text = await res.text()
  let data = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (res.status === 401 && auth) {
    onUnauthorized?.()
  }

  if (!res.ok) {
    throw new ApiError(readMessage(data, res.status), res.status)
  }
  return data
}

export const playerApi = {
  signup: (body) => api('/player-api/auth/register', { method: 'POST', body, auth: false }),
  login: (body) => api('/player-api/auth/login', { method: 'POST', body, auth: false }),
  register: (body) => api('/player-api/register', { method: 'POST', body }),
  registerAll: (body) => api('/player-api/registerAll', { method: 'POST', body }),
  find: (id) => api(`/player-api/find/${id}`),
  findAll: () => api('/player-api/findAll'),
  update: (body) => api('/player-api/update', { method: 'PUT', body }),
  remove: (id) => api(`/player-api/delete/${id}`, { method: 'DELETE' }),
  removeAll: () => api('/player-api/deleteAll', { method: 'DELETE' }),
}

export const adminApi = {
  login: (body) => api('/admin-api/auth/login', { method: 'POST', body, auth: false }),
}

export const teamApi = {
  register: (body) => api('/team-api/register', { method: 'POST', body }),
  registerAll: (body) => api('/team-api/registerAll', { method: 'POST', body }),
  find: (id) => api(`/team-api/find/${id}`),
  findAll: () => api('/team-api/findAll', { auth: false }),
  update: (body) => api('/team-api/updateTeam', { method: 'PUT', body }),
  remove: (id) => api(`/team-api/delete/${id}`, { method: 'DELETE' }),
  removeAll: () => api('/team-api/deleteAll', { method: 'DELETE' }),
}
