import React from 'react'
import { DynamicComponentRenderer, ComponentSchema } from './DynamicComponentRenderer'

interface PreviewAreaProps {
  schema: ComponentSchema
  schemaJson: string
  showJson: boolean
  error: string | null
  selectedNodePath: number[]
  onSchemaJsonChange: (json: string) => void
  onToggleJson: () => void
  onApplyJson: () => void
  onNodeClick: (path: number[]) => void
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  schema,
  schemaJson,
  showJson,
  error,
  selectedNodePath,
  onSchemaJsonChange,
  onToggleJson,
  onApplyJson,
  onNodeClick,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="py-2 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="text-indigo-600">🎨</span> Live Preview
        </h2>
        <button
          onClick={onToggleJson}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            showJson
              ? 'bg-indigo-500 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {showJson ? '📋 Hide JSON' : '📝 Show JSON'}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {showJson ? (
            <div className="bg-white shadow-xl border border-slate-200 p-4 min-h-[500px]">
              <div className="mb-3 pb-2 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-700">JSON Schema Editor</h3>
                <button
                  onClick={onApplyJson}
                  className="px-3 py-1 bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors"
                >
                  Apply & Close
                </button>
              </div>
              <textarea
                value={schemaJson}
                onChange={(e) => onSchemaJsonChange(e.target.value)}
                className="w-full h-[calc(100vh-250px)] p-3 text-sm font-mono border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
                spellCheck={false}
              />
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 text-xs text-red-600">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow-xl border border-slate-200 p-4 min-h-[500px]">
              <div className="mb-3 pb-2 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span>🔴</span>
                  <span>🟡</span>
                  <span>🟢</span>
                  <span className="ml-2">Component Preview</span>
                </h3>
              </div>
              <div className="p-4 bg-slate-50 min-h-[400px]">
                <DynamicComponentRenderer
                  schema={schema}
                  onNodeClick={onNodeClick}
                  selectedPath={selectedNodePath}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
