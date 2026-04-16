import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchLectures, type LectureDto } from '../api/content'

const difficultyLabel: Record<string, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
}

export function LecturesPage() {
  const navigate = useNavigate()
  const [lectures, setLectures] = useState<LectureDto[]>([])

  useEffect(() => {
    void fetchLectures().then(setLectures).catch(() => setLectures([]))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-28">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-headline font-black text-3xl text-slate-900">المحاضرات</h2>
          <p className="text-slate-500 font-medium mt-2">
            اختار محاضرة وابدأ المشاهدة — الكويز بيتفتح بعد 80% مشاهدة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((l) => (
          <div
            key={l.id}
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="p-7">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                  {difficultyLabel[l.difficulty]}
                </span>
              </div>
              <h3 className="font-headline font-extrabold text-xl text-slate-900 mb-2">
                {l.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{l.description}</p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>🎥 {l.videosCount} فيديو</span>
                <span className="text-primary/80">{l.unit}</span>
              </div>
            </div>
            <div className="px-7 pb-7">
              <button
                type="button"
                onClick={() => navigate(`/lectures/${l.id}`)}
                className="w-full bg-primary text-white py-3 rounded-2xl font-black hover:opacity-95 transition-all active:scale-95 shadow-lg shadow-primary/15"
              >
                ادخل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

