const API_BASE = process.env.API_BASE || 'http://localhost:4000/api'

async function run() {
  const rand = Math.floor(Math.random() * 1_000_000)
  const email = `smoke_${rand}@test.com`
  const studentCode = `ST${rand}`
  const password = '123456'

  const health = await fetch(`${API_BASE}/health`).then((r) => r.json())
  if (!health.ok) throw new Error('Health check failed')

  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Smoke User',
      email,
      studentCode,
      avatarId: 'boy_1',
      password,
    }),
  })
  if (!signupRes.ok) throw new Error(`Signup failed: ${signupRes.status}`)
  const signup = await signupRes.json()
  const token = signup.token

  const me = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json())
  if (!me.user?.email) throw new Error('Me endpoint failed')

  const progressPayload = {
    lectureWatch: { 'electric-field': 0.85 },
    completedLectures: { 'electric-field': true },
    unlockedQuizzes: { 'quiz_electric-field': true },
    quizAttempts: {},
    points: 120,
    badges: ['first_lab'],
    activity: [{ at: Date.now(), text: 'smoke test activity' }],
  }
  const saveRes = await fetch(`${API_BASE}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ progress: progressPayload }),
  })
  if (!saveRes.ok) throw new Error(`Save progress failed: ${saveRes.status}`)

  const fetchedProgress = await fetch(`${API_BASE}/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json())
  if (fetchedProgress.progress?.points !== 120) {
    throw new Error('Progress read/write validation failed')
  }

  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentCode, password }),
  })
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`)

  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@physicslab.com', password: 'admin123' }),
  })
  if (!adminLoginRes.ok) throw new Error(`Admin login failed: ${adminLoginRes.status}`)
  const adminLogin = await adminLoginRes.json()
  const adminToken = adminLogin.token

  const lectureCreateRes = await fetch(`${API_BASE}/admin/lectures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      unit: 'اختبار دخان',
      title: `محاضرة تجريبية ${rand}`,
      description: 'وصف تجريبي',
      youtubeId: 'dQw4w9WgXcQ',
      difficulty: 'easy',
      videosCount: 1,
      laws: [],
      attachments: [],
    }),
  })
  if (!lectureCreateRes.ok) throw new Error(`Admin lecture create failed: ${lectureCreateRes.status}`)

  console.log('Smoke test passed.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

