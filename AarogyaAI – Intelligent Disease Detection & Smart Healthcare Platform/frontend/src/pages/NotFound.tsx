import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="glass-card rounded-3xl p-8 text-center">
      <h2 className="heading-font text-3xl font-semibold text-emerald-900">Page not found</h2>
      <p className="mt-2 text-sm text-emerald-900/70">The route you requested does not exist.</p>
      <Link
        to="/"
        className="lux-button-secondary mt-6 inline-flex rounded-full px-5 py-2 text-sm"
      >
        Return to dashboard
      </Link>
    </section>
  )
}
