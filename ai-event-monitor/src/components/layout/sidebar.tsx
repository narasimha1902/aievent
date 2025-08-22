'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Users,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    ...(user?.role === 'admin' ? [
      {
        name: 'Admin Panel',
        href: '/admin',
        icon: Settings,
        current: pathname === '/admin'
      }
    ] : []),
    ...(user?.role === 'responder' ? [
      {
        name: 'Incidents',
        href: '/incidents',
        icon: AlertTriangle,
        current: pathname.startsWith('/incidents')
      }
    ] : [])
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold">AI Event Monitor</h1>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                item.current
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center px-3 py-2 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
            <span className="text-primary-foreground font-medium">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="font-medium truncate">{user?.full_name}</p>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-background border-r border-border', className)}>
        <SidebarContent />
      </div>
    </>
  )
}