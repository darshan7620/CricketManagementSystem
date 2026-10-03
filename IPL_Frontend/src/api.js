const API_BASE = import.meta.env.VITE_API_BASE || ''

function readMessage(data, status) {
  if (data == null || data === '') return `Request failed (${status})`
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    return data.message || data.error || `Request failed (${status})`
  }
  return `Request failed (${status})`
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    throw new Error(readMessage(data, res.status))
  }
  return data
}

export const playerApi = {
  signup: (body) => api('/player-api/auth/register', { method: 'POST', body }),
  login: (body) => api('/player-api/auth/login', { method: 'POST', body }),
  register: (body) => api('/player-api/register', { method: 'POST', body }),
  registerAll: (body) => api('/player-api/registerAll', { method: 'POST', body }),
  find: (id) => api(`/player-api/find/${id}`),
  findAll: () => api('/player-api/findAll'),
  update: (body) => api('/player-api/update', { method: 'PUT', body }),
  remove: (id) => api(`/player-api/delete/${id}`, { method: 'DELETE' }),
  removeAll: () => api('/player-api/deleteAll', { method: 'DELETE' }),
}

export const teamApi = {
  register: (body) => api('/team-api/register', { method: 'POST', body }),
  registerAll: (body) => api('/team-api/registerAll', { method: 'POST', body }),
  find: (id) => api(`/team-api/find/${id}`),
  findAll: () => api('/team-api/findAll'),
  update: (body) => api('/team-api/updateTeam', { method: 'PUT', body }),
  remove: (id) => api(`/team-api/delete/${id}`, { method: 'DELETE' }),
  removeAll: () => api('/team-api/deleteAll', { method: 'DELETE' }),
}
