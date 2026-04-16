const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export function getApiBase() {
  return API_BASE
}

export async function apiFetch(path: string, init: RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers || {})
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed: ${res.status}`
    throw new Error(msg)
  }
  return data
}

