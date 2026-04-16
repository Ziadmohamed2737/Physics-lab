import { useEffect, useMemo, useRef, useState } from 'react'

export function CompassSimulator() {
  const [distance, setDistance] = useState(30) // cm
  const [strength, setStrength] = useState(50) // arbitrary
  const [angle, setAngle] = useState(0) // degrees magnet direction relative to north

  const { needleDeg, bRatio, bMag } = useMemo(() => {
    const r = Math.max(5, distance)
    const bMag = strength / Math.pow(r / 10, 3) // drop with distance^3
    const bEarth = 40
    const bRatio = bMag / bEarth
    const magnetRad = (angle * Math.PI) / 180
    // combine earth field pointing up (0deg) with magnet field at angle
    const bx = bMag * Math.sin(magnetRad)
    const by = bEarth + bMag * Math.cos(magnetRad)
    const needleDeg = (Math.atan2(bx, by) * 180) / Math.PI
    return { needleDeg, bRatio, bMag }
  }, [distance, strength, angle])

  // Smooth needle motion (feels physical)
  const [displayDeg, setDisplayDeg] = useState(0)
  const velRef = useRef(0)
  const targetRef = useRef(needleDeg)
  useEffect(() => {
    targetRef.current = needleDeg
  }, [needleDeg])

  useEffect(() => {
    let raf = 0
    let last: number | null = null
    const tick = (ts: number) => {
      const dt = last == null ? 0.016 : Math.min(0.05, (ts - last) / 1000)
      last = ts
      setDisplayDeg((x) => {
        const target = targetRef.current
        // critically damped-ish spring
        const k = 28
        const c = 10
        const v = velRef.current
        const a = k * (target - x) - c * v
        const nextV = v + a * dt
        velRef.current = nextV
        return x + nextV * dt
      })
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-secondary">
          <span className="material-symbols-outlined">explore</span>
          <h3 className="text-2xl font-black">محاكي البوصلة والمغناطيس</h3>
        </div>
        <p className="text-slate-400 font-semibold mt-2">
          قرّب/بعّد المغناطيس وغيّر اتجاهه وشاهد انحراف إبرة البوصلة.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black tracking-widest uppercase text-secondary">Compass</p>
              <p className="text-xs font-black text-slate-300">Bmag / Bearth ≈ {bRatio.toFixed(2)}</p>
            </div>

            <div className="mx-auto w-56 h-56 rounded-full border border-white/10 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-4 rounded-full border border-white/5" />
              {/* field lines (visual only) */}
              <svg className="absolute inset-0 opacity-60" viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <radialGradient id="fg" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="rgba(0,227,253,0.18)" />
                    <stop offset="70%" stopColor="rgba(0,227,253,0.04)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#fg)" />
                {Array.from({ length: 10 }).map((_, idx) => {
                  const a = (idx / 10) * Math.PI * 2
                  const x1 = 100 + Math.cos(a) * 20
                  const y1 = 100 + Math.sin(a) * 20
                  const x2 = 100 + Math.cos(a) * 96
                  const y2 = 100 + Math.sin(a) * 96
                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )
                })}
              </svg>

              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300">
                N
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300">
                S
              </div>
              {/* needle with red tip */}
              <div className="absolute w-2 h-28 origin-bottom" style={{ transform: `rotate(${displayDeg}deg)` }}>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[10px] h-24 rounded-full bg-secondary shadow-[0_0_25px_rgba(0,227,253,0.25)]" />
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[10px] h-14 rounded-full bg-red-500/90 shadow-[0_0_25px_rgba(239,68,68,0.2)]" />
              </div>
              <div className="absolute w-3 h-3 rounded-full bg-white/70" />
            </div>

            <p className="text-slate-400 text-sm font-semibold text-center">
              انحراف الإبرة: {displayDeg.toFixed(1)}°
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">Bmag (rel.)</p>
                <p className="text-lg font-black font-headline text-secondary">{bMag.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">Distance</p>
                <p className="text-lg font-black font-headline text-secondary">{distance} cm</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { label: 'المسافة (cm)', value: distance, set: setDistance, min: 5, max: 100, step: 1 },
              { label: 'قوة المغناطيس', value: strength, set: setStrength, min: 10, max: 100, step: 1 },
              { label: 'زاوية المغناطيس (deg)', value: angle, set: setAngle, min: -90, max: 90, step: 1 },
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

