import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  User,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Create Meme', href: '/create', icon: Sparkles },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const AppShell = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <Sparkles className="h-8 w-8 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">MemePulse</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Premium User</p>
                <p className="text-xs text-white/70 truncate">user@example.com</p>
              </div>
              <Settings className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell