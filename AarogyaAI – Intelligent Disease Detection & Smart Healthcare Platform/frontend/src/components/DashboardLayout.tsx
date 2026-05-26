import { ReactNode, useState, useEffect } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  role?: 'admin' | 'patient' | 'doctor'
}

export function DashboardLayout({ children, role = 'patient', title }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex text-foreground overflow-hidden font-sans selection:bg-primary/30 transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <AppSidebar 
        role={role} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto custom-scrollbar">
        <SiteHeader title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative pb-20">
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.03] via-transparent to-primary/[0.02] pointer-events-none" />
          
          <div className="relative z-10 px-4 lg:px-12 py-8">
            {children}
          </div>
        </main>
        
        {/* Balanced Grid Pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M40%2040V0H0v40h40zM1%2039V1h38v38H1z%22%20fill%3D%22currentColor%22%20fill-opacity%3D%220.02%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none z-0" />
      </div>
    </div>
  )
}
