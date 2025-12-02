import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="flex bg-white border-b border-slate-200 shadow-sm">
        <Link
          to="/"
          className={`
            px-6 py-4 transition-all duration-200 border-b-2 font-medium
            ${location.pathname === '/' 
              ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          🎮 Playground
        </Link>
        <Link
          to="/generate"
          className={`
            px-6 py-4 transition-all duration-200 border-b-2 font-medium
            ${location.pathname === '/generate' 
              ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          ✨ Generate
        </Link>
        <Link
          to="/builder"
          className={`
            px-6 py-4 transition-all duration-200 border-b-2 font-medium
            ${location.pathname === '/builder' 
              ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          🏗️ Builder
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
