import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AvatarPicker } from '../components/profile/AvatarPicker'
import { auth } from '../store/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [avatarId, setAvatarId] = useState('boy_1')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 3 &&
      email.trim().includes('@') &&
      studentCode.trim().length >= 3 &&
      password.length >= 4 &&
      password === confirmPassword &&
      avatarId.length > 0
    )
  }, [name, email, studentCode, password, confirmPassword, avatarId])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface physics-gradient px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-[2rem] p-8 md:p-10 shadow-[0px_24px_48px_rgba(0,64,161,0.06)] border border-slate-100">
        <div className="mb-8 text-right">
          <h1 className="font-headline text-4xl font-black text-slate-900 mb-2 tracking-tight">
            إنشاء حساب
          </h1>
          <p className="text-slate-500 font-medium">
            اختار شخصية وروّح للمحاضرات والتجارب فورًا.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            if (password !== confirmPassword) {
              setError('تأكيد كلمة المرور غير مطابق.')
              return
            }
            setBusy(true)
            const res = await auth.signup({ name, email, studentCode, avatarId, password })
            setBusy(false)
            if (!res.ok) {
              setError(res.error)
              return
            }
            navigate('/home', { replace: true })
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-600 pr-1">الاسم</label>
              <input
                className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم الطالب"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-600 pr-1">
                البريد الإلكتروني
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@physicslab.com"
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-600 pr-1">الكود الدراسي</label>
              <input
                className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="مثال: ST2026"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-600 pr-1">كلمة المرور</label>
              <input
                className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-600 pr-1">تأكيد كلمة المرور</label>
            <input
              className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-600 pr-1">
                اختار صورة الملف (6 شخصيات)
              </label>
              <span className="text-xs font-bold text-slate-400">3 بنات + 3 ولاد</span>
            </div>
            <AvatarPicker value={avatarId} onChange={setAvatarId} />
          </div>

          {error ? (
            <div className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          ) : null}

          <button
            disabled={!canSubmit || busy}
            className="disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 bg-gradient-to-br from-primary to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            {busy ? 'جاري إنشاء الحساب…' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          عندك حساب؟{' '}
          <Link className="text-primary font-black hover:underline" to="/login">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}

