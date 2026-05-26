import { ShieldCheck, Menu, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

const THEME_STORAGE_KEY = 'aarogyaai_theme'

interface SiteHeaderProps {
  onMenuClick?: () => void
  title?: string
}

export function SiteHeader({ onMenuClick, title = "Command Center" }: SiteHeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored as 'light' | 'dark') || 'dark'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-emerald-900/10 bg-white/80 dark:bg-[#020807]/80 backdrop-blur-xl transition-all sticky top-0 z-50">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-8">
        <button 
          onClick={onMenuClick}
          className="-ml-1 p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        
        <div className="hidden lg:block w-[1px] h-5 bg-emerald-900/20 mx-3" />
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-extrabold tracking-tight text-emerald-950 dark:text-white heading-font uppercase">{title}</h1>
            <div className="hidden sm:flex border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full">
              Secure Node: 0x8F2
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleTheme}
               className="p-2 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
               title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
             >
                {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
             </button>

             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-900/10">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600/60 dark:text-emerald-500/60">System Operational</p>
             </div>
             <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                <ShieldCheck className="size-4" />
             </div>
          </div>
        </div>
      </div>
    </header>
  )
}

