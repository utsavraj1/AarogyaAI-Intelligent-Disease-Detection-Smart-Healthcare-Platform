export function AboutPage() {
  return (
    <section className="glass-card rounded-3xl p-8">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mono text-xs uppercase text-amber-700">System profile</p>
          <h2 className="heading-font mt-2 text-3xl font-semibold text-emerald-900">About AarogyaAI</h2>
          <p className="mt-2 text-sm text-emerald-900/70">
            Intelligent Disease Detection Platform with secure storage, authenticated access, and specialist discovery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Frontend', 'React + Vite + Tailwind redesign'],
            ['Backend', 'FastAPI with JWT authentication'],
            ['AI Engine', 'TensorFlow + Scikit-learn pipelines'],
            ['Storage', 'SQLAlchemy models and file uploads'],
            ['Reports', 'Automated PDF report generation'],
            ['Doctors', 'Curated specialist directory'],
          ].map(([title, desc]) => (
            <div key={title} className="lux-card p-5">
              <p className="text-sm font-semibold text-emerald-900">{title}</p>
              <p className="mt-2 text-xs text-emerald-900/60">{desc}</p>
            </div>
          ))}
        </div>

        <div className="lux-note rounded-2xl p-4 text-sm">
          For educational use only. Always verify medical outcomes with licensed professionals.
        </div>
      </div>
    </section>
  )
}
