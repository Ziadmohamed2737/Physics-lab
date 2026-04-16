import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../store/auth'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-sm font-black transition-colors',
          isActive ? 'text-primary' : 'text-slate-500 hover:text-primary',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
      <button type="button" onClick={() => navigate('/home')} className="flex items-center gap-3">
        <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">science</span>
        </span>
        <span className="text-xl font-extrabold tracking-tight text-primary font-headline">مختبر الفيزياء</span>
      </button>

      <div className="hidden md:flex items-center gap-6">
        <NavItem to="/home" label="الرئيسية" />
        <NavItem to="/lectures" label="المحاضرات" />
        <NavItem to="/experiments" label="التجارب" />
        <NavItem to="/quiz" label="الاختبارات" />
        <NavItem to="/profile" label="الملف الشخصي" />
        {auth.isAdmin() ? <NavItem to="/admin" label="لوحة الأدمن" /> : null}
      </div>

      <button
        type="button"
        onClick={() => {
          auth.logout()
          navigate('/login', { replace: true })
        }}
        className="inline-flex text-slate-500 hover:text-primary p-2 rounded-xl hover:bg-slate-50 transition-colors"
        aria-label="تسجيل الخروج"
      >
        <span className="material-symbols-outlined">logout</span>
      </button>
    </nav>
  )
}

