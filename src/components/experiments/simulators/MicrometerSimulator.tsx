import { useMemo, useState } from 'react'

export function MicrometerSimulator() {
  // Simplified: sleeve shows mm (0..25), thimble shows 0..49 divisions, least count = 0.01 mm
  const [sleeveMm, setSleeveMm] = useState(8.5)
  const [thimbleDiv, setThimbleDiv] = useState(12)
  const leastCount = 0.01

  const reading = useMemo(() => {
    return sleeveMm + thimbleDiv * leastCount
  }, [sleeveMm, thimbleDiv])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-secondary">
          <span className="material-symbols-outlined">straighten</span>
          <h3 className="text-2xl font-black">محاكي الميكرومتر</h3>
        </div>
        <p className="text-slate-400 font-semibold mt-2">اتعلم قراءة السليف + الثيمبل بدقة.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">Reading</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                Final (mm)
              </p>
              <p className="text-4xl font-black font-headline">{reading.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">Sleeve</p>
                <p className="text-2xl font-black font-headline">{sleeveMm.toFixed(1)} mm</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">Thimble</p>
                <p className="text-2xl font-black font-headline">{thimbleDiv} div</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-semibold">
              Least count = {leastCount.toFixed(2)} mm
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">قراءة السليف (mm)</label>
                <span className="text-secondary font-headline font-black">{sleeveMm.toFixed(1)}</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={0}
                max={25}
                step={0.5}
                value={sleeveMm}
                onChange={(e) => setSleeveMm(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider text-slate-300">الثيمبل (0..49)</label>
                <span className="text-secondary font-headline font-black">{thimbleDiv}</span>
              </div>
              <input
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                type="range"
                min={0}
                max={49}
                step={1}
                value={thimbleDiv}
                onChange={(e) => setThimbleDiv(parseInt(e.target.value, 10))}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSleeveMm(8.5)
                setThimbleDiv(12)
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

