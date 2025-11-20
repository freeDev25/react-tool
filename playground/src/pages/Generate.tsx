import React, { useState } from 'react'

export default function Generate() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Sidebar */}
      <div className={`
        ${leftCollapsed ? 'w-0 min-w-0' : 'w-1/5 min-w-[250px]'}
        border-r border-slate-200 flex flex-col overflow-hidden
        bg-white shadow-lg transition-all duration-300 ease-in-out
      `}>
        {!leftCollapsed && (
          <>
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-blue-600">⚙️</span> Schema Editor
              </h2>
              <button
                onClick={() => setLeftCollapsed(true)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                title="Collapse"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-slate-600 mb-2">Design your component schema</p>
                  <div className="h-32 bg-white rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 text-xs">Schema editor coming soon...</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Left Collapse Button */}
      {leftCollapsed && (
        <button
          onClick={() => setLeftCollapsed(false)}
          className="w-8 border-r border-slate-200 bg-gradient-to-b from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-sm"
          title="Expand Schema Editor"
        >
          <span className="writing-mode-vertical text-xs font-medium">▶</span>
        </button>
      )}

      {/* Middle Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">🎨</span> Live Preview
          </h2>
          <p className="text-sm text-slate-500 mt-1">See your component come to life</p>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-center h-96 border-4 border-dashed border-slate-200 rounded-xl bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
                <div className="text-center space-y-3">
                  <div className="text-6xl">✨</div>
                  <p className="text-slate-600 font-medium">Your component preview will appear here</p>
                  <p className="text-sm text-slate-400">Start building to see the magic happen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Collapse Button */}
      {rightCollapsed && (
        <button
          onClick={() => setRightCollapsed(false)}
          className="w-8 border-l border-slate-200 bg-gradient-to-b from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 cursor-pointer text-slate-600 hover:text-purple-600 transition-all duration-200 shadow-sm"
          title="Expand Properties Panel"
        >
          <span className="writing-mode-vertical text-xs font-medium">◀</span>
        </button>
      )}

      {/* Right Sidebar */}
      <div className={`
        ${rightCollapsed ? 'w-0 min-w-0' : 'w-1/5 min-w-[250px]'}
        border-l border-slate-200 flex flex-col overflow-hidden
        bg-white shadow-lg transition-all duration-300 ease-in-out
      `}>
        {!rightCollapsed && (
          <>
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-purple-600">🎯</span> Properties
              </h2>
              <button
                onClick={() => setRightCollapsed(true)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                title="Collapse"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <p className="text-sm text-slate-600 mb-2">Configure component properties</p>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Name</label>
                      <input 
                        type="text" 
                        placeholder="Component name"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Type</label>
                      <select className="w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Component</option>
                        <option>Node</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
