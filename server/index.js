import express from 'express'
import cors from 'cors'
import { readDb, sanitizeUser, sha256, uid, writeDb } from './db.js'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: false,
  }),
)
app.use(express.json({ limit: '1mb' }))

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  const db = readDb()
  const session = db.sessions.find((s) => s.token === token)
  if (!session) return res.status(401).json({ error: 'Invalid token' })
  const user = db.users.find((u) => u.id === session.userId)
  if (!user) return res.status(401).json({ error: 'User not found' })

  req.db = db
  req.user = user
  req.token = token
  next()
}

function adminMiddleware(req, res, next) {
  if ((req.user.role ?? 'student') !== 'admin') {
    return res.status(403).json({ error: 'غير مسموح لك.' })
  }
  next()
}

function activeForStudents(quiz, now = Date.now()) {
  if (!quiz.isPublished) return false
  if (quiz.visibleFrom && now < Number(quiz.visibleFrom)) return false
  if (quiz.visibleUntil && now > Number(quiz.visibleUntil)) return false
  return true
}

function sanitizeQuizForStudent(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    level: quiz.level,
    minutes: quiz.minutes,
    relatedLectureId: quiz.relatedLectureId,
    visibleFrom: quiz.visibleFrom ?? null,
    visibleUntil: quiz.visibleUntil ?? null,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      choices: q.choices,
      explanation: q.explanation,
    })),
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'physics-lab-api' })
})

app.post('/api/auth/signup', (req, res) => {
  const { name, email, studentCode, avatarId, password } = req.body ?? {}
  if (!name || !email || !studentCode || !avatarId || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const db = readDb()
  const emailNormalized = String(email).trim().toLowerCase()
  const studentCodeNormalized = String(studentCode).trim().toUpperCase()
  if (db.users.some((u) => String(u.email).toLowerCase() === emailNormalized)) {
    return res.status(409).json({ error: 'البريد مستخدم بالفعل.' })
  }
  if (db.users.some((u) => String(u.studentCode).toUpperCase() === studentCodeNormalized)) {
    return res.status(409).json({ error: 'الكود الدراسي مستخدم بالفعل.' })
  }

  const user = {
    id: uid('u'),
    name: String(name).trim(),
    email: emailNormalized,
    studentCode: studentCodeNormalized,
    role: 'student',
    avatarId,
    passwordHash: sha256(String(password)),
    createdAt: Date.now(),
  }
  db.users.push(user)

  const token = uid('t')
  db.sessions.push({ token, userId: user.id, createdAt: Date.now() })
  if (!db.progressByUserId[user.id]) {
    db.progressByUserId[user.id] = {
      lectureWatch: {},
      completedLectures: {},
      unlockedQuizzes: {},
      quizAttempts: {},
      points: 0,
      badges: [],
      activity: [],
    }
  }
  writeDb(db)

  res.status(201).json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password, studentCode } = req.body ?? {}
  if ((!email && !studentCode) || !password) {
    return res.status(400).json({ error: 'Missing login credentials' })
  }
  const db = readDb()
  const user = db.users.find((u) => {
    if (studentCode) {
      return String(u.studentCode ?? '').toUpperCase() === String(studentCode).trim().toUpperCase()
    }
    return String(u.email).toLowerCase() === String(email).trim().toLowerCase()
  })
  if (!user) return res.status(404).json({ error: 'الحساب غير موجود.' })
  if (user.passwordHash !== sha256(String(password))) {
    return res.status(401).json({ error: 'كلمة المرور غير صحيحة.' })
  }

  const token = uid('t')
  db.sessions.push({ token, userId: user.id, createdAt: Date.now() })
  writeDb(db)
  res.json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  req.db.sessions = req.db.sessions.filter((s) => s.token !== req.token)
  writeDb(req.db)
  res.json({ ok: true })
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
})

app.patch('/api/auth/me', authMiddleware, (req, res) => {
  const { name, avatarId } = req.body ?? {}
  if (name !== undefined) req.user.name = String(name).trim()
  if (avatarId !== undefined) req.user.avatarId = avatarId
  writeDb(req.db)
  res.json({ user: sanitizeUser(req.user) })
})

app.get('/api/content/lectures', (_req, res) => {
  const db = readDb()
  res.json({ lectures: db.lectures ?? [] })
})

app.get('/api/content/lectures/:lectureId', (req, res) => {
  const db = readDb()
  const lecture = (db.lectures ?? []).find((l) => l.id === req.params.lectureId)
  if (!lecture) return res.status(404).json({ error: 'المحاضرة غير موجودة.' })
  res.json({ lecture })
})

