/**
 * AppShell.tsx — Full shadcn Sidebar layout
 * - shadcn SidebarProvider + Sidebar
 * - Logout in sidebar footer (Avatar + DropdownMenu)
 * - TopBar: breadcrumb + first name + dark/light icon only
 * - Skeleton loading state support
 */
import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/BrandLogo'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  LayoutDashboardIcon,
  MicroscopeIcon,
  FolderHeartIcon,
  BarChart3Icon,
  StethoscopeIcon,
  CalendarCheckIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  InfoIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
  ChevronsUpDownIcon,
} from 'lucide-react'

const THEME_STORAGE_KEY = 'aarogyaai_theme'

const navMain = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon },
  { label: 'Run Diagnosis', path: '/diagnosis', icon: MicroscopeIcon },
  { label: 'Health Locker', path: '/locker', icon: FolderHeartIcon },
  { label: 'My Predictions', path: '/predictions', icon: BarChart3Icon },
]

const navCare = [
  { label: 'Find a Doctor', path: '/doctors', icon: StethoscopeIcon },
  { label: 'Appointments', path: '/appointments', icon: CalendarCheckIcon },
]

const navAccount = [
  { label: 'My Profile', path: '/profile', icon: UserCircleIcon },
  { label: 'About', path: '/about', icon: InfoIcon },
]

/* Route label for breadcrumb */
const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/diagnosis': 'Run Diagnosis',
  '/locker': 'Health Locker',
  '/predictions': 'My Predictions',
  '/doctors': 'Find a Doctor',
  '/appointments': 'Appointments',
  '/profile': 'My Profile',
  '/admin': 'Admin Panel',
  '/about': 'About',
}

function NavGroup({
  label,
  items,
  loading,
}: {
  label: string
  items: typeof navMain
  loading?: boolean
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-emerald-950/40 dark:text-sidebar-foreground/50 uppercase">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))
            : items.map(({ label: lbl, path, icon: Icon }) => {
              const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
              return (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton asChild tooltip={lbl} isActive={isActive} className="gap-3">
                    <NavLink
                      to={path}
                      end={path === '/'}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="font-medium">{lbl}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppShell() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme(p => p === 'light' ? 'dark' : 'light')

  const firstName = user?.full_name?.split(' ')[0] ?? 'User'
  const initials = (user?.full_name ?? 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const currentLabel = routeLabels[location.pathname] ?? 'AarogyaAI'

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* ══════════ SIDEBAR ══════════ */}
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          {/* Header — brand */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <NavLink to="/" className="flex items-center">
                    <BrandLogo className="h-9 w-9" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarSeparator />

          {/* Content — nav groups */}
          <SidebarContent>
            <NavGroup label="Diagnostics" items={navMain} />
            <SidebarSeparator />
            <NavGroup label="Care" items={navCare} />
            <SidebarSeparator />
            <NavGroup label="Account" items={navAccount} />
          </SidebarContent>

          {/* Footer — user + logout */}
          <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar size="sm" className="rounded-lg shrink-0">
                        <AvatarFallback className="rounded-lg bg-emerald-800 text-amber-200 text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">{user?.full_name ?? 'User'}</span>
                        <span className="truncate text-xs text-sidebar-foreground/60">{user?.email ?? ''}</span>
                      </div>
                      <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 rounded-xl"
                    side="top"
                    align="end"
                    sideOffset={4}
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold">{user?.full_name}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <NavLink to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <UserCircleIcon className="h-4 w-4" />
                        My Profile
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheckIcon className="h-4 w-4" />
                        Admin Panel
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* ── TopBar ── */}
          <header className="topbar-glass accent-ring sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            {/* Left: sidebar trigger + breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="icon-button h-9 w-9 rounded-lg shrink-0" />

              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden sm:flex">
                    <BreadcrumbLink asChild>
                    <NavLink to="/" className="text-emerald-950/70 hover:text-emerald-900 dark:text-emerald-200/60 dark:hover:text-white text-xs font-medium">
                      AarogyaAI
                    </NavLink>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {location.pathname !== '/' && (
                    <>
                      <BreadcrumbSeparator className="hidden sm:flex" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-emerald-900 dark:text-white text-xs font-medium">
                          {currentLabel}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right: first name + theme toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* First name greeting */}
              {user && (
                <span className="hidden md:inline-block text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                  Hi, {firstName} 👋
                </span>
              )}

              {/* ☀️ / 🌙 icon toggle */}
              <button
                id="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                className="icon-button inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-auto bg-transparent">
            <div className="mx-auto max-w-6xl p-4 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
