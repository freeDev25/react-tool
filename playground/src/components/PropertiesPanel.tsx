import React from 'react'
import { ComponentSchema } from './DynamicComponentRenderer'

interface PropertiesPanelProps {
  selectedNode: ComponentSchema | null
  onNodeUpdate: (node: ComponentSchema) => void
  onSave: () => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onNodeUpdate,
  onSave,
}) => {
  const getTextContent = (node: ComponentSchema): string => {
    if (node.type === 'text' && Array.isArray(node.children)) {
      return node.children.join('')
    }
    return ''
  }

  const updateTextContent = (node: ComponentSchema, newText: string): ComponentSchema => {
    if (node.type === 'text') {
      return { ...node, children: [newText] }
    }
    return node
  }

  if (!selectedNode) {
    return (
      <div className="py-2 bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100">
        <p className="text-xs text-slate-600 text-center py-8">
          👆 Click on any element in the preview to edit its properties
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors shadow-sm"
        >
          💾 Save Changes
        </button>
      </div>

      {/* Basic Properties */}
      <div className="py-2 bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100">
        <p className="text-xs font-semibold text-slate-700 mb-2">Basic Properties</p>

        {selectedNode.type === 'node' && (
          <div className="bg-white p-1.5 border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Tag Name</label>
            <select
              value={selectedNode.nodeType || 'div'}
              onChange={(e) => onNodeUpdate({ ...selectedNode, nodeType: e.target.value as any })}
              className="w-full text-xs px-1.5 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        )}

        {selectedNode.type === 'text' && (
          <div className="bg-white p-1.5 border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Text Content</label>
            <textarea
              value={getTextContent(selectedNode)}
              onChange={(e) => onNodeUpdate(updateTextContent(selectedNode, e.target.value))}
              rows={4}
              className="w-full text-xs px-1.5 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Style Properties - Only for node elements */}
      {selectedNode.type === 'node' && (
        <>
          {/* Layout Section */}
          <div className="border-b border-slate-200">
            <button className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span>Layout</span>
            </button>
            <div className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Width</label>
                  <input
                    type="text"
                    value={(selectedNode.styles?.width as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, width: e.target.value },
                      })
                    }
                    placeholder="auto"
                    className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Height</label>
                  <input
                    type="text"
                    value={(selectedNode.styles?.height as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, height: e.target.value },
                      })
                    }
                    placeholder="auto"
                    className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Display</label>
                <select
                  value={(selectedNode.styles?.display as string) || ''}
                  onChange={(e) =>
                    onNodeUpdate({
                      ...selectedNode,
                      styles: { ...selectedNode.styles, display: e.target.value || undefined },
                    })
                  }
                  className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">Default</option>
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="inline-flex">Inline Flex</option>
                  <option value="grid">Grid</option>
                  <option value="inline">Inline</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fill Section */}
          <div className="border-b border-slate-200">
            <button className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span>Fill</span>
            </button>
            <div className="px-3 pb-3 space-y-2">
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Background</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={
                      ((selectedNode.styles?.backgroundColor as string) || '')?.startsWith('#')
                        ? (selectedNode.styles?.backgroundColor as string)
                        : '#ffffff'
                    }
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, backgroundColor: e.target.value },
                      })
                    }
                    className="w-8 h-7 border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(selectedNode.styles?.backgroundColor as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, backgroundColor: e.target.value },
                      })
                    }
                    placeholder="transparent"
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stroke Section */}
          <div className="border-b border-slate-200">
            <button className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span>Stroke</span>
            </button>
            <div className="px-3 pb-3 space-y-2">
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Border</label>
                <input
                  type="text"
                  value={(selectedNode.styles?.border as string) || ''}
                  onChange={(e) =>
                    onNodeUpdate({
                      ...selectedNode,
                      styles: { ...selectedNode.styles, border: e.target.value },
                    })
                  }
                  placeholder="1px solid #000"
                  className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Border Radius</label>
                <input
                  type="text"
                  value={(selectedNode.styles?.borderRadius as string) || ''}
                  onChange={(e) =>
                    onNodeUpdate({
                      ...selectedNode,
                      styles: { ...selectedNode.styles, borderRadius: e.target.value },
                    })
                  }
                  placeholder="0"
                  className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="border-b border-slate-200">
            <button className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span>Text</span>
            </button>
            <div className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Size</label>
                  <input
                    type="text"
                    value={(selectedNode.styles?.fontSize as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, fontSize: e.target.value },
                      })
                    }
                    placeholder="16px"
                    className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Weight</label>
                  <select
                    value={(selectedNode.styles?.fontWeight as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, fontWeight: e.target.value || undefined },
                      })
                    }
                    className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Default</option>
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Color</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={
                      ((selectedNode.styles?.color as string) || '')?.startsWith('#')
                        ? (selectedNode.styles?.color as string)
                        : '#000000'
                    }
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, color: e.target.value },
                      })
                    }
                    className="w-8 h-7 border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(selectedNode.styles?.color as string) || ''}
                    onChange={(e) =>
                      onNodeUpdate({
                        ...selectedNode,
                        styles: { ...selectedNode.styles, color: e.target.value },
                      })
                    }
                    placeholder="inherit"
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div className="border-b border-slate-200">
            <button className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <span>Spacing</span>
            </button>
            <div className="px-3 pb-3 space-y-2">
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Padding</label>
                <input
                  type="text"
                  value={(selectedNode.styles?.padding as string) || ''}
                  onChange={(e) =>
                    onNodeUpdate({
                      ...selectedNode,
                      styles: { ...selectedNode.styles, padding: e.target.value },
                    })
                  }
                  placeholder="0"
                  className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-0.5 block">Margin</label>
                <input
                  type="text"
                  value={(selectedNode.styles?.margin as string) || ''}
                  onChange={(e) =>
                    onNodeUpdate({
                      ...selectedNode,
                      styles: { ...selectedNode.styles, margin: e.target.value },
                    })
                  }
                  placeholder="0"
                  className="w-full text-xs px-2 py-1 border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
