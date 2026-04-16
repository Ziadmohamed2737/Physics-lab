import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { YouTubeLockedPlayer } from '../components/lecture/YouTubeLockedPlayer'
import { fetchLectureById, fetchStudentQuizzes, type LectureDto, type QuizDto } from '../api/content'
import { progress } from '../store/progress'
import { useEffect } from 'react'

export function LectureDetailsPage() {
  const navigate = useNavigate()
  const { lectureId } = useParams()
  const [lecture, setLecture] = useState<LectureDto | null>(null)
  const [quiz, setQuiz] = useState<QuizDto | null>(null)
  const [watched01, setWatched01] = useState(() =>
    lectureId ? progress.lectureWatchPercent(lectureId) : 0,
  )

  useEffect(() => {
    if (!lectureId) return
    void fetchLectureById(lectureId).then(setLecture).catch(() => setLecture(null))
    void fetchStudentQuizzes()
      .then((items) => setQuiz(items.find((q) => q.relatedLectureId === lectureId) ?? null))
      .catch(() => setQuiz(null))
  }, [lectureId])

  if (!lecture) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-bold text-slate-600">المحاضرة غير موجودة.</p>
        <Link className="text-primary font-black hover:underline" to="/lectures">
          رجوع للمحاضرات
        </Link>
      </div>
    )
  }

  const quizId = quiz?.id ?? null
  const canOpenQuiz = !!quizId && (watched01 >= 0.8 || progress.isQuizUnlocked(quizId))
  if (quizId && watched01 >= 0.8 && !progress.isQuizUnlocked(quizId)) {
    progress.unlockQuiz(quizId)
  }

  return (
    <div className="pt-4 pb-28">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-secondary font-semibold text-sm tracking-wider uppercase">
              <span className="w-8 h-[2px] bg-secondary" />
              {lecture.unit}
            </div>
            <button
              type="button"
              className="text-primary font-black hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-95"
              onClick={() => navigate('/lectures')}
            >
              رجوع
            </button>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-black text-slate-900 tracking-tight leading-tight">
            {lecture.title}
          </h2>
          <p className="text-slate-500 max-w-2xl text-base md:text-lg leading-relaxed">
            {lecture.description}
          </p>
        </section>

        <section className="space-y-4">
          <YouTubeLockedPlayer
            lectureId={lecture.id}
            videoId={lecture.youtubeId}
            onWatched={(p) => setWatched01(p)}
          />

          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black tracking-widest uppercase text-slate-400">
                تقدم المشاهدة
              </p>
              <p className="text-xs font-black text-primary">{Math.round(watched01 * 100)}%</p>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-primary to-secondary transition-all"
                style={{ width: `${Math.round(watched01 * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 font-semibold">
              لازم توصل 80% مشاهدة علشان يفتح الاختبار.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-[0px_32px_64px_rgba(0,64,161,0.04)] border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <h3 className="text-2xl font-headline font-black text-primary">ملخص المحاضرة</h3>
            </div>
            <p className="text-slate-500 leading-relaxed text-base">{lecture.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-xl">functions</span>
              </div>
              <h3 className="text-2xl font-headline font-black text-primary">القوانين الأساسية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lecture.laws.map((law) => (
                <div
                  key={law.equation}
                  className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-primary/20 transition-colors shadow-sm"
                >
                  <div className="bg-slate-50 p-4 rounded-xl text-center mb-4 border border-slate-100">
                    <span className="text-2xl font-headline font-black text-primary italic">
                      {law.equation}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{law.title}</h4>
                  <p className="text-sm text-slate-500">{law.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-headline font-black text-primary px-2">ملفات المحاضرة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lecture.attachments.map((a) => (
              <a
                key={a.id}
                href={`/attachments/${a.id}.${a.kind === 'pdf' ? 'pdf' : 'txt'}`}
                download
                className="flex items-center gap-5 p-5 bg-white rounded-2xl border-2 border-transparent hover:border-primary/10 hover:shadow-xl transition-all cursor-pointer group shadow-sm text-right"
              >
                <div
                  className={[
                    'w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform',
                    a.kind === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600',
                  ].join(' ')}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {a.kind === 'pdf' ? 'picture_as_pdf' : 'description'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base truncate">{a.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">
                    {a.sizeLabel} • {a.kind === 'pdf' ? 'PDF' : 'DOC'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  download
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="pt-2">
          <button
            disabled={!canOpenQuiz}
            onClick={() => quizId && navigate(`/quiz/${quizId}`)}
            className="disabled:opacity-50 disabled:cursor-not-allowed w-full bg-gradient-to-br from-primary to-blue-700 text-white p-7 rounded-3xl flex items-center justify-between shadow-[0_24px_48px_rgba(0,64,161,0.25)] active:scale-[0.98] transition-all group"
          >
            <div className="text-right">
              <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">
                اختبار المعلومات
              </p>
              <h3 className="text-xl md:text-2xl font-headline font-black leading-tight">
                ابدأ الاختبار 🧠
              </h3>
              {!canOpenQuiz ? (
                <p className="text-xs text-blue-100/80 mt-2 font-semibold">
                  {quizId ? 'الاختبار مقفول لحد ما تكمل 80% مشاهدة.' : 'لا يوجد اختبار منشور لهذه المحاضرة حالياً.'}
                </p>
              ) : null}
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
          </button>
        </section>
      </div>
    </div>
  )
}

