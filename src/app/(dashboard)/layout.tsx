'use client'

import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Code, 
  BookOpen, 
  FileText, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Portfolio', href: '/portfolio', icon: LayoutDashboard },
    { name: 'Snippets', href: '/snippets', icon: Code },
    { name: 'Interview Prep', href: '/interview-prep', icon: BookOpen },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DevFolio
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
