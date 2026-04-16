import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'db.json')

const defaultLectures = [
  {
    id: 'electric-field',
    unit: 'الكهرومغناطيسية',
    title: 'المحاضرة 1: المجال الكهربائي',
    description: 'فهم مفهوم المجال الكهربائي حول الشحنات وكيفية حسابه.',
    youtubeId: 'dQw4w9WgXcQ',
    difficulty: 'easy',
    videosCount: 1,
    laws: [
      { equation: 'E = F / q', title: 'شدة المجال الكهربائي', description: 'حساب شدة المجال بدلالة القوة المؤثرة على شحنة اختبار.' },
      { equation: 'E = kQ / r²', title: 'مجال الشحنة النقطية', description: 'شدة المجال على بعد r من شحنة مولدة Q.' },
      { equation: 'Φ = E · A', title: 'التدفق الكهربائي', description: 'قياس خطوط المجال التي تعبر مساحة معينة عموديًا.' },
    ],
    attachments: [
      { id: 'notes', name: 'ملاحظات_المحاضرة_01.pdf', sizeLabel: '4.2 MB', kind: 'pdf' },
      { id: 'sheet', name: 'معادلات_المجال.docx', sizeLabel: '1.1 MB', kind: 'doc' },
    ],
    createdAt: Date.now(),
  },
  {
    id: 'ohms-law',
    unit: 'الكهربية والتيار',
    title: 'المحاضرة 2: قانون أوم (توالي/توازي)',
    description: 'الجهد والتيار والمقاومة وتطبيقات التوالي والتوازي.',
    youtubeId: 'dQw4w9WgXcQ',
    difficulty: 'easy',
    videosCount: 1,
    laws: [
      { equation: 'V = I R', title: 'قانون أوم', description: 'العلاقة بين الجهد والتيار والمقاومة.' },
      { equation: 'Rₛ = R₁ + R₂ + ...', title: 'مقاومات على التوالي', description: 'المقاومة المكافئة مجموع المقاومات.' },
      { equation: '1/Rₚ = 1/R₁ + 1/R₂ + ...', title: 'مقاومات على التوازي', description: 'المقاومة المكافئة في التوازي.' },
    ],
    attachments: [{ id: 'ohm', name: 'Ohm_Law_Summary.pdf', sizeLabel: '0.9 MB', kind: 'pdf' }],
    createdAt: Date.now(),
  },
]

const initialDb = {
  users: [
    {
      id: 'admin_seed',
      name: 'الدكتور',
      email: 'admin@physicslab.com',
      studentCode: 'ADMIN001',
      role: 'admin',
      avatarId: 'boy_1',
      passwordHash: sha256('admin123'),
      createdAt: Date.now(),
    },
  ],
  sessions: [],
  progressByUserId: {},
  lectures: defaultLectures,
  quizzes: [],
  submissions: [],
}

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf8')
    return
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8')
  const db = JSON.parse(raw)
  let changed = false

  for (const [key, value] of Object.entries(initialDb)) {
    if (!(key in db)) {
      db[key] = value
      changed = true
    }
  }

  if (!Array.isArray(db.users)) {
    db.users = initialDb.users
    changed = true
  }

  if (!db.users.some((u) => u.role === 'admin')) {
    db.users.unshift(initialDb.users[0])
    changed = true
  }

  if (!Array.isArray(db.lectures) || db.lectures.length === 0) {
    db.lectures = defaultLectures
    changed = true
  }

  if (changed) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
  }
}

export function readDb() {
  ensureDb()
  const raw = fs.readFileSync(DB_PATH, 'utf8')
  return JSON.parse(raw)
}

export function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    studentCode: user.studentCode,
    grade: user.grade,
    role: user.role ?? 'student',
    avatarId: user.avatarId,
    createdAt: user.createdAt,
  }
}

