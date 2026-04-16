import { apiFetch } from '../api/client'
import { auth } from './auth'
import { readJson, writeJson } from './storage'

export type QuizAttempt = {
  quizId: string
  startedAt: number
  finishedAt: number
  correct: number
  total: number
  answers: Record<string, string>
}

export type ProgressState = {
  lectureWatch: Record<string, number> // 0..1
  completedLectures: Record<string, boolean>
  unlockedQuizzes: Record<string, boolean>
  quizAttempts: Record<string, QuizAttempt[]>
  points: number
  badges: string[]
  activity: { at: number; text: string; pointsDelta?: number }[]
}

const KEY = 'pl_progress_v1'

const initial: ProgressState = {
  lectureWatch: {},
  completedLectures: {},
  unlockedQuizzes: {},
  quizAttempts: {},
  points: 0,
  badges: [],
  activity: [],
}

function read(): ProgressState {
  return readJson<ProgressState>(KEY, initial)
}

function write(next: ProgressState) {
  writeJson(KEY, next)
}

function syncToServer(next: ProgressState) {
  const token = auth.token()
  if (!token) return
  void apiFetch('/progress', { method: 'PUT', body: JSON.stringify({ progress: next }) }, token).catch(
    () => undefined,
  )
}

export const progress = {
  async hydrateFromServer() {
    const token = auth.token()
    if (!token) return
    try {
      const data = await apiFetch('/progress', {}, token)
      if (data?.progress && typeof data.progress === 'object') {
        write(data.progress as ProgressState)
      }
    } catch {
      // keep local state when server unavailable
    }
  },

  get(): ProgressState {
    return read()
  },

  lectureWatchPercent(lectureId: string) {
    return read().lectureWatch[lectureId] ?? 0
  },

  setLectureWatch(lectureId: string, value01: number) {
    const s = read()
    const next = Math.max(0, Math.min(1, value01))
    const prev = s.lectureWatch[lectureId] ?? 0
    s.lectureWatch[lectureId] = Math.max(prev, next) // never go backwards
    if (s.lectureWatch[lectureId] >= 0.8) {
      s.completedLectures[lectureId] = true
    }
    write(s)
    syncToServer(s)
  },

  unlockQuiz(quizId: string) {
    const s = read()
    s.unlockedQuizzes[quizId] = true
    write(s)
    syncToServer(s)
  },

  isQuizUnlocked(quizId: string) {
    return !!read().unlockedQuizzes[quizId]
  },

  addAttempt(attempt: QuizAttempt) {
    const s = read()
    const arr = s.quizAttempts[attempt.quizId] ?? []
    arr.unshift(attempt)
    s.quizAttempts[attempt.quizId] = arr.slice(0, 20)
    const scorePct = attempt.total ? attempt.correct / attempt.total : 0
    const gained = Math.round(50 * scorePct)
    s.points += gained
    s.activity.unshift({
      at: Date.now(),
      text: `حصلت على ${Math.round(scorePct * 100)}% في اختبار`,
      pointsDelta: gained,
    })
    s.activity = s.activity.slice(0, 30)
    write(s)
    syncToServer(s)
  },
}

