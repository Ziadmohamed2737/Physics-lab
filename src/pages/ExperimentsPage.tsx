import { useNavigate } from 'react-router-dom'
import { EXPERIMENTS } from '../data/experiments'

export function ExperimentsPage() {
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-28">
      <div className="mb-8">
        <h2 className="font-headline font-black text-3xl text-slate-900">التجارب</h2>
        <p className="text-slate-500 font-medium mt-2">
          محاكيات تفاعلية قريبة من المعمل الحقيقي.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPERIMENTS.map((e) => (
          <div
            key={e.id}
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="p-7">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-slate-900 flex items-center justify-center">
                  <span className="material-symbols-outlined">science</span>
                </div>
                <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                  {e.imageTag}
                </span>
              </div>
              <h3 className="font-headline font-extrabold text-xl text-slate-900 mb-2">
                {e.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{e.description}</p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">
                  القانون
                </p>
                <p className="font-black text-primary">{e.law.equation}</p>
              </div>
            </div>
            <div className="px-7 pb-7">
              <button
                type="button"
                onClick={() => navigate(`/experiments/${e.id}`)}
                className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black hover:bg-slate-950 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                ابدأ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

