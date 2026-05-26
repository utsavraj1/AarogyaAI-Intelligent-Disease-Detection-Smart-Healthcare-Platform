import React from 'react'

export function BrandLogo({ className = "h-10 w-10", iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${iconOnly ? '' : 'w-auto'}`}>
      <div className={`relative flex shrink-0 items-center justify-center ${className}`}>
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />

        {/* Main SVG Icon */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-full w-full">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="text-emerald-500/20" />
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 15" className="text-emerald-500/40" />

          {/* The "A" Structure (AI/Aarogya) */}
          <path d="M30 75L50 25L70 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" />

          {/* Heart Beat / Pulse Line */}
          <path
            d="M20 60H35L42 45L58 75L65 60H80"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          />

          {/* Neural Nodes */}
          <circle cx="50" cy="25" r="5" fill="currentColor" className="text-emerald-400" />
          <circle cx="30" cy="75" r="5" fill="currentColor" className="text-emerald-400" />
          <circle cx="70" cy="75" r="5" fill="currentColor" className="text-emerald-400" />

          {/* Connectors */}
          <line x1="50" y1="25" x2="30" y2="75" stroke="currentColor" strokeWidth="1" className="text-emerald-500/30" />
          <line x1="50" y1="25" x2="70" y2="75" stroke="currentColor" strokeWidth="1" className="text-emerald-500/30" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-emerald-950 dark:text-white leading-none">Aarogya<span className="text-emerald-500">AI</span></span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-900/40 dark:text-emerald-100/40 mt-1 font-bold">Clinical Intelligence</span>
        </div>
      )}
    </div>
  )
}
