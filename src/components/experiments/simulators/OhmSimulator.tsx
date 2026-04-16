import { useMemo, useState } from 'react'

function Battery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="-16" x2="0" y2="16" stroke="white" strokeWidth="3" opacity="0.9" />
      <line x1="10" y1="-10" x2="10" y2="10" stroke="white" strokeWidth="6" opacity="0.9" />
      <text x="20" y="-6" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="800">
        +
      </text>
      <text x="20" y="14" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="800">
        -
      </text>
    </g>
  )
}

function Resistor({
  x,
  y,
  label,
}: {
  x: number
  y: number
  label: string
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-18" y="-10" width="36" height="20" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" />
      <path
        d="M -14 0 L -9 -6 L -4 6 L 1 -6 L 6 6 L 11 -6 L 14 0"
        stroke="rgba(0,227,253,0.9)"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      <text x="0" y="24" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="800">
        {label}
      </text>
    </g>
  )
}

function CircuitDiagram({
  mode,
  v,
  r1,
  r2,
  currentA,
}: {
  mode: 'series' | 'parallel'
  v: number
  r1: number
  r2: number
  currentA: number
}) {
  const showCurrent = Number.isFinite(currentA) && currentA > 0
  return (
    <div className="bg-black/30 border border-white/10 rounded-[2rem] p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-black tracking-widest uppercase text-slate-300">Circuit</p>
        <div className="flex items-center gap-3 text-[11px] font-black text-slate-300">
          <span>V={v}V</span>
          <span>R1={r1}Ω</span>
          <span>R2={r2}Ω</span>
        </div>
      </div>

      <svg viewBox="0 0 360 210" className="w-full h-48">
        {/* base wire */}
        <path
          d="M 60 55 H 140 M 220 55 H 300 V 155 H 60 V 55"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Battery x={60} y={105} />

        {mode === 'series' ? (
          <>
            <Resistor x={180} y={55} label="R1" />
            <Resistor x={220} y={55} label="R2" />
            {/* wire segments around resistors */}
            <path
              d="M 140 55 H 162 M 198 55 H 202 M 238 55 H 300"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {showCurrent ? (
              <path
                d="M 60 55 H 140 H 162 H 198 H 202 H 238 H 300 V 155 H 60 V 55"
                className="circuit-flow"
                stroke="rgba(0,227,253,0.9)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            ) : null}
          </>
        ) : (
          <>
            {/* parallel branches */}
            <path
              d="M 140 55 H 300"
              stroke="rgba(255,255,255,0.0)"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 140 55 V 85 H 300 V 55"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 140 55 V 25 H 300 V 55"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <Resistor x={220} y={25} label="R1" />
            <Resistor x={220} y={85} label="R2" />

            {showCurrent ? (
              <>
                <path
                  d="M 60 55 H 140 V 25 H 300 V 55 V 155 H 60 V 55"
                  className="circuit-flow"
                  stroke="rgba(0,227,253,0.9)"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 55 H 140 V 85 H 300 V 55 V 155 H 60 V 55"
                  className="circuit-flow"
                  stroke="rgba(0,227,253,0.55)"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : null}
          </>
        )}

        {/* ground shadow */}
        <ellipse cx="210" cy="176" rx="110" ry="14" fill="rgba(0,0,0,0.35)" />
      </svg>
    </div>
  )
}

export function OhmSimulator() {
  const [mode, setMode] = useState<'series' | 'parallel'>('series')
  const [v, setV] = useState(12)
  const [r1, setR1] = useState(6)
  const [r2, setR2] = useState(6)

  const { req, i, p } = useMemo(() => {
    const req =
      mode === 'series'
        ? r1 + r2
        : r1 === 0 || r2 === 0
          ? 0
          : 1 / (1 / r1 + 1 / r2)
    const i = req === 0 ? Infinity : v / req
    const p = Number.isFinite(i) ? v * i : Infinity
    return { req, i, p }
  }, [mode, v, r1, r2])

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-7 md:p-10 text-white space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined">electric_bolt</span>
              <h3 className="text-2xl font-black">محاكي قانون أوم</h3>
            </div>
            <p className="text-slate-400 font-semibold mt-2">
              اختار توالي/توازي وشوف المقاومة المكافئة والتيار.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('series')}
              className={[
                'px-4 py-2 rounded-full font-black text-sm border transition-all active:scale-95',
                mode === 'series'
                  ? 'bg-secondary text-slate-900 border-secondary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10',
              ].join(' ')}
            >
              توالي
            </button>
            <button
              type="button"
              onClick={() => setMode('parallel')}
              className={[
                'px-4 py-2 rounded-full font-black text-sm border transition-all active:scale-95',
                mode === 'parallel'
                  ? 'bg-secondary text-slate-900 border-secondary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10',
              ].join(' ')}
            >
              توازي
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-8">
          <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 p-6 space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-secondary">نتائج</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                  Req (Ω)
                </p>
                <p className="text-2xl font-black font-headline">{req.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                  I (A)
                </p>
                <p className="text-2xl font-black font-headline">
                  {Number.isFinite(i) ? i.toFixed(2) : '∞'}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-2">
                القدرة P (W)
              </p>
              <p className="text-lg font-black text-secondary">
                {Number.isFinite(p) ? p.toFixed(1) : '∞'}
              </p>
            </div>

            <CircuitDiagram mode={mode} v={v} r1={r1} r2={r2} currentA={i} />
          </div>

          <div className="space-y-8">
            {[
              { label: 'الجهد V (Volt)', value: v, set: setV, min: 1, max: 24, unit: 'V' },
              { label: 'المقاومة R1 (Ω)', value: r1, set: setR1, min: 1, max: 50, unit: 'Ω' },
              { label: 'المقاومة R2 (Ω)', value: r2, set: setR2, min: 1, max: 50, unit: 'Ω' },
            ].map((c) => (
              <div className="space-y-3" key={c.label}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase tracking-wider text-slate-300">
                    {c.label}
                  </label>
                  <span className="text-secondary font-headline font-black">
                    {c.value} {c.unit}
                  </span>
                </div>
                <input
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                  type="range"
                  min={c.min}
                  max={c.max}
                  value={c.value}
                  onChange={(e) => c.set(parseInt(e.target.value, 10))}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setMode('series')
                setV(12)
                setR1(6)
                setR2(6)
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

