import React, { useState, useEffect } from 'react'
import ComponentPreview from '../ComponentPreview'

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

export default function Playground() {
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
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">📦</span> Components
          </h2>
          <p className="text-xs text-slate-500 mt-1">{manifest?.components.length || 0} available</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 m-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {manifest && manifest.components.length > 0 ? (
            <ul className="space-y-1 p-2">
              {manifest.components.map(comp => (
                <li key={comp.name}>
                  <button
                    onClick={() => {
                      setIsLoading(true)
                      setTimeout(() => {
                        setSelectedComponent(comp.name)
                        setIsLoading(false)
                      }, 300)
                    }}
                    className={`
                      w-full text-left p-3 rounded-lg border-l-4 transition-all duration-200
                      ${selectedComponent === comp.name 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                      }
                    `}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${
                      selectedComponent === comp.name ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                    }`}>
                      <span className="text-lg">
                        {selectedComponent === comp.name ? '▶️' : '📄'}
                      </span>
                      {comp.name}
                    </div>
                    <div className="text-xs text-slate-500 ml-7">
                      {new Date(comp.generatedAt).toLocaleString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : !error && (
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-slate-500">
                {manifest ? 'No components generated yet' : 'Loading components...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-purple-600">🎮</span> Component Playground
              </h1>
              {selectedComponent && (
                <p className="text-sm text-slate-500 mt-1">
                  Now viewing: <span className="font-semibold text-blue-600">{selectedComponent}</span>
                </p>
              )}
            </div>
            {selectedComponent && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live Preview</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Loading component...</p>
                <p className="text-xs text-slate-400">Preparing your preview</p>
              </div>
            </div>
          ) : selectedComponent ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{selectedComponent}.tsx</span>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                </div>
                <div className="p-8 min-h-[400px] bg-gradient-to-br from-white to-slate-50">
                  <ComponentPreview componentName={selectedComponent} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4 p-12">
                <div className="text-6xl mb-4 animate-bounce">🎯</div>
                <h3 className="text-xl font-semibold text-slate-700">Ready to preview!</h3>
                <p className="text-slate-500 max-w-md">
                  Select a component from the sidebar to see it in action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