app.get('/api/content/quizzes', authMiddleware, (req, res) => {
  const db = readDb()
  const now = Date.now()
  const quizzes = (db.quizzes ?? []).filter((q) => activeForStudents(q, now)).map((q) => ({
    id: q.id,
    title: q.title,
    level: q.level,
    minutes: q.minutes,
    relatedLectureId: q.relatedLectureId,
    visibleFrom: q.visibleFrom ?? null,
    visibleUntil: q.visibleUntil ?? null,
    questionCount: q.questions.length,
  }))
  res.json({ quizzes })
})

app.get('/api/content/quizzes/:quizId', authMiddleware, (req, res) => {
  const db = readDb()
  const quiz = (db.quizzes ?? []).find((q) => q.id === req.params.quizId)
  if (!quiz || !activeForStudents(quiz)) {
    return res.status(404).json({ error: 'الاختبار غير متاح الآن.' })
  }
  res.json({ quiz: sanitizeQuizForStudent(quiz) })
})

app.get('/api/progress', authMiddleware, (req, res) => {
  const p = req.db.progressByUserId[req.user.id] ?? {
    lectureWatch: {},
    completedLectures: {},
    unlockedQuizzes: {},
    quizAttempts: {},
    points: 0,
    badges: [],
    activity: [],
  }
  res.json({ progress: p })
})

app.put('/api/progress', authMiddleware, (req, res) => {
  const { progress } = req.body ?? {}
  if (!progress || typeof progress !== 'object') {
    return res.status(400).json({ error: 'Invalid progress payload' })
  }
  req.db.progressByUserId[req.user.id] = progress
  writeDb(req.db)
  res.json({ ok: true })
})

app.post('/api/quiz-attempts', authMiddleware, (req, res) => {
  const { quizId, answers, correct, total, startedAt, finishedAt } = req.body ?? {}
  if (!quizId || !answers || typeof correct !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'بيانات المحاولة ناقصة.' })
  }
  const submission = {
    id: uid('sub'),
    quizId,
    userId: req.user.id,
    studentName: req.user.name,
    studentCode: req.user.studentCode,
    email: req.user.email,
    correct,
    total,
    scorePercent: total > 0 ? Math.round((correct / total) * 100) : 0,
    answers,
    startedAt: startedAt ?? Date.now(),
    finishedAt: finishedAt ?? Date.now(),
  }
  req.db.submissions.unshift(submission)
  writeDb(req.db)
  res.status(201).json({ submission })
})

app.get('/api/admin/lectures', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ lectures: req.db.lectures ?? [] })
})

app.post('/api/admin/lectures', authMiddleware, adminMiddleware, (req, res) => {
  const { unit, title, description, youtubeId, difficulty, videosCount, laws, attachments } = req.body ?? {}
  if (!unit || !title || !description || !youtubeId) {
    return res.status(400).json({ error: 'بيانات المحاضرة ناقصة.' })
  }
  const lecture = {
    id: uid('lec'),
    unit,
    title,
    description,
    youtubeId,
    difficulty: difficulty ?? 'easy',
    videosCount: Number(videosCount ?? 1),
    laws: Array.isArray(laws) ? laws : [],
    attachments: Array.isArray(attachments) ? attachments : [],
    createdAt: Date.now(),
  }
  req.db.lectures.unshift(lecture)
  writeDb(req.db)
  res.status(201).json({ lecture })
})

app.get('/api/admin/quizzes', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ quizzes: req.db.quizzes ?? [] })
})

app.post('/api/admin/quizzes', authMiddleware, adminMiddleware, (req, res) => {
  const { title, level, minutes, relatedLectureId, visibleFrom, visibleUntil, isPublished, questions } = req.body ?? {}
  if (!title || !minutes || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'بيانات الاختبار ناقصة.' })
  }
  const quiz = {
    id: uid('quiz'),
    title,
    level: level ?? 'easy',
    minutes: Number(minutes),
    relatedLectureId: relatedLectureId || null,
    visibleFrom: visibleFrom ? Number(visibleFrom) : null,
    visibleUntil: visibleUntil ? Number(visibleUntil) : null,
    isPublished: Boolean(isPublished),
    questions: questions.map((q, idx) => ({
      id: q.id || `q_${idx + 1}`,
      prompt: q.prompt,
      choices: q.choices,
      correctChoiceId: q.correctChoiceId,
      explanation: q.explanation ?? '',
    })),
    createdAt: Date.now(),
  }
  req.db.quizzes.unshift(quiz)
  writeDb(req.db)
  res.status(201).json({ quiz })
})

app.get('/api/admin/submissions', authMiddleware, adminMiddleware, (req, res) => {
  const submissions = (req.db.submissions ?? []).map((s) => ({
    id: s.id,
    quizId: s.quizId,
    studentName: s.studentName,
    studentCode: s.studentCode,
    email: s.email,
    scorePercent: s.scorePercent,
    correct: s.correct,
    total: s.total,
    finishedAt: s.finishedAt,
  }))
  res.json({ submissions })
})

app.listen(PORT, () => {
  console.log(`Physics Lab API running on http://localhost:${PORT}`)
})

