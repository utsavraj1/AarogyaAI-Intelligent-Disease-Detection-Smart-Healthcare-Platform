"use client"

import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('aarogyaai_admin_auth')
    localStorage.removeItem('aarogyaai_auth')
    navigate('/admin-login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-emerald-600 text-white font-bold text-xs">SA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-slate-900 dark:text-emerald-50">{user.name}</span>
                <span className="truncate text-xs text-slate-500 dark:text-emerald-500/40">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 text-slate-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-slate-200 dark:border-emerald-900/30 dark:bg-[#0b1311]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-emerald-600 text-white font-bold text-xs">SA</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-900 dark:text-emerald-50">{user.name}</span>
                  <span className="truncate text-xs text-slate-500 dark:text-emerald-500/40">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-emerald-900/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="dark:text-emerald-100 hover:dark:bg-emerald-900/20">
                <BadgeCheckIcon className="size-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-emerald-100 hover:dark:bg-emerald-900/20">
                <BellIcon className="size-4 mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="dark:bg-emerald-900/20" />
            <DropdownMenuItem onClick={handleLogout} className="text-rose-600 dark:text-rose-400 hover:dark:bg-rose-900/10 cursor-pointer font-medium">
              <LogOutIcon className="size-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

