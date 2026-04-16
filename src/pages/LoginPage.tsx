import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../store/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/home'

  const [emailOrCode, setEmailOrCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const canSubmit = useMemo(() => emailOrCode.trim().length > 2 && password.length >= 4, [emailOrCode, password])

  return (
    <div className="min-h-dvh flex flex-col bg-surface physics-gradient overflow-hidden relative">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 h-16 shadow-[0px_24px_48px_rgba(0,64,161,0.06)]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-700">science</span>
          <span className="font-headline tracking-tighter text-xl font-black text-blue-800">
            مختبر الفيزياء
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-slate-500 font-semibold text-sm">تعلم تفاعلي</span>
          <span className="text-slate-500 font-semibold text-sm">تجارب واقعية</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0px_24px_48px_rgba(0,64,161,0.06)] relative overflow-hidden border border-slate-100">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="mb-10 text-right">
                <h1 className="font-headline text-4xl font-black text-slate-900 mb-2 tracking-tight">
                  أهلاً بك مجدداً
                </h1>
                <p className="text-slate-500 font-medium">
                  سجل دخولك لمتابعة تجاربك الفيزيائية
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  setBusy(true)
                  const value = emailOrCode.trim()
                  const isEmail = value.includes('@')
                  const res = await auth.login(isEmail ? { email: value, password } : { studentCode: value, password })
                  setBusy(false)
                  if (!res.ok) {
                    setError(res.error)
                    return
                  }
                  navigate(from, { replace: true })
                }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-600 pr-1">
                    البريد الإلكتروني أو الكود الدراسي
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-4 text-slate-400">
                      mail
                    </span>
                    <input
                      className="w-full pr-12 pl-4 py-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="name@example.com أو ST2026"
                      type="text"
                      value={emailOrCode}
                      onChange={(e) => setEmailOrCode(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-sm font-bold text-slate-600">كلمة المرور</label>
                    <button
                      type="button"
                      className="text-sm font-bold text-primary hover:opacity-80 transition-opacity"
                      onClick={() => setError('ميزة “نسيت كلمة المرور” هتتضاف لاحقاً.')}
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-4 text-slate-400">
                      lock
                    </span>
                    <input
                      className="w-full pr-12 pl-4 py-4 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </div>
                ) : null}

                <button
                  disabled={!canSubmit || busy}
                  className="disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 bg-gradient-to-br from-primary to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>{busy ? 'جاري الدخول…' : 'تسجيل الدخول'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
              </form>

              <p className="text-center mt-10 text-slate-500 font-medium">
                ليس لديك حساب؟{' '}
                <Link className="text-primary font-black hover:underline" to="/signup">
                  أنشئ حساباً جديداً
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

