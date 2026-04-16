import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchQuizById, submitQuizAttempt, type QuizDto } from '../api/content'
import { progress } from '../store/progress'

type Phase = 'taking' | 'done'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function QuizTakePage() {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState<QuizDto | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!quizId) return
    void fetchQuizById(quizId)
      .then((item) => {
        setQuiz(item)
        setLoadError(null)
      })
      .catch((err) => {
        setQuiz(null)
        setLoadError((err as Error).message)
      })
  }, [quizId])

  const [phase, setPhase] = useState<Phase>('taking')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [startedAt] = useState(() => Date.now())

  const totalSeconds = (quiz?.minutes ?? 10) * 60
  const [remaining, setRemaining] = useState(totalSeconds)

  useEffect(() => {
    if (!quiz) return
    setRemaining((quiz.minutes ?? 10) * 60)
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [quiz])

  useEffect(() => {
    if (remaining === 0 && phase === 'taking') {
      setPhase('done')
    }
  }, [remaining, phase])

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-bold text-slate-600">{loadError ?? 'الاختبار غير موجود.'}</p>
        <Link className="text-primary font-black hover:underline" to="/quiz">
          رجوع للاختبارات
        </Link>
      </div>
    )
  }

  const unlocked = progress.isQuizUnlocked(quiz.id) || !quiz.relatedLectureId
  if (!unlocked) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-black text-slate-900 mb-2">الاختبار مقفول.</p>
        <p className="text-slate-500 font-semibold mb-6">
          لازم تكمل 80% مشاهدة من المحاضرة المرتبطة علشان يفتح.
        </p>
        {quiz.relatedLectureId ? (
          <Link className="text-primary font-black hover:underline" to={`/lectures/${quiz.relatedLectureId}`}>
            افتح المحاضرة
          </Link>
        ) : null}
      </div>
    )
  }

  const q = (quiz.questions ?? [])[idx]
  const answeredCount = Object.keys(answers).length
  const canFinish = answeredCount === (quiz.questions?.length ?? 0) || remaining === 0

  const { correct, total, breakdown } = useMemo(() => {
    const questionItems = quiz.questions ?? []
    const total = questionItems.length
    let correct = 0
    const breakdown = questionItems.map((qq) => {
      const picked = answers[qq.id]
      const ok = picked === qq.correctChoiceId
      if (ok) correct++
      return { qq, picked, ok }
    })
    return { correct, total, breakdown }
  }, [answers, quiz.questions])

  useEffect(() => {
    if (phase !== 'done') return
    const attempt = {
      quizId: quiz.id,
      startedAt,
      finishedAt: Date.now(),
      correct,
      total,
      answers,
    }
    progress.addAttempt(attempt)
    void submitQuizAttempt(attempt).catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (phase === 'done') {
    const pct = total ? Math.round((correct / total) * 100) : 0
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 pb-28 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-2">النتيجة</p>
          <h2 className="font-headline font-black text-3xl text-slate-900 mb-3">{quiz.title}</h2>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-primary/10 text-primary font-black">
              {pct}%
            </div>
            <p className="text-slate-600 font-semibold">
              صح {correct} من {total}
            </p>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setIdx(0)
                setRemaining(totalSeconds)
                setPhase('taking')
              }}
              className="bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black hover:bg-slate-50 active:scale-95"
            >
              إعادة المحاولة
            </button>
            <button
              type="button"
              onClick={() => navigate('/quiz')}
              className="bg-primary text-white px-5 py-3 rounded-2xl font-black hover:opacity-95 active:scale-95"
            >
              رجوع للاختبارات
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-black text-xl text-slate-900 mb-4">تحليل الإجابات</h3>
          <div className="space-y-4">
            {breakdown.map(({ qq, picked, ok }) => (
              <div
                key={qq.id}
                className={[
                  'p-5 rounded-2xl border',
                  ok ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40',
                ].join(' ')}
              >
                <p className="font-black text-slate-900 mb-2">{qq.prompt}</p>
                <p className="text-sm font-semibold text-slate-600">
                  إجابتك: {picked ? qq.choices.find((c) => c.id === picked)?.text : '—'}
                </p>
                {!ok ? (
                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    الصح: {qq.choices.find((c) => c.id === qq.correctChoiceId)?.text}
                  </p>
                ) : null}
                <p className="text-sm text-slate-500 mt-2">{qq.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 pb-28 space-y-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-2">الاختبار</p>
          <h2 className="font-headline font-black text-2xl md:text-3xl text-slate-900">{quiz.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">الوقت</p>
            <p className="font-black text-slate-900 tabular-nums">{fmt(remaining)}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">التقدم</p>
            <p className="font-black text-slate-900">{answeredCount}/{quiz.questions?.length ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-black text-slate-500">
            سؤال {idx + 1} / {quiz.questions?.length ?? 0}
          </p>
          <div className="h-2 w-40 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.round(((idx + 1) / Math.max(quiz.questions?.length ?? 1, 1)) * 100)}%` }}
            />
          </div>
        </div>

        <p className="font-black text-slate-900 text-lg leading-relaxed mb-5">{q?.prompt}</p>

        <div className="space-y-3">
          {(q?.choices ?? []).map((c) => {
            const picked = q ? answers[q.id] === c.id : false
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => q && setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                className={[
                  'w-full text-right p-4 rounded-2xl border transition-all active:scale-[0.99]',
                  picked
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50',
                ].join(' ')}
              >
                <span className="font-bold text-slate-900">{c.text}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-8 gap-3">
          <button
            type="button"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black hover:bg-slate-50 active:scale-95"
          >
            السابق
          </button>

          {idx < (quiz.questions?.length ?? 0) - 1 ? (
            <button
              type="button"
              onClick={() => setIdx((i) => Math.min((quiz.questions?.length ?? 1) - 1, i + 1))}
              className="bg-primary text-white px-5 py-3 rounded-2xl font-black hover:opacity-95 active:scale-95"
            >
              التالي
            </button>
          ) : (
            <button
              type="button"
              disabled={!canFinish}
              onClick={() => setPhase('done')}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 text-white px-5 py-3 rounded-2xl font-black hover:bg-slate-950 active:scale-95"
            >
              إنهاء
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

