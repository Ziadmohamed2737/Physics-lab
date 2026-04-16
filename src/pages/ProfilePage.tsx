import { useMemo, useState } from 'react'
import { AvatarPicker } from '../components/profile/AvatarPicker'
import { auth } from '../store/auth'
import { progress } from '../store/progress'
import { avatarSvg } from '../ui/avatars'

export function ProfilePage() {
  const user = auth.currentUser()
  const [editingAvatar, setEditingAvatar] = useState(false)
  const [avatarId, setAvatarId] = useState(user?.avatarId ?? 'boy_1')

  const stats = useMemo(() => {
    const p = progress.get()
    const lecturesDone = Object.values(p.completedLectures).filter(Boolean).length
    const quizzesDone = Object.values(p.quizAttempts).reduce((acc, arr) => acc + (arr.length > 0 ? 1 : 0), 0)
    return { lecturesDone, quizzesDone, points: p.points, activity: p.activity }
  }, [])

  if (!user) return null

  return (
    <div className="pt-6 pb-28">
      <div className="max-w-2xl mx-auto px-6">
        <section className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary to-secondary shadow-xl">
              <div
                className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white"
                dangerouslySetInnerHTML={{ __html: avatarSvg(avatarId) }}
              />
            </div>
            <button
              type="button"
              onClick={() => setEditingAvatar(true)}
              className="absolute bottom-0 left-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white active:scale-95"
              aria-label="Edit avatar"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-3xl font-black font-headline text-slate-900 tracking-tight">
              {user.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1 text-slate-500">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span className="text-sm font-semibold">{user.studentCode}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1 font-mono">{user.email}</p>
            {user.role === 'admin' ? (
              <p className="text-primary text-xs mt-2 font-black">صلاحية: أدمن</p>
            ) : null}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-slate-100">
            <span className="text-primary font-black text-2xl font-headline">{stats.lecturesDone}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-black">
              محاضرات
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-slate-100">
            <span className="text-secondary font-black text-2xl font-headline">{stats.quizzesDone}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-black">
              اختبارات
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-secondary/20">
            <span className="text-slate-900 font-black text-2xl font-headline">{stats.points}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-black">
              نقاط
            </span>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black font-headline text-slate-900">النشاط الأخير</h3>
          </div>
          <div className="space-y-3">
            {(stats.activity.length ? stats.activity : [{ at: Date.now(), text: 'ابدأ أول محاضرة لك!', pointsDelta: 0 }])
              .slice(0, 6)
              .map((a) => (
                <div
                  key={a.at + a.text}
                  className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">{a.text}</p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {new Date(a.at).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  {a.pointsDelta ? (
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-secondary/30">
                      <span className="text-xs font-black text-secondary">+{a.pointsDelta}</span>
                      <span
                        className="material-symbols-outlined text-[12px] text-secondary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        bolt
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
        </section>

        {editingAvatar ? (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-headline font-black text-xl text-slate-900">اختار أفاتار</h3>
                <button
                  type="button"
                  onClick={() => setEditingAvatar(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center active:scale-95"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <AvatarPicker value={avatarId} onChange={setAvatarId} />

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingAvatar(false)}
                  className="bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black hover:bg-slate-50 active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    auth.updateProfile({ avatarId })
                    setEditingAvatar(false)
                  }}
                  className="bg-primary text-white px-5 py-3 rounded-2xl font-black hover:opacity-95 active:scale-95"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

