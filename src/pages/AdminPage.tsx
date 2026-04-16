import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateLecture,
  adminCreateQuiz,
  adminFetchLectures,
  adminFetchQuizzes,
  adminFetchSubmissions,
  type LectureDto,
} from '../api/content'

type QuizQuestionForm = {
  prompt: string
  choiceA: string
  choiceB: string
  choiceC: string
  choiceD: string
  correctChoiceId: 'a' | 'b' | 'c' | 'd'
  explanation: string
}

const emptyQuestion = (): QuizQuestionForm => ({
  prompt: '',
  choiceA: '',
  choiceB: '',
  choiceC: '',
  choiceD: '',
  correctChoiceId: 'a',
  explanation: '',
})

export function AdminPage() {
  const [lectures, setLectures] = useState<LectureDto[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [lectureForm, setLectureForm] = useState({
    unit: '',
    title: '',
    description: '',
    youtubeId: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    videosCount: 1,
  })
  const [quizForm, setQuizForm] = useState({
    title: '',
    level: 'easy' as 'easy' | 'medium' | 'hard',
    minutes: 10,
    relatedLectureId: '',
    visibleFrom: '',
    visibleUntil: '',
    isPublished: true,
  })
  const [questions, setQuestions] = useState<QuizQuestionForm[]>([emptyQuestion()])

  async function load() {
    const [lec, qz, subs] = await Promise.all([
      adminFetchLectures(),
      adminFetchQuizzes(),
      adminFetchSubmissions(),
    ])
    setLectures(lec)
    setQuizzes(qz)
    setSubmissions(subs)
  }

  useEffect(() => {
    void load().catch(() => setMessage('تعذر تحميل بيانات الأدمن.'))
  }, [])

  const averageScore = useMemo(() => {
    if (!submissions.length) return 0
    return Math.round(submissions.reduce((acc, s) => acc + s.scorePercent, 0) / submissions.length)
  }, [submissions])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-28 space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-black text-slate-900">لوحة تحكم الأدمن</h1>
        <p className="text-slate-500 mt-2 font-medium">
          من هنا تقدر تضيف محاضرات وكويزات، وتحدد وقت ظهورها واختفائها، وتتابع درجات الطلاب.
        </p>
        <p className="text-xs text-slate-400 mt-2 font-semibold">
          حساب الأدمن الافتراضي: `admin@physicslab.com` / `admin123`
        </p>
      </div>

      {message ? (
        <div className="bg-primary/10 text-primary border border-primary/20 rounded-2xl p-4 font-black">
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">المحاضرات</p>
          <p className="text-3xl font-headline font-black text-slate-900">{lectures.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">الاختبارات</p>
          <p className="text-3xl font-headline font-black text-slate-900">{quizzes.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-2">متوسط الدرجات</p>
          <p className="text-3xl font-headline font-black text-slate-900">{averageScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-headline text-2xl font-black text-slate-900">إضافة محاضرة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" placeholder="الوحدة" value={lectureForm.unit} onChange={(e) => setLectureForm((f) => ({ ...f, unit: e.target.value }))} />
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" placeholder="عنوان المحاضرة" value={lectureForm.title} onChange={(e) => setLectureForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none md:col-span-2" placeholder="وصف المحاضرة" value={lectureForm.description} onChange={(e) => setLectureForm((f) => ({ ...f, description: e.target.value }))} />
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" placeholder="YouTube ID" value={lectureForm.youtubeId} onChange={(e) => setLectureForm((f) => ({ ...f, youtubeId: e.target.value }))} />
            <select className="px-4 py-3 bg-slate-100 rounded-xl outline-none" value={lectureForm.difficulty} onChange={(e) => setLectureForm((f) => ({ ...f, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await adminCreateLecture({ ...lectureForm, laws: [], attachments: [] })
                setMessage('تمت إضافة المحاضرة بنجاح.')
                setLectureForm({ unit: '', title: '', description: '', youtubeId: '', difficulty: 'easy', videosCount: 1 })
                await load()
              } catch (err) {
                setMessage((err as Error).message)
              }
            }}
            className="bg-primary text-white px-5 py-3 rounded-2xl font-black active:scale-95"
          >
            حفظ المحاضرة
          </button>
        </section>

        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-headline text-2xl font-black text-slate-900">إضافة اختبار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" placeholder="عنوان الاختبار" value={quizForm.title} onChange={(e) => setQuizForm((f) => ({ ...f, title: e.target.value }))} />
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" type="number" min={1} placeholder="المدة بالدقائق" value={quizForm.minutes} onChange={(e) => setQuizForm((f) => ({ ...f, minutes: Number(e.target.value) }))} />
            <select className="px-4 py-3 bg-slate-100 rounded-xl outline-none" value={quizForm.level} onChange={(e) => setQuizForm((f) => ({ ...f, level: e.target.value as 'easy' | 'medium' | 'hard' }))}>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
            <select className="px-4 py-3 bg-slate-100 rounded-xl outline-none" value={quizForm.relatedLectureId} onChange={(e) => setQuizForm((f) => ({ ...f, relatedLectureId: e.target.value }))}>
              <option value="">بدون ربط بمحاضرة</option>
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" type="datetime-local" value={quizForm.visibleFrom} onChange={(e) => setQuizForm((f) => ({ ...f, visibleFrom: e.target.value }))} />
            <input className="px-4 py-3 bg-slate-100 rounded-xl outline-none" type="datetime-local" value={quizForm.visibleUntil} onChange={(e) => setQuizForm((f) => ({ ...f, visibleUntil: e.target.value }))} />
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                <p className="font-black text-slate-900">سؤال {idx + 1}</p>
                <input className="w-full px-4 py-3 bg-white rounded-xl outline-none" placeholder="نص السؤال" value={q.prompt} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, prompt: e.target.value } : item))} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="px-4 py-3 bg-white rounded-xl outline-none" placeholder="الاختيار A" value={q.choiceA} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, choiceA: e.target.value } : item))} />
                  <input className="px-4 py-3 bg-white rounded-xl outline-none" placeholder="الاختيار B" value={q.choiceB} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, choiceB: e.target.value } : item))} />
                  <input className="px-4 py-3 bg-white rounded-xl outline-none" placeholder="الاختيار C" value={q.choiceC} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, choiceC: e.target.value } : item))} />
                  <input className="px-4 py-3 bg-white rounded-xl outline-none" placeholder="الاختيار D" value={q.choiceD} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, choiceD: e.target.value } : item))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select className="px-4 py-3 bg-white rounded-xl outline-none" value={q.correctChoiceId} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, correctChoiceId: e.target.value as 'a' | 'b' | 'c' | 'd' } : item))}>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                  <input className="px-4 py-3 bg-white rounded-xl outline-none" placeholder="تفسير الإجابة" value={q.explanation} onChange={(e) => setQuestions((items) => items.map((item, i) => i === idx ? { ...item, explanation: e.target.value } : item))} />
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setQuestions((items) => [...items, emptyQuestion()])} className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-black">
              إضافة سؤال جديد
            </button>
          </div>

          <label className="flex items-center gap-2 font-semibold text-slate-700">
            <input type="checkbox" checked={quizForm.isPublished} onChange={(e) => setQuizForm((f) => ({ ...f, isPublished: e.target.checked }))} />
            نشر الاختبار للطلاب
          </label>

          <button
            type="button"
            onClick={async () => {
              try {
                await adminCreateQuiz({
                  ...quizForm,
                  relatedLectureId: quizForm.relatedLectureId || null,
                  visibleFrom: quizForm.visibleFrom ? new Date(quizForm.visibleFrom).getTime() : null,
                  visibleUntil: quizForm.visibleUntil ? new Date(quizForm.visibleUntil).getTime() : null,
                  questions: questions.map((q, idx) => ({
                    id: `q_${idx + 1}`,
                    prompt: q.prompt,
                    choices: [
                      { id: 'a', text: q.choiceA },
                      { id: 'b', text: q.choiceB },
                      { id: 'c', text: q.choiceC },
                      { id: 'd', text: q.choiceD },
                    ],
                    correctChoiceId: q.correctChoiceId,
                    explanation: q.explanation,
                  })),
                })
                setMessage('تمت إضافة الاختبار بنجاح.')
                setQuizForm({ title: '', level: 'easy', minutes: 10, relatedLectureId: '', visibleFrom: '', visibleUntil: '', isPublished: true })
                setQuestions([emptyQuestion()])
                await load()
              } catch (err) {
                setMessage((err as Error).message)
              }
            }}
            className="bg-primary text-white px-5 py-3 rounded-2xl font-black active:scale-95"
          >
            حفظ الاختبار
          </button>
        </section>
      </div>

      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="font-headline text-2xl font-black text-slate-900">درجات الطلاب</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="pb-3">الطالب</th>
                <th className="pb-3">الكود</th>
                <th className="pb-3">الاختبار</th>
                <th className="pb-3">الدرجة</th>
                <th className="pb-3">النسبة</th>
                <th className="pb-3">وقت التسليم</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="py-3 font-black text-slate-900">{s.studentName}</td>
                  <td className="py-3 text-slate-600 font-mono">{s.studentCode}</td>
                  <td className="py-3 text-slate-600">{s.quizId}</td>
                  <td className="py-3 text-slate-600">{s.correct}/{s.total}</td>
                  <td className="py-3 text-primary font-black">{s.scorePercent}%</td>
                  <td className="py-3 text-slate-500">{new Date(s.finishedAt).toLocaleString('ar-EG')}</td>
                </tr>
              ))}
              {submissions.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500 font-medium" colSpan={6}>
                    لا توجد درجات مسجلة حتى الآن.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

