import { useEffect, useMemo, useRef, useState } from 'react'

type Pt = { x: number; y: number }

function sampleTrajectory(v0: number, thetaDeg: number, g: number, dt = 0.06): { pts: Pt[]; T: number } {
  const rad = (thetaDeg * Math.PI) / 180
  const vx = v0 * Math.cos(rad)
  const vy = v0 * Math.sin(rad)
  const T = (2 * vy) / g
  const pts: Pt[] = []
  for (let t = 0; t <= T; t += dt) {
    const x = vx * t
    const y = vy * t - 0.5 * g * t * t
    pts.push({ x, y: Math.max(0, y) })
  }
  pts.push({ x: vx * T, y: 0 })
  return { pts, T }
}

function drawChart(
  canvas: HTMLCanvasElement,
  pts: Pt[],
  current: Pt | null,
  colors: { bg: string; grid: string; line: string; dot: string; axis: string },
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, w, h)

  const pad = 16
  const plotW = w - pad * 2
  const plotH = h - pad * 2
  const maxX = Math.max(...pts.map((p) => p.x), 1)
  const maxY = Math.max(...pts.map((p) => p.y), 1)

  // grid
  ctx.strokeStyle = colors.grid
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const x = pad + (plotW * i) / 4
    const y = pad + (plotH * i) / 4
    ctx.beginPath()
    ctx.moveTo(x, pad)
    ctx.lineTo(x, pad + plotH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(pad + plotW, y)
    ctx.stroke()
  }

  // axes
  ctx.strokeStyle = colors.axis
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(pad, pad + plotH)
  ctx.lineTo(pad + plotW, pad + plotH)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(pad, pad)
  ctx.lineTo(pad, pad + plotH)
  ctx.stroke()

  const mapX = (x: number) => pad + (x / maxX) * plotW
  const mapY = (y: number) => pad + plotH - (y / maxY) * plotH

  // trajectory line
  ctx.strokeStyle = colors.line
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i < pts.length; i++) {
    const px = mapX(pts[i].x)
    const py = mapY(pts[i].y)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // current position dot
  if (current) {
    const cx = mapX(current.x)
    const cy = mapY(current.y)
    ctx.fillStyle = colors.dot
    ctx.beginPath()
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

export function ProjectileSimulator() {
  const [v0, setV0] = useState(20) // m/s
  const [theta, setTheta] = useState(45) // degrees
  const [g, setG] = useState(9.8)
  const [playing, setPlaying] = useState(false)
  const [t01, setT01] = useState(0)

  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const lastTsRef = useRef<number | null>(null)

  const { T, R, H, pts } = useMemo(() => {
    const rad = (theta * Math.PI) / 180
    const T = (2 * v0 * Math.sin(rad)) / g
    const R = (v0 * v0 * Math.sin(2 * rad)) / g
    const H = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * g)
    const sampled = sampleTrajectory(v0, theta, g, 0.05)
    return { T, R, H, pts: sampled.pts }
  }, [v0, theta, g])

  const current = useMemo(() => {
    if (!pts.length) return null
    const vx = v0 * Math.cos((theta * Math.PI) / 180)
    const vy = v0 * Math.sin((theta * Math.PI) / 180)
    const t = (t01 ?? 0) * T
    const x = vx * t
    const y = Math.max(0, vy * t - 0.5 * g * t * t)
    return { x, y }
  }, [pts.length, T, g, t01, theta, v0])

  useEffect(() => {
    const c = chartRef.current
    if (!c) return
    drawChart(
      c,
      pts,
      current,
      {
        bg: 'rgba(15,23,42,0.55)',
        grid: 'rgba(255,255,255,0.06)',
        axis: 'rgba(255,255,255,0.14)',
        line: 'rgba(0,227,253,0.9)',
        dot: 'rgba(0,86,210,1)',
      },
    )
  }, [pts, current])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = (ts: number) => {
      const last = lastTsRef.current
      lastTsRef.current = ts
      const dt = last == null ? 0 : Math.min(0.05, (ts - last) / 1000)
      // make the simulation feel real but not too slow
      const speed = 0.35
      setT01((p) => {
        const next = p + (dt / Math.max(T, 0.01)) / speed
        if (next >= 1) {
          // stop at landing
          return 1
        }
        return next
      })
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(raf)
      lastTsRef.current = null
    }
  }, [playing, T])

  useEffect(() => {
    if (t01 >= 1 && playing) setPlaying(false)
  }, [t01, playing])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-secondary">
          <span className="material-symbols-outlined">rocket_launch</span>
          <h3 className="text-2xl font-black">محاكي المقذوفات</h3>
        </div>
        <p className="text-slate-400 font-semibold mt-2">زاوية الإطلاق والسرعة وتأثيرهم على المدى والزمن.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-5">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">نتائج</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">R (m)</p>
                <p className="text-2xl font-black font-headline">{R.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">T (s)</p>
                <p className="text-2xl font-black font-headline">{T.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 col-span-2">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">Hmax (m)</p>
                <p className="text-2xl font-black font-headline">{H.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">x(t)</p>
                <p className="text-lg font-black font-headline text-secondary">
                  {current ? current.x.toFixed(2) : '—'} m
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">y(t)</p>
                <p className="text-lg font-black font-headline text-secondary">
                  {current ? current.y.toFixed(2) : '—'} m
                </p>
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[11px] font-black tracking-widest uppercase text-slate-300">Trajectory chart</p>
                <p className="text-[11px] font-black text-slate-300">
                  {Math.round(t01 * 100)}%
                </p>
              </div>
              <div className="px-4 pb-4">
                <canvas ref={chartRef} className="w-full h-44 rounded-xl" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setT01(0)
                  setPlaying(true)
                }}
                className="flex-1 bg-secondary text-slate-900 py-3 rounded-2xl font-black active:scale-95 transition-all"
              >
                قذف
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl font-black hover:bg-white/10 active:scale-95 transition-all"
              >
                {playing ? 'إيقاف' : 'تشغيل'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false)
                  setT01(0)
                }}
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl font-black hover:bg-white/10 active:scale-95 transition-all"
              >
                Reset
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">المعادلة</p>
              <p className="text-lg font-black text-secondary">R = v² sin(2θ) / g</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { label: 'السرعة الابتدائية v0 (m/s)', value: v0, set: setV0, min: 5, max: 60, step: 1 },
              { label: 'زاوية الإطلاق θ (deg)', value: theta, set: setTheta, min: 5, max: 85, step: 1 },
              { label: 'الجاذبية g (m/s²)', value: g, set: setG, min: 8, max: 12, step: 0.1 },
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
                  onChange={(e) => {
                    setPlaying(false)
                    setT01(0)
                    c.set(parseFloat(e.target.value))
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

