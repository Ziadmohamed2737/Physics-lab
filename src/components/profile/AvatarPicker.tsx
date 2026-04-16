import { AVATARS } from '../../ui/avatars'

export function AvatarPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {AVATARS.map((a) => {
        const active = a.id === value
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onChange(a.id)}
            className={[
              'rounded-2xl border p-2 bg-white transition-all active:scale-95',
              active ? 'border-primary shadow-glow' : 'border-slate-200 hover:border-primary/40',
            ].join(' ')}
            aria-label={a.label}
          >
            <div
              className="w-full aspect-square rounded-xl overflow-hidden"
              dangerouslySetInnerHTML={{ __html: a.svg }}
            />
          </button>
        )
      })}
    </div>
  )
}

