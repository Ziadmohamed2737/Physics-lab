export type AvatarDef = {
  id: string
  label: string
  svg: string
}

const mk = (id: string, label: string, svg: string): AvatarDef => ({ id, label, svg })

// Lightweight inline SVGs (6 characters: 3 boys, 3 girls)
export const AVATARS: AvatarDef[] = [
  mk(
    'boy_1',
    'ولد 1',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#0056D2"/><stop offset="1" stop-color="#00E3FD"/></linearGradient></defs>
      <rect width="128" height="128" rx="28" fill="#F1F7FF"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M36 54c6-18 19-28 28-28s22 10 28 28c-6-4-16-8-28-8s-22 4-28 8z" fill="#1F2937"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 70c6 6 10 6 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M30 112c4-18 18-28 34-28h0c16 0 30 10 34 28" fill="url(#g)"/>
    </svg>`,
  ),
  mk(
    'boy_2',
    'ولد 2',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#F8FAFC"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M38 48c2-16 14-28 26-28s24 12 26 28c-7-6-17-10-26-10s-19 4-26 10z" fill="#0F172A"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 72c5 4 11 4 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M28 112c5-16 19-26 36-26s31 10 36 26" fill="#0056D2" opacity="0.9"/>
      <path d="M36 96h56" stroke="#00E3FD" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    </svg>`,
  ),
  mk(
    'boy_3',
    'ولد 3',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#F1F7FF"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M34 52c4-20 20-34 30-34s26 14 30 34c-7-8-18-12-30-12s-23 4-30 12z" fill="#334155"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 72c6 5 10 5 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M26 112c6-18 20-28 38-28s32 10 38 28" fill="#0EA5E9" opacity="0.9"/>
      <circle cx="96" cy="34" r="10" fill="#00E3FD" opacity="0.25"/>
    </svg>`,
  ),
  mk(
    'girl_1',
    'بنت 1',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="p" x1="0" x2="1"><stop stop-color="#7C3AED"/><stop offset="1" stop-color="#00E3FD"/></linearGradient></defs>
      <rect width="128" height="128" rx="28" fill="#FFF7FB"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M32 58c0-20 14-40 32-40s32 20 32 40c-8-12-22-18-32-18s-24 6-32 18z" fill="#4C1D95"/>
      <path d="M40 54c4 10 10 16 24 16s20-6 24-16" fill="#4C1D95" opacity="0.35"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 72c6 6 10 6 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M28 112c6-18 20-28 36-28s30 10 36 28" fill="url(#p)"/>
    </svg>`,
  ),
  mk(
    'girl_2',
    'بنت 2',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#F8FAFC"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M32 60c0-22 16-44 32-44s32 22 32 44c-10-16-22-20-32-20s-22 4-32 20z" fill="#0F172A"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 72c5 4 11 4 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M26 112c7-18 22-28 38-28s31 10 38 28" fill="#22C55E" opacity="0.9"/>
      <path d="M38 46c6-8 16-14 26-14s20 6 26 14" stroke="#00E3FD" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
    </svg>`,
  ),
  mk(
    'girl_3',
    'بنت 3',
    `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#FFF7FB"/>
      <circle cx="64" cy="54" r="28" fill="#FFD7C2"/>
      <path d="M30 64c2-24 18-48 34-48s32 24 34 48c-10-18-22-24-34-24s-24 6-34 24z" fill="#1E293B"/>
      <circle cx="54" cy="56" r="3" fill="#111827"/><circle cx="74" cy="56" r="3" fill="#111827"/>
      <path d="M56 72c6 6 10 6 16 0" stroke="#111827" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M28 112c6-18 20-28 36-28s30 10 36 28" fill="#F97316" opacity="0.9"/>
      <circle cx="92" cy="30" r="12" fill="#00E3FD" opacity="0.18"/>
    </svg>`,
  ),
]

export function avatarSvg(id: string) {
  return AVATARS.find((a) => a.id === id)?.svg ?? AVATARS[0].svg
}

