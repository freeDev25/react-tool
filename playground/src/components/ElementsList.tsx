import React from 'react'

interface Element {
  id: string
  icon: string
  name: string
  description: string
  type: 'text' | 'node'
  nodeType?: string
}

const elements: Element[] = [
  { id: 'text', icon: '📝', name: 'Text Node', description: 'Plain text content', type: 'text' },
  { id: 'div', icon: '📦', name: 'Div', description: 'Container element', type: 'node', nodeType: 'div' },
  { id: 'button', icon: '🔘', name: 'Button', description: 'Interactive button', type: 'node', nodeType: 'button' },
  { id: 'img', icon: '🖼️', name: 'Image', description: 'Image element', type: 'node', nodeType: 'img' },
  { id: 'heading', icon: '🔤', name: 'Heading', description: 'H1, H2, H3 elements', type: 'node', nodeType: 'h2' },
  { id: 'paragraph', icon: '📄', name: 'Paragraph', description: 'Text paragraph', type: 'node', nodeType: 'p' },
  { id: 'input', icon: '✏️', name: 'Input', description: 'Form input field', type: 'node', nodeType: 'input' },
  { id: 'link', icon: '🔗', name: 'Link', description: 'Anchor tag', type: 'node', nodeType: 'a' },
]

export const ElementsList: React.FC = () => {
  return (
    <div>
      <div className="py-2 px-3 bg-slate-100 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-700">Elements</p>
      </div>
      <div className="p-2 space-y-1">
        {elements.map((element) => (
          <button
            key={element.id}
            draggable
            className="w-full p-2 border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-2 text-left"
          >
            <span className="text-lg">{element.icon}</span>
            <div>
              <div className="text-xs font-medium text-slate-700">{element.name}</div>
              <div className="text-[10px] text-slate-500">{element.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
