import { apiFetch } from './client'
import { auth } from '../store/auth'

export type LectureLaw = { equation: string; title: string; description: string }
export type LectureAttachment = { id: string; name: string; sizeLabel: string; kind: 'pdf' | 'doc' }

export type LectureDto = {
  id: string
  unit: string
  title: string
  description: string
  youtubeId: string
  difficulty: 'easy' | 'medium' | 'hard'
  videosCount: number
  laws: LectureLaw[]
  attachments: LectureAttachment[]
  createdAt?: number
}

export type QuizQuestionDto = {
  id: string
  prompt: string
  choices: { id: string; text: string }[]
  correctChoiceId?: string
  explanation: string
}

export type QuizDto = {
  id: string
  title: string
  level: 'easy' | 'medium' | 'hard'
  minutes: number
  relatedLectureId?: string | null
  visibleFrom?: number | null
  visibleUntil?: number | null
  questionCount?: number
  isPublished?: boolean
  questions?: QuizQuestionDto[]
}

export async function fetchLectures() {
  const data = await apiFetch('/content/lectures')
  return data.lectures as LectureDto[]
}

export async function fetchLectureById(lectureId: string) {
  const data = await apiFetch(`/content/lectures/${lectureId}`)
  return data.lecture as LectureDto
}

export async function fetchStudentQuizzes() {
  const token = auth.token()
  if (!token) return []
  const data = await apiFetch('/content/quizzes', {}, token)
  return data.quizzes as QuizDto[]
}

export async function fetchQuizById(quizId: string) {
  const token = auth.token()
  if (!token) throw new Error('غير مسجل الدخول')
  const data = await apiFetch(`/content/quizzes/${quizId}`, {}, token)
  return data.quiz as QuizDto
}

export async function submitQuizAttempt(payload: {
  quizId: string
  answers: Record<string, string>
  correct: number
  total: number
  startedAt: number
  finishedAt: number
}) {
  const token = auth.token()
  if (!token) throw new Error('غير مسجل الدخول')
  return apiFetch('/quiz-attempts', { method: 'POST', body: JSON.stringify(payload) }, token)
}

export async function adminFetchLectures() {
  return (await apiFetch('/admin/lectures', {}, auth.token() ?? undefined)).lectures as LectureDto[]
}

export async function adminCreateLecture(payload: Omit<LectureDto, 'id' | 'createdAt'>) {
  return (await apiFetch('/admin/lectures', { method: 'POST', body: JSON.stringify(payload) }, auth.token() ?? undefined))
    .lecture as LectureDto
}

export async function adminFetchQuizzes() {
  return (await apiFetch('/admin/quizzes', {}, auth.token() ?? undefined)).quizzes as QuizDto[]
}

export async function adminCreateQuiz(payload: {
  title: string
  level: 'easy' | 'medium' | 'hard'
  minutes: number
  relatedLectureId?: string | null
  visibleFrom?: number | null
  visibleUntil?: number | null
  isPublished: boolean
  questions: QuizQuestionDto[]
}) {
  return (await apiFetch('/admin/quizzes', { method: 'POST', body: JSON.stringify(payload) }, auth.token() ?? undefined))
    .quiz as QuizDto
}

export async function adminFetchSubmissions() {
  return (await apiFetch('/admin/submissions', {}, auth.token() ?? undefined)).submissions as Array<{
    id: string
    quizId: string
    studentName: string
    studentCode: string
    email: string
    scorePercent: number
    correct: number
    total: number
    finishedAt: number
  }>
}

