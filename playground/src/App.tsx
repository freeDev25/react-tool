import React, { useState, useEffect } from 'react'
import ComponentPreview from './ComponentPreview'

type ManifestComponent = {
  name: string
  type: string
  generatedAt: string
  path: {
    tsx: string
    css: string
  }
}

type Manifest = {
  components: ManifestComponent[]
}

export default function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load manifest on mount
    fetch('/manifest.json')
      .then(res => res.json())
      .then((data: Manifest) => {
        setManifest(data)
        // Auto-select first component if available
        if (data.components.length > 0) {
          setSelectedComponent(data.components[0].name)
        }
      })
      .catch(err => {
        setError('Failed to load manifest.json: ' + err.message)
      })
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Left Sidebar */}
      <div style={{
        width: 280,
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Components</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: 12, margin: 12, background: '#fdd', border: '1px solid #c00', borderRadius: 4 }}>
              {error}
            </div>
          )}

          {manifest && manifest.components.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {manifest.components.map(comp => (
                <li key={comp.name}>
                  <button
                    onClick={() => {
                      setIsLoading(true)
                      // Simulate a small delay to show loading state
                      setTimeout(() => {
                        setSelectedComponent(comp.name)
                        setIsLoading(false)
                      }, 300)
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: selectedComponent === comp.name ? '#e3f2fd' : 'transparent',
                      borderLeft: selectedComponent === comp.name ? '3px solid #2196f3' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      fontSize: 14
                    }}
                    onMouseEnter={(e) => {
                      if (selectedComponent !== comp.name) {
                        e.currentTarget.style.backgroundColor = '#fafafa'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedComponent !== comp.name) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <div style={{ fontWeight: selectedComponent === comp.name ? 600 : 400, marginBottom: 4 }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      {new Date(comp.generatedAt).toLocaleString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : !error && (
            <div style={{ padding: 16, color: '#666', textAlign: 'center' }}>
              {manifest ? 'No components generated yet' : 'Loading...'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>React Tool Playground</h1>
          {selectedComponent && (
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              Rendering: <strong>{selectedComponent}</strong>
            </p>
          )}
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto', backgroundColor: '#fafafa' }}>
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 16
            }}>
              <div style={{
                width: 48,
                height: 48,
                border: '4px solid #e0e0e0',
                borderTop: '4px solid #2196f3',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <div style={{ color: '#666' }}>Loading component...</div>
            </div>
          ) : selectedComponent ? (
            <div style={{ 
              border: '1px solid #ddd', 
              padding: 24, 
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <ComponentPreview componentName={selectedComponent} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
              Select a component from the sidebar to preview
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
