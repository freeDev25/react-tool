import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        gap: 0,
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        padding: 0
      }}>
        <Link
          to="/"
          style={{
            padding: '16px 24px',
            textDecoration: 'none',
            color: location.pathname === '/' ? '#2196f3' : '#666',
            fontWeight: location.pathname === '/' ? 600 : 400,
            borderBottom: location.pathname === '/' ? '2px solid #2196f3' : '2px solid transparent',
            backgroundColor: location.pathname === '/' ? '#f8f9fa' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Playground
        </Link>
        <Link
          to="/generate"
          style={{
            padding: '16px 24px',
            textDecoration: 'none',
            color: location.pathname === '/generate' ? '#2196f3' : '#666',
            fontWeight: location.pathname === '/generate' ? 600 : 400,
            borderBottom: location.pathname === '/generate' ? '2px solid #2196f3' : '2px solid transparent',
            backgroundColor: location.pathname === '/generate' ? '#f8f9fa' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Generate
        </Link>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
