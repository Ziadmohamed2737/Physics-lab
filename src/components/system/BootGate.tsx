import { useEffect, useMemo, useState } from 'react'

type BootState =
  | { status: 'loading'; progress: number; label: string }
  | { status: 'ready' }

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

export function BootGate({ children }: { children: React.ReactNode }) {
  const steps = useMemo(
    () => [
      { label: 'Connecting to lab network…', run: async () => fetch('/favicon.svg') },
      { label: 'Loading lectures…', run: async () => import('../../data/lectures') },
      { label: 'Loading experiments…', run: async () => import('../../data/experiments') },
      { label: 'Loading quizzes…', run: async () => import('../../data/quizzes') },
      {
        label: 'Syncing your progress…',
        run: async () => {
          const mod = await import('../../store/progress')
          await mod.progress.hydrateFromServer()
        },
      },
      { label: 'Preparing your experiment…', run: async () => sleep(350) },
    ],
    [],
  )

  const [state, setState] = useState<BootState>({
    status: 'loading',
    progress: 0,
    label: 'Preparing your experiment…',
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return
        setState({ status: 'loading', progress: i / steps.length, label: steps[i].label })
        try {
          await steps[i].run()
        } catch {
          // best effort boot
        }
        setState({
          status: 'loading',
          progress: Math.min(0.99, (i + 1) / steps.length),
          label: steps[i].label,
        })
      }
      if (cancelled) return
      setState({ status: 'ready' })
    })()
    return () => {
      cancelled = true
    }
  }, [steps])

  if (state.status !== 'ready') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-surface physics-gradient px-6">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto mb-10 w-40 h-40">
            <div className="absolute inset-0 rounded-full border border-primary/10" />
            <div className="absolute inset-4 rounded-full border border-primary/5" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/15 animate-slow-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/5 blur-2xl animate-pulse" />
            </div>
            <div className="spark top-0 left-1/2 -translate-x-1/2" style={{ animationDelay: '0.2s' }} />
            <div className="spark bottom-0 left-1/2 -translate-x-1/2" style={{ animationDelay: '0.8s' }} />
            <div className="spark left-0 top-1/2 -translate-y-1/2 rotate-90" style={{ animationDelay: '1.4s' }} />
            <div className="spark right-0 top-1/2 -translate-y-1/2 rotate-90" style={{ animationDelay: '0.5s' }} />
          </div>

          <p className="text-sm font-black text-primary/80 tracking-widest uppercase mb-3">
            {state.label}
          </p>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-sm">
            <div
              className="h-full bg-gradient-to-l from-primary to-secondary transition-all duration-300"
              style={{ width: `${Math.round(state.progress * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400 font-semibold">
            {Math.round(state.progress * 100)}%
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

