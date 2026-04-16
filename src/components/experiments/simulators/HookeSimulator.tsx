import { useMemo, useState } from 'react'

export function HookeSimulator() {
  const [k, setK] = useState(20) // N/m
  const [mass, setMass] = useState(0.5) // kg
  const [g, setG] = useState(9.8)

  const { f, x } = useMemo(() => {
    const f = mass * g
    const x = k === 0 ? 0 : f / k
    return { f, x }
  }, [k, mass, g])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-secondary">
          <span className="material-symbols-outlined">fitness_center</span>
          <h3 className="text-2xl font-black">محاكي قانون هوك</h3>
        </div>
        <p className="text-slate-400 font-semibold mt-2">غيّر الكتلة وثابت الزنبرك وشاهد الاستطالة.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">نتائج</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">F (N)</p>
                <p className="text-2xl font-black font-headline">{f.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">x (m)</p>
                <p className="text-2xl font-black font-headline">{x.toFixed(3)}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">المعادلة</p>
              <p className="text-lg font-black text-secondary">F = k x</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { label: 'ثابت الزنبرك k (N/m)', value: k, set: (v: number) => setK(v), min: 5, max: 80, step: 1 },
              { label: 'الكتلة m (kg)', value: mass, set: (v: number) => setMass(v), min: 0.1, max: 2, step: 0.1 },
              { label: 'الجاذبية g (m/s²)', value: g, set: (v: number) => setG(v), min: 8, max: 12, step: 0.1 },
            ].map((c) => (
              <div className="space-y-3" key={c.label}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase tracking-wider text-slate-300">{c.label}</label>
                  <span className="text-secondary font-headline font-black">{c.value}</span>
                </div>
                <input
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={c.value}
                  onChange={(e) => c.set(parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

