import { useMemo, useState } from 'react'

export function LensSimulator() {
  const [kind, setKind] = useState<'convex' | 'concave'>('convex')
  const [f, setF] = useState(15) // cm
  const [u, setU] = useState(30) // cm

  const { v, m, note } = useMemo(() => {
    const fSigned = kind === 'convex' ? f : -Math.abs(f)
    const invV = 1 / fSigned - 1 / u
    const v = invV === 0 ? Infinity : 1 / invV
    const m = v === Infinity ? 0 : -v / u
    const note =
      kind === 'convex'
        ? v > 0
          ? 'صورة حقيقية (على الجهة الأخرى من العدسة)'
          : 'صورة تقديرية (نفس جهة الجسم)'
        : 'عدسة مقعرة: الصورة غالباً تقديرية ومصغرة'
    return { v, m, note }
  }, [kind, f, u])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined">cyclone</span>
              <h3 className="text-2xl font-black">المحاكي التفاعلي</h3>
            </div>
            <p className="text-slate-400 font-semibold mt-2">{note}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setKind('convex')}
              className={[
                'px-4 py-2 rounded-full font-black text-sm border transition-all active:scale-95',
                kind === 'convex'
                  ? 'bg-secondary text-slate-900 border-secondary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10',
              ].join(' ')}
            >
              محدبة
            </button>
            <button
              type="button"
              onClick={() => setKind('concave')}
              className={[
                'px-4 py-2 rounded-full font-black text-sm border transition-all active:scale-95',
                kind === 'concave'
                  ? 'bg-secondary text-slate-900 border-secondary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10',
              ].join(' ')}
            >
              مقعرة
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">نتائج</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                  v (cm)
                </p>
                <p className="text-2xl font-black font-headline">
                  {Number.isFinite(v) ? v.toFixed(1) : '∞'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                  m
                </p>
                <p className="text-2xl font-black font-headline">
                  {Number.isFinite(m) ? m.toFixed(2) : '—'}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                قانون العدسة
              </p>
              <p className="text-lg font-black text-secondary">1/f = 1/u + 1/v</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">
                  البعد البؤري f (cm)
                </label>
                <span className="text-secondary font-headline font-black">{f} cm</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={5}
                max={40}
                value={f}
                onChange={(e) => setF(parseInt(e.target.value, 10))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">
                  بعد الجسم u (cm)
                </label>
                <span className="text-secondary font-headline font-black">{u} cm</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={8}
                max={120}
                value={u}
                onChange={(e) => setU(parseInt(e.target.value, 10))}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setF(15)
                setU(30)
                setKind('convex')
              }}
              className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-black hover:bg-white/10 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-green-300">restart_alt</span>
              إعادة ضبط
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

