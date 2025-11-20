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
  const [showJson, setShowJson] = useState(false)
  const [selectedNodePath, setSelectedNodePath] = useState<number[]>([])
  const [selectedNode, setSelectedNode] = useState<ComponentSchema | null>(null)

  // Load schema from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('component-schema')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSchema(parsed)
        setSchemaJson(JSON.stringify(parsed, null, 2))
      } catch (e) {
        console.error('Failed to load saved schema:', e)
      }
    }
  }, [])

  // Helper to get node by path
  const getNodeByPath = (schema: ComponentSchema, path: number[]): ComponentSchema | null => {
    let current: any = schema
    for (const index of path) {
      if (!current.children || !current.children[index]) return null
      current = current.children[index]
    }
    return current
  }

  // Helper to update node by path
  const updateNodeByPath = (schema: ComponentSchema, path: number[], updatedNode: ComponentSchema): ComponentSchema => {
    const newSchema = JSON.parse(JSON.stringify(schema)) // Deep clone
    if (path.length === 0) return updatedNode

    let current: any = newSchema
    for (let i = 0; i < path.length - 1; i++) {
      current = current.children[path[i]]
    }
    current.children[path[path.length - 1]] = updatedNode
    return newSchema
  }

  // Helper to get text content from a node
  const getTextContent = (node: ComponentSchema): string => {
    if (node.type === 'text' && Array.isArray(node.children)) {
      return node.children.join('')
    }
    return ''
  }

  // Helper to update text content
  const updateTextContent = (node: ComponentSchema, newText: string): ComponentSchema => {
    if (node.type === 'text') {
      return { ...node, children: [newText] }
    }
    return node
  }

  // Handle node selection
  const handleNodeSelect = (path: number[]) => {
    setSelectedNodePath(path)
    const node = getNodeByPath(schema, path)
    setSelectedNode(node)
  }

  // Handle node update from properties panel
  const handleNodeUpdate = (updatedNode: ComponentSchema) => {
    const newSchema = updateNodeByPath(schema, selectedNodePath, updatedNode)
    setSchema(newSchema)
    setSchemaJson(JSON.stringify(newSchema, null, 2))
    setSelectedNode(updatedNode)
  }

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem('component-schema', JSON.stringify(schema))
    alert('Schema saved successfully!')
  }

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
                <span className="text-blue-600">🔧</span> Tools
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
              <div className="space-y-3">
                <div className="p-2 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-slate-600 mb-2">Component Builder Tools</p>
                  <div className="text-center text-slate-400 text-xs py-4">
                    Tools coming soon...
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
          className="w-8 border-r border-slate-200 bg-linear-to-b from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-sm"
          title="Expand Schema Editor"
        >
          <span className="writing-mode-vertical text-xs font-medium">▶</span>
        </button>
      )}

      {/* Middle Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="px-3 py-2 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">🎨</span> Live Preview
          </h2>
          <button
            onClick={() => setShowJson(!showJson)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
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
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 min-h-[500px]">
                <div className="mb-3 pb-2 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-700">JSON Schema Editor</h3>
                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(schemaJson);
                        setSchema(parsed);
                        setError(null);
                        setShowJson(false);
                      } catch (e: any) {
                        setError(e.message);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    Apply & Close
                  </button>
                </div>
                <textarea
                  value={schemaJson}
                  onChange={(e) => setSchemaJson(e.target.value)}
                  className="w-full h-[calc(100vh-250px)] p-3 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
                  spellCheck={false}
                />
                {error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 min-h-[500px]">
                <div className="mb-3 pb-2 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span>🔴</span>
                    <span>🟡</span>
                    <span>🟢</span>
                    <span className="ml-2">Component Preview</span>
                  </h3>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg min-h-[400px]">
                  <DynamicComponentRenderer 
                    schema={schema} 
                    onNodeClick={handleNodeSelect}
                    selectedPath={selectedNodePath}
                  />
                </div>
              </div>
            )}
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
              {selectedNode ? (
                <div className="space-y-3">
                  <div className="p-2 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-slate-700">Element Properties</p>
                      <button
                        onClick={handleSave}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        💾 Save
                      </button>
                    </div>
                    
                    {selectedNode.type === 'node' && (
                      <>
                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Tag Name</label>
                          <select 
                            value={selectedNode.nodeType || 'div'}
                            onChange={(e) => handleNodeUpdate({ ...selectedNode, nodeType: e.target.value as any })}
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="div">div</option>
                            <option value="span">span</option>
                            <option value="p">p</option>
                            <option value="h1">h1</option>
                            <option value="h2">h2</option>
                            <option value="h3">h3</option>
                            <option value="button">button</option>
                            <option value="a">a</option>
                            <option value="img">img</option>
                            <option value="input">input</option>
                          </select>
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Background Color</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.backgroundColor as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, backgroundColor: e.target.value }
                            })}
                            placeholder="#ffffff"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Text Color</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.color as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, color: e.target.value }
                            })}
                            placeholder="#000000"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Padding</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.padding as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, padding: e.target.value }
                            })}
                            placeholder="10px"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Margin</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.margin as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, margin: e.target.value }
                            })}
                            placeholder="10px"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Border Radius</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.borderRadius as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, borderRadius: e.target.value }
                            })}
                            placeholder="4px"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Font Size</label>
                          <input 
                            type="text"
                            value={(selectedNode.styles?.fontSize as string) || ''}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, fontSize: e.target.value }
                            })}
                            placeholder="16px"
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                          <label className="text-xs font-semibold text-slate-700 mb-1 block">Font Weight</label>
                          <select 
                            value={(selectedNode.styles?.fontWeight as string) || 'normal'}
                            onChange={(e) => handleNodeUpdate({
                              ...selectedNode,
                              styles: { ...selectedNode.styles, fontWeight: e.target.value }
                            })}
                            className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="500">500</option>
                            <option value="600">600</option>
                            <option value="700">700</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedNode.type === 'text' && (
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200 mb-2">
                        <label className="text-xs font-semibold text-slate-700 mb-1 block">Text Content</label>
                        <textarea 
                          value={getTextContent(selectedNode)}
                          onChange={(e) => handleNodeUpdate(updateTextContent(selectedNode, e.target.value))}
                          rows={4}
                          className="w-full text-xs px-1.5 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <p className="text-xs text-slate-600 text-center py-8">
                    👆 Click on any element in the preview to edit its properties
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
