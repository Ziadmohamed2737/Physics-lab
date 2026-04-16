import { useMemo, useState } from 'react'

export function PendulumSimulator() {
  const [L, setL] = useState(1) // meters
  const [g, setG] = useState(9.8)

  const { T, f } = useMemo(() => {
    const T = 2 * Math.PI * Math.sqrt(L / g)
    return { T, f: 1 / T }
  }, [L, g])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-secondary">
          <span className="material-symbols-outlined">waves</span>
          <h3 className="text-2xl font-black">محاكي الباندول البسيط</h3>
        </div>
        <p className="text-slate-400 font-semibold mt-2">غيّر طول الخيط وشاهد الزمن الدوري والتردد.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">نتائج</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">T (s)</p>
                <p className="text-2xl font-black font-headline">{T.toFixed(3)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">f (Hz)</p>
                <p className="text-2xl font-black font-headline">{f.toFixed(3)}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">المعادلة</p>
              <p className="text-lg font-black text-secondary">T = 2π √(L/g)</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">طول الخيط L (m)</label>
                <span className="text-secondary font-headline font-black">{L.toFixed(2)}</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={0.2}
                max={3}
                step={0.05}
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">الجاذبية g (m/s²)</label>
                <span className="text-secondary font-headline font-black">{g.toFixed(1)}</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={8}
                max={12}
                step={0.1}
                value={g}
                onChange={(e) => setG(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

