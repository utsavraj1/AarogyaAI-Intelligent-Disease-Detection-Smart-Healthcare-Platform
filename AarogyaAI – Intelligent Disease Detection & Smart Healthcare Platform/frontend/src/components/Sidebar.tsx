import { NavLink } from 'react-router-dom'
import { classNames } from '../lib/utils'

const navItems = [
  { label: '🏠 Dashboard', path: '/dashboard' },
  { label: '🔬 Run Diagnosis', path: '/diagnosis' },
  { label: '🗂 Health Locker', path: '/locker' },
  { label: '📈 My Predictions', path: '/predictions' },
  { label: '🏥 Find a Doctor', path: '/doctors' },
  { label: '📅 Appointments', path: '/appointments' },
  { label: '👤 My Profile', path: '/profile' },
  { label: 'ℹ️ About', path: '/about' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-2xl">
          🪷
        </div>
        <div>
          <p className="text-lg font-semibold text-emerald-900">AarogyaAI</p>
          <p className="mono text-xs uppercase text-amber-700">intelligent diagnosis</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              classNames(
                'lux-nav-link',
                isActive ? 'lux-nav-link-active' : 'lux-nav-link-idle'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="lux-note mt-auto rounded-2xl p-4 text-xs">
        <p className="font-semibold text-emerald-900">Research use only.</p>
        <p className="text-emerald-900/80">AI predictions are probabilistic. Always consult a clinician.</p>
      </div>
    </aside>
  )
}
