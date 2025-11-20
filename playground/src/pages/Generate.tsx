import React, { useState } from 'react'
import { DynamicComponentRenderer, ComponentSchema } from '../components/DynamicComponentRenderer'

const defaultSchema: ComponentSchema = {
  type: 'node',
  nodeType: 'div',
  styles: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' },
  children: [
    {
      type: 'node',
      nodeType: 'h2',
      styles: { color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: 'bold' },
      children: [{ type: 'text', children: ['Hello from JSON!'] }]
    },
    {
      type: 'node',
      nodeType: 'p',
      styles: { color: '#64748b', fontSize: '16px', lineHeight: '1.6' },
      children: [{ type: 'text', children: ['This component is generated from a JSON schema in real-time. Edit the schema to see changes instantly.'] }]
    },
    {
      type: 'node',
      nodeType: 'button',
      styles: { 
        marginTop: '16px',
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      },
      props: { onClick: () => alert('Button clicked!') },
      children: [{ type: 'text', children: ['Click Me'] }]
    }
  ]
};

export default function Generate() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [schemaJson, setSchemaJson] = useState(JSON.stringify(defaultSchema, null, 2))
  const [schema, setSchema] = useState<ComponentSchema>(defaultSchema)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex h-full bg-linear-to-br from-slate-50 to-blue-50">
      {/* Left Sidebar */}
      <div className={`
        ${leftCollapsed ? 'w-0 min-w-0' : 'w-1/5 min-w-[250px]'}
        border-r border-slate-200 flex flex-col overflow-hidden
        bg-white shadow-lg transition-all duration-300 ease-in-out
      `}>
        {!leftCollapsed && (
          <>
            <div className="px-3 py-2 border-b border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-blue-600">⚙️</span> Schema Editor
              </h2>
              <button
                onClick={() => setLeftCollapsed(true)}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                title="Collapse"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">JSON Schema</span>
                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(schemaJson);
                        setSchema(parsed);
                        setError(null);
                      } catch (e: any) {
                        setError(e.message);
                      }
                    }}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <textarea
                  value={schemaJson}
                  onChange={(e) => setSchemaJson(e.target.value)}
                  className="w-full h-[calc(100vh-200px)] p-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  spellCheck={false}
                />
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Left Collapse Button */}
      {leftCollapsed && (
        <button
          onClick={() => setLeftCollapsed(false)}
          className="w-8 border-r border-slate-200 bg-linear-to-b from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-sm"
          title="Expand Schema Editor"
        >
          <span className="writing-mode-vertical text-xs font-medium">▶</span>
        </button>
      )}

      {/* Middle Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="px-3 py-2 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">🎨</span> Live Preview
          </h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 min-h-[500px]">
              <div className="mb-3 pb-2 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span>🔴</span>
                  <span>🟡</span>
                  <span>🟢</span>
                  <span className="ml-2">Live Preview</span>
                </h3>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg min-h-[400px]">
                <DynamicComponentRenderer schema={schema} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Collapse Button */}
      {rightCollapsed && (
        <button
          onClick={() => setRightCollapsed(false)}
          className="w-8 border-l border-slate-200 bg-linear-to-b from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 cursor-pointer text-slate-600 hover:text-purple-600 transition-all duration-200 shadow-sm"
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
            <div className="px-3 py-2 border-b border-slate-200 bg-linear-to-r from-purple-50 to-pink-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="text-purple-600">🎯</span> Properties
              </h2>
              <button
                onClick={() => setRightCollapsed(true)}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                title="Collapse"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-2 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <p className="text-sm text-slate-600 mb-2">Configure component properties</p>
                  <div className="space-y-3">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Name</label>
                      <input 
                        type="text" 
                        placeholder="Component name"
                        className="w-full text-sm px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Type</label>
                      <select className="w-full text-sm px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
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
