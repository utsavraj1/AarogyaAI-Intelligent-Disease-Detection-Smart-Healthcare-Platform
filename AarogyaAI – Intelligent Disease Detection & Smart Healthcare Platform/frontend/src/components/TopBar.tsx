import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function TopBar({
  title,
  onMenu,
  theme,
  onToggleTheme,
}: {
  title: string
  onMenu: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const { user, logout } = useAuth()

  /* initials avatar */
  const initials = (user?.full_name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="topbar-glass accent-ring sticky top-0 z-20 flex items-center justify-between gap-4 rounded-2xl px-6 py-4">
      {/* ── Left: hamburger + title ── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
        >
          {/* Hamburger */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <p className="text-sm font-semibold text-emerald-900">{title}</p>
          <p className="text-xs text-emerald-800/70">Intelligent Disease Detection Platform</p>
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-2">

        {/* User name pill (desktop only) */}
        {user && (
          <div className="lux-pill hidden rounded-full px-4 py-2 text-xs font-medium md:block">
            {user.full_name}
          </div>
        )}

        {/* ☀️ / 🌙 Dark-Light toggle */}
        <button
          id="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {theme === 'dark' ? (
            /* Sun — press to go light */
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          ) : (
            /* Moon — press to go dark */
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Profile avatar button → /profile */}
        <Link
          to="/profile"
          id="profile-link"
          title={`My Profile — ${user?.full_name ?? ''}`}
          aria-label="Go to profile"
          className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {initials}
        </Link>

        {/* Log out */}
        <button
          id="logout-button"
          type="button"
          onClick={logout}
          aria-label="Log out"
          title="Log out"
          className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
