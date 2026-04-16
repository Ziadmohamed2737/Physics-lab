import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'

const HIDE_CHROME_ROUTES = new Set(['/login', '/signup'])

export function AppLayout() {
  const location = useLocation()
  const hideChrome = HIDE_CHROME_ROUTES.has(location.pathname)

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      {!hideChrome ? <Navbar /> : null}
      <main className={hideChrome ? '' : 'pt-20'}>
        <Outlet />
      </main>
      {!hideChrome ? <Footer /> : null}
      {!hideChrome ? <BottomNav /> : null}
    </div>
  )
}

