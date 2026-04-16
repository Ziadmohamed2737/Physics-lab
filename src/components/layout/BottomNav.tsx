import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'

function Item({ to, icon, activeFill }: { to: string; icon: string; activeFill?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        ['p-2 transition-colors', isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'].join(' ')
      }
      aria-label={to}
    >
      <span
        className="material-symbols-outlined text-2xl"
        style={
          activeFill ? ({ fontVariationSettings: "'FILL' 1" } as CSSProperties) : undefined
        }
      >
        {icon}
      </span>
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center px-4 py-4 z-50 rounded-t-3xl shadow-lg">
      <Item to="/home" icon="home" activeFill />
      <Item to="/lectures" icon="menu_book" />
      <Item to="/experiments" icon="science" />
      <Item to="/profile" icon="person" />
    </nav>
  )
}

