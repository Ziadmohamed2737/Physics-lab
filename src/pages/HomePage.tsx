import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)] overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-center px-6 overflow-hidden physics-gradient pt-20 pb-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 scale-150 md:scale-[2]">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute w-56 h-56 border border-primary/10 rounded-full" />
            <div className="absolute w-48 h-48 border border-primary/5 rounded-full" />
            <div className="absolute w-60 h-60 border-2 border-dashed border-primary/10 rounded-full animate-slow-spin" />
            <div className="spark top-0 left-1/2 -translate-x-1/2" style={{ animationDelay: '0.2s' }} />
            <div className="spark bottom-0 left-1/2 -translate-x-1/2" style={{ animationDelay: '0.8s' }} />
            <div className="spark left-0 top-1/2 -translate-y-1/2 rotate-90" style={{ animationDelay: '1.4s' }} />
            <div className="spark right-0 top-1/2 -translate-y-1/2 rotate-90" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        <div className="max-w-4xl text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-8 border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              مستقبل التعلم التفاعلي
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.2] font-headline">
            تعلم الفيزياء <br /> <span className="text-primary">بشكل تفاعلي</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            محاضرات + تجارب تفاعلية + اختبارات ذكية — علشان تفهم وتطبق وتتفاعل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/lectures')}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              ▶️ ابدأ المحاضرات
            </button>
            <button
              type="button"
              onClick={() => navigate('/experiments')}
              className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              🧪 ادخل التجارب
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">smart_display</span>
            </div>
            <h3 className="font-headline font-black text-xl text-slate-900 mb-2">🎥 محاضرات تفاعلية</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              فيديو + قوانين + ملخصات — مع متابعة تقدمك بشكل ذكي.
            </p>
          </div>
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-slate-900 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">science</span>
            </div>
            <h3 className="font-headline font-black text-xl text-slate-900 mb-2">🧪 تجارب عملية</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              محاكيات حقيقية بالـ sliders والقيم — وتشوف النتيجة لحظيًا.
            </p>
          </div>
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">quiz</span>
            </div>
            <h3 className="font-headline font-black text-xl text-slate-900 mb-2">📝 اختبارات ذكية</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              مستويات + نماذج متعددة + تحليل إجابات ونقاط وتحفيز.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

