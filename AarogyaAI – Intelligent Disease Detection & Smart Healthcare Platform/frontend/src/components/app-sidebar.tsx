"use client"

import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  Settings2, 
  LifeBuoy, 
  Send,
  X,
  ChevronRight,
  LogOut,
  Info
} from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { useAuth } from "../context/AuthContext"

const adminData = {
  user: {
    name: "Super Admin",
    email: "admin@aarogyaai.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: "/admin" },
        { title: "Statistics", url: "/admin/stats" },
      ],
    },
    {
      title: "Verifications",
      url: "/admin/verifications",
      icon: ClipboardCheck,
      items: [
        { title: "Pending Doctors", url: "/admin/verifications" },
        { title: "Approved List", url: "/admin/doctors-list" },
      ],
    },
    {
      title: "Network",
      url: "/admin/patients",
      icon: Users,
      items: [
        { title: "Patients", url: "/admin/patients" },
        { title: "Doctors", url: "/admin/doctors" },
      ],
    },
    {
      title: "System",
      url: "/admin/models",
      icon: Settings2,
      items: [
        { title: "ML Models", url: "/admin/models" },
        { title: "Database", url: "/admin/database" },
        { title: "Logs", url: "/admin/logs" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
    { title: "System Insight", url: "/about", icon: Info },
  ],
}

const patientData = {
  user: {
    name: "Patient Portal",
    email: "patient@aarogyaai.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Health Core",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Clinical Overview", url: "/dashboard" },
        { title: "My Predictions", url: "/predictions" },
      ],
    },
    {
      title: "Services",
      url: "/diagnosis",
      icon: ClipboardCheck,
      items: [
        { title: "Run Diagnosis", url: "/diagnosis" },
        { title: "Health Locker", url: "/locker" },
        { title: "Specialist Network", url: "/doctors" },
        { title: "My Appointments", url: "/appointments" },
      ],
    },
  ],
  navSecondary: [
    { title: "Clinical Support", url: "#", icon: LifeBuoy },
    { title: "Profile Security", url: "/profile", icon: Settings2 },
    { title: "System Insight", url: "/about", icon: Info },
  ],
}

const doctorData = {
  user: {
    name: "Dr. Workspace",
    email: "doctor@aarogyaai.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Clinical Workspace",
      url: "/doctor",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview Node", url: "/doctor" },
        { title: "Clinical Queue", url: "/doctor/appointments" },
      ],
    },
    {
      title: "Patient Network",
      url: "/doctor/patients",
      icon: Users,
      items: [
        { title: "My Patients", url: "/doctor/patients" },
        { title: "Inference Logs", url: "/doctor/logs" },
      ],
    },
  ],
  navSecondary: [
    { title: "Medical Support", url: "#", icon: LifeBuoy },
    { title: "Professional Profile", url: "/profile", icon: Settings2 },
    { title: "System Insight", url: "/about", icon: Info },
  ],
}

interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  role?: 'admin' | 'patient' | 'doctor'
}

export function AppSidebar({ isOpen, onClose, role = 'admin' }: AppSidebarProps) {
  const { user, logout } = useAuth()
  const data = role === 'admin' ? adminData : role === 'doctor' ? doctorData : patientData
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<string[]>(["Dashboard", "Health Core", "Clinical Workspace"])

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const isPathActive = (path: string) => {
    if (path === '/' || path === '/dashboard' || path === '/admin' || path === '/doctor') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[70] w-72 bg-card border-r border-border transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
          <Link to={role === 'admin' ? "/admin" : role === 'doctor' ? "/doctor" : "/dashboard"} className="flex items-center gap-3 group">
            <BrandLogo className="h-9 w-9" />
          </Link>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-primary">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {/* Main Nav */}
          <div className="space-y-2">
            <p className="px-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Platform</p>
            {data.navMain.map((item) => {
              const isExpanded = expandedItems.includes(item.title)
              const hasActiveChild = item.items?.some(sub => isPathActive(sub.url))
              
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                      ${(isExpanded || hasActiveChild) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`size-[18px] ${(isExpanded || hasActiveChild) ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary"}`} />
                      <span className="text-sm font-bold">{item.title}</span>
                    </div>
                    {item.items && (
                      <ChevronRight className={`size-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                    )}
                  </button>
                  
                  {item.items && isExpanded && (
                    <div className="ml-9 space-y-1 py-1 border-l border-border/50">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.url}
                          className={`
                            block px-4 py-1.5 text-xs font-bold transition-colors
                            ${isPathActive(subItem.url) ? "text-primary border-l-2 border-primary -ml-[2px]" : "text-muted-foreground/60 hover:text-primary"}
                          `}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Secondary Nav */}
          <div className="space-y-2">
            <p className="px-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">Support</p>
            {data.navSecondary.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                  ${isPathActive(item.url) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"}
                `}
              >
                <item.icon className={`size-[18px] ${isPathActive(item.url) ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary"}`} />
                <span className="text-sm font-bold">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-secondary/30">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-primary/5 transition-colors group cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-foreground truncate">{user?.full_name || data.user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || data.user.email}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-muted-foreground/40 hover:text-destructive transition-colors"
              title="Logout from System"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
