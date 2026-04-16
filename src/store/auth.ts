import { apiFetch } from '../api/client'
import { readJson, writeJson } from './storage'

export type User = {
  id: string
  name: string
  email: string
  studentCode: string
  role: 'student' | 'admin'
  avatarId: string
  createdAt: number
}

type Session = { token: string; user: User } | null

const SESSION_KEY = 'pl_session_v1'

function readSession(): Session {
  return readJson<Session>(SESSION_KEY, null)
}

function writeSession(session: Session) {
  writeJson(SESSION_KEY, session)
}

export const auth = {
  isLoggedIn(): boolean {
    const session = readSession()
    return !!session?.token
  },

  currentUser(): User | null {
    const session = readSession()
    return session?.user ?? null
  },

  token(): string | null {
    return readSession()?.token ?? null
  },

  async signup(input: {
    name: string
    email: string
    studentCode: string
    avatarId: string
    password: string
  }): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      writeSession({ token: data.token as string, user: data.user as User })
      return { ok: true }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  },

  async login(input: { email?: string; studentCode?: string; password: string }) {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      writeSession({ token: data.token as string, user: data.user as User })
      return { ok: true as const }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  },

  logout() {
    const token = readSession()?.token
    if (token) {
      void apiFetch('/auth/logout', { method: 'POST' }, token).catch(() => undefined)
    }
    writeSession(null)
  },

  isAdmin() {
    return readSession()?.user.role === 'admin'
  },

  updateProfile(patch: Partial<Pick<User, 'name' | 'avatarId'>>) {
    const session = readSession()
    if (!session) return
    const updated = { ...session.user, ...patch }
    writeSession({ ...session, user: updated })
    void apiFetch('/auth/me', { method: 'PATCH', body: JSON.stringify(patch) }, session.token).catch(
      () => undefined,
    )
  },
}

