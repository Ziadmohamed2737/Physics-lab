import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchStudentQuizzes, type QuizDto } from '../api/content'
import { progress } from '../store/progress'

type QuizLevel = 'easy' | 'medium' | 'hard'

const levelMeta: Record<QuizLevel, { label: string; dot: string }> = {
  easy: { label: 'سهل', dot: 'bg-emerald-500' },
  medium: { label: 'متوسط', dot: 'bg-amber-500' },
  hard: { label: 'صعب', dot: 'bg-rose-500' },
}

export function QuizHubPage() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<QuizDto[]>([])

  useEffect(() => {
    void fetchStudentQuizzes().then(setQuizzes).catch(() => setQuizzes([]))
  }, [])

  const groups = useMemo(() => {
    const g: Record<QuizLevel, QuizDto[]> = { easy: [], medium: [], hard: [] }
    for (const q of quizzes) g[q.level].push(q)
    return g
  }, [quizzes])

  return (
    <div className="px-6 py-10 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="font-headline text-3xl font-black text-slate-900">الاختبارات</h2>
            <p className="text-slate-500 font-medium mt-2">
              هنا ستظهر فقط الاختبارات التي ينشرها الدكتور في وقتها المحدد.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/lectures')}
            className="hidden sm:inline-flex bg-white border border-slate-200 text-slate-900 px-5 py-3 rounded-2xl font-black hover:bg-slate-50 transition-colors active:scale-95"
          >
            روح للمحاضرات
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center">
            <p className="font-black text-slate-900 mb-2">لا يوجد أي اختبار متاح الآن.</p>
            <p className="text-slate-500 font-medium">سيظهر الاختبار هنا عندما ينشره الدكتور ويحدد وقت ظهوره.</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(Object.keys(groups) as QuizLevel[]).map((level) => (
            <div key={level} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className={['w-2 h-2 rounded-full', levelMeta[level].dot].join(' ')} />
                  <h3 className="font-headline font-black text-slate-900">{levelMeta[level].label}</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {groups[level].length} نماذج
                </span>
              </div>

              <div className="space-y-4">
                {groups[level].map((q) => {
                  const unlocked = progress.isQuizUnlocked(q.id) || !q.relatedLectureId
                  return (
                    <div
                      key={q.id}
                      className={[
                        'bg-white p-5 rounded-2xl border transition-all shadow-sm',
                        unlocked ? 'border-slate-100 hover:shadow-md' : 'border-slate-100 opacity-60',
                      ].join(' ')}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">quiz</span>
                        </div>
                        {!unlocked ? (
                          <span className="material-symbols-outlined text-slate-400 text-sm">lock</span>
                        ) : null}
                      </div>
                      <h4 className="font-headline font-black text-lg mb-1 text-slate-900">
                        {q.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mb-4">
                        {(q.questionCount ?? q.questions?.length ?? 0)} سؤال • {q.minutes} دقيقة
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {q.relatedLectureId ? (
                          <Link
                            className="text-xs font-black text-primary hover:underline"
                            to={`/lectures/${q.relatedLectureId}`}
                          >
                            المحاضرة المرتبطة
                          </Link>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          disabled={!unlocked}
                          onClick={() => navigate(`/quiz/${q.id}`)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black bg-primary text-white px-4 py-2 rounded-xl active:scale-95"
                        >
                          ابدأ
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

