import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getExperiment } from '../data/experiments'
import { CompassSimulator } from '../components/experiments/simulators/CompassSimulator'
import { HookeSimulator } from '../components/experiments/simulators/HookeSimulator'
import { LensSimulator } from '../components/experiments/simulators/LensSimulator'
import { MicrometerSimulator } from '../components/experiments/simulators/MicrometerSimulator'
import { OhmSimulator } from '../components/experiments/simulators/OhmSimulator'
import { PendulumSimulator } from '../components/experiments/simulators/PendulumSimulator'
import { ProjectileSimulator } from '../components/experiments/simulators/ProjectileSimulator'

function Simulator({ type }: { type: string }) {
  switch (type) {
    case 'lens':
      return <LensSimulator />
    case 'ohm':
      return <OhmSimulator />
    case 'compass':
      return <CompassSimulator />
    case 'hooke':
      return <HookeSimulator />
    case 'pendulum':
      return <PendulumSimulator />
    case 'projectile':
      return <ProjectileSimulator />
    case 'micrometer':
      return <MicrometerSimulator />
    default:
      return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-white/5">
          <p className="font-black text-xl mb-2">المحاكي قيد التطوير</p>
          <p className="text-slate-400 font-semibold">
            هنضيف محاكي {type} بتفاعل أعلى في الخطوات الجاية.
          </p>
        </div>
      )
  }
}

export function ExperimentDetailsPage() {
  const navigate = useNavigate()
  const { experimentId } = useParams()
  const experiment = useMemo(() => (experimentId ? getExperiment(experimentId) : null), [experimentId])

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-bold text-slate-600">التجربة غير موجودة.</p>
        <Link className="text-primary font-black hover:underline" to="/experiments">
          رجوع للتجارب
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-4 pb-28">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95"
            onClick={() => navigate('/experiments')}
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </button>
          <h1 className="font-headline tracking-tight text-slate-900 font-black text-xl md:text-2xl">
            {experiment.title}
          </h1>
          <span className="w-10 h-10" />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined">visibility</span>
              <h3 className="font-black text-xl">تعريف</h3>
            </div>
            <p className="text-slate-500 leading-relaxed text-base">{experiment.description}</p>
          </div>
          <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
              <span className="material-symbols-outlined text-[120px]">function</span>
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-black text-xl flex items-center gap-2">
                <span className="material-symbols-outlined">calculate</span>
                القانون
              </h3>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-center font-headline text-3xl font-black tracking-wider">
                  {experiment.law.equation}
                </p>
              </div>
              <p className="text-sm text-blue-100/80 font-semibold leading-snug">
                {experiment.law.description}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              الخطوات
            </h3>
            <span className="text-slate-400 text-sm font-semibold">
              {experiment.steps.length} خطوات
            </span>
          </div>
          <div className="space-y-3">
            {experiment.steps.map((s, idx) => (
              <div
                key={idx}
                className="flex gap-5 items-start bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-xl font-headline">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-900">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Simulator type={experiment.simulator} />
        </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-headline font-black text-xl text-slate-900 mb-3">Example</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            هنضيف هنا مثال محلول مرتبط بنفس القيم اللي اخترتها في المحاكي علشان الفهم يبقى عملي.
          </p>
        </section>
      </div>
    </div>
  )
}

