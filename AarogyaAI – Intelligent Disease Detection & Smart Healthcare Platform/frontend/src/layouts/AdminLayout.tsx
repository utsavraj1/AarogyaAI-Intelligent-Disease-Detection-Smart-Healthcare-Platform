import { ReactNode, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream dark:bg-[#020807] flex text-emerald-950 dark:text-white overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto custom-scrollbar">
        <SiteHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent pointer-events-none" />
          <div className="relative z-10 px-4 lg:px-12 py-8">
            {children}
          </div>
        </main>
        
        {/* Decorative Grid */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(16%2C%20185%2C%20129%2C%200.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none z-0" />
      </div>
    </div>
  )
}
