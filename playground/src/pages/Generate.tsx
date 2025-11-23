import React, { useState } from 'react'
import { ComponentSchema } from '../components/DynamicComponentRenderer'
import { ElementsList } from '../components/ElementsList'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { PreviewArea } from '../components/PreviewArea'

const defaultSchema: ComponentSchema = {
    type: 'node',
    nodeType: 'div',
    styles: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' },
    children: [
        {
            type: 'component',
            name: 'Heading',
            styles: { color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: 'bold' },
            children: [
                {
                    type: 'node',
                    nodeType: 'h1',
                    children: [{ type: 'text', children: ['Hello from JSON2!'] }]
                }
            ]
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

const dropableSchema: ComponentSchema = {
    type: 'node',
    nodeType: 'div',
    dropadble: true,
    styles: { backgroundColor: '#cde6ff', borderRadius: '8px', fontSize: '12px', color: '#1e3a8a', textAlign: 'center' },
    children: [
        {
            type: 'text',
            children: ['(Add Here)']
        }
    ]
};

// Element definitions for modal
const modalElements = [
    { id: 'text', icon: '📝', name: 'Text Node', description: 'Plain text content', type: 'text' as const },
    { id: 'div', icon: '📦', name: 'Div', description: 'Container element', type: 'node' as const, nodeType: 'div' },
    { id: 'button', icon: '🔘', name: 'Button', description: 'Interactive button', type: 'node' as const, nodeType: 'button' },
    { id: 'img', icon: '🖼️', name: 'Image', description: 'Image element', type: 'node' as const, nodeType: 'img' },
    { id: 'heading', icon: '🔤', name: 'Heading', description: 'H1, H2, H3 elements', type: 'node' as const, nodeType: 'h2' },
    { id: 'paragraph', icon: '📄', name: 'Paragraph', description: 'Text paragraph', type: 'node' as const, nodeType: 'p' },
    { id: 'input', icon: '✏️', name: 'Input', description: 'Form input field', type: 'node' as const, nodeType: 'input' },
    { id: 'link', icon: '🔗', name: 'Link', description: 'Anchor tag', type: 'node' as const, nodeType: 'a' },
];

// Helper to create default schema for each element type
const createElementSchema = (element: typeof modalElements[0]): ComponentSchema => {
    if (element.type === 'text') {
        return { type: 'text', children: ['New text content'] }
    }

    const baseNode: ComponentSchema = {
        type: 'node',
        nodeType: element.nodeType as keyof JSX.IntrinsicElements,
        styles: {},
        children: []
    }

    switch (element.nodeType) {
        case 'button':
            baseNode.styles = { padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }
            baseNode.children = [{ type: 'text', children: ['Button'] }]
            break
        case 'img':
            baseNode.props = { src: 'https://via.placeholder.com/150', alt: 'Image' }
            baseNode.styles = { width: '150px', height: '150px' }
            break
        case 'h2':
            baseNode.styles = { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }
            baseNode.children = [{ type: 'text', children: ['Heading'] }]
            break
        case 'p':
            baseNode.styles = { fontSize: '14px', lineHeight: '1.6' }
            baseNode.children = [{ type: 'text', children: ['Paragraph text'] }]
            break
        case 'input':
            baseNode.props = { type: 'text', placeholder: 'Enter text' }
            baseNode.styles = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
            break
        case 'a':
            baseNode.props = { href: '#' }
            baseNode.styles = { color: '#3b82f6', textDecoration: 'underline' }
            baseNode.children = [{ type: 'text', children: ['Link'] }]
            break
        case 'div':
            baseNode.styles = { padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }
            baseNode.children = [{ type: 'text', children: ['Container'] }]
            break
        default:
            baseNode.children = [{ type: 'text', children: ['Element'] }]
    }

    return baseNode
}

export default function Generate() {
    const [leftCollapsed, setLeftCollapsed] = useState(false)
    const [rightCollapsed, setRightCollapsed] = useState(false)
    const [schemaJson, setSchemaJson] = useState(JSON.stringify(defaultSchema, null, 2))
    const [schema, setSchema] = useState<ComponentSchema>(defaultSchema)
    const [error, setError] = useState<string | null>(null)
    const [showJson, setShowJson] = useState(false)
    const [selectedNodePath, setSelectedNodePath] = useState<number[]>([])
    const [selectedNode, setSelectedNode] = useState<ComponentSchema | null>(null)
    const [isDroppable, setIsDroppable] = useState(false)
    const [showElementModal, setShowElementModal] = useState(false)
    const [modalTargetPath, setModalTargetPath] = useState<number[]>([])

    /** Except text node each schema children will be traversed, add a droppable schema after every child item recursively */
    const makeEditableSchema = (schema: ComponentSchema): ComponentSchema => {
        // Leave text nodes unchanged
        if (schema.type === 'text') {
            return schema;
        }

        // Get children or empty array
        const childrenSchemas: ComponentSchema[] = (schema.children ? schema.children : []) as ComponentSchema[];
        const newChildrenSchemas: ComponentSchema[] = [];

        // Add droppable schema at the beginning
        if (childrenSchemas.length && childrenSchemas[0].type !== 'text') {
            newChildrenSchemas.push(dropableSchema);
        }

        // Process each child
        for (let i = 0; i < childrenSchemas.length; i++) {
            let currentSchema = childrenSchemas[i] as ComponentSchema;

            // Recursively process non-text children
            if (currentSchema?.type !== 'text' && currentSchema?.children && currentSchema.children.length > 0) {
                currentSchema = makeEditableSchema(currentSchema);
            }

            // Add the child (original or recursively processed)
            newChildrenSchemas.push(currentSchema);

            // Add droppable schema after each child
            if(currentSchema.type !== 'text') {
                newChildrenSchemas.push(dropableSchema);
            }
        }

        return {
            ...schema,
            children: newChildrenSchemas
        };
    }

    // Load schema from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('component-schema')
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSchema(parsed)
                setSchemaJson(JSON.stringify(parsed, null, 2))
            } catch (e) {
                console.error('Failed to load saved schema:', e)
            }
        }
    }, []);

    // Toggle droppable mode
    const toggleDroppable = () => {
        if (!isDroppable) {
            // Apply droppable schemas
            const editableSchema = makeEditableSchema(schema)
            setSchema(editableSchema)
            setSchemaJson(JSON.stringify(editableSchema, null, 2))
        } else {
            // Remove droppable schemas (reload from saved or use original)
                const parsed = removeDropableSchemas(schema)
                setSchema(parsed)
                setSchemaJson(JSON.stringify(parsed, null, 2))
        }
        setIsDroppable(!isDroppable)
    }

    const removeDropableSchemas = (schema: ComponentSchema): ComponentSchema => {
        // Leave text nodes unchanged
        if (schema.type === 'text') {
            return schema;
        }
        const filteredChildren = (schema.children || []).filter((child: string | ComponentSchema) => {
            // Keep string children as they are
            if (typeof child === 'string') return true;
            // Filter out droppable ComponentSchema nodes
            return !(child as any).dropadble;
        });
        return {
            ...schema,
            children: filteredChildren.map((child: string | ComponentSchema) => {
                if (typeof child === 'string') {
                    return child;
                }
                return removeDropableSchemas(child);
            })
        }; 
    }

    console.log('Current Schema:', schema);

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

    // Helper to check if node or any parent is droppable
    const isNodeOrParentDroppable = (path: number[]): boolean => {
        for (let i = 0; i <= path.length; i++) {
            const currentPath = path.slice(0, i)
            const node = getNodeByPath(schema, currentPath)
            if (node && (node as any).dropadble) {
                return true
            }
        }
        return false
    }

    // Handle node selection
    const handleNodeSelect = (path: number[]) => {
        const node = getNodeByPath(schema, path)
        
        // If droppable mode is active and clicking on a droppable node, show modal
        if (isDroppable && node && (node as any).dropadble) {
            setModalTargetPath(path)
            setShowElementModal(true)
            return
        }
        
        // Don't select droppable schemas or their children
        if (node && isNodeOrParentDroppable(path)) {
            return
        }
        setSelectedNodePath(path)
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

    // Handle element selection from modal
    const handleElementSelect = (elementSchema: ComponentSchema) => {
        const newSchema = JSON.parse(JSON.stringify(schema)) as ComponentSchema
        
        // Navigate to the parent of the droppable node
        let parent: any = newSchema
        for (let i = 0; i < modalTargetPath.length - 1; i++) {
            parent = parent.children[modalTargetPath[i]]
        }
        
        // Replace the entire droppable node with the new element
        const targetIndex = modalTargetPath[modalTargetPath.length - 1]
        parent.children[targetIndex] = elementSchema
        
        setSchema(newSchema)
        setSchemaJson(JSON.stringify(newSchema, null, 2))
        setShowElementModal(false)
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
                        <div className="flex-1 overflow-y-auto">
                            <ElementsList />
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
            <PreviewArea
                schema={schema}
                schemaJson={schemaJson}
                showJson={showJson}
                error={error}
                selectedNodePath={selectedNodePath}
                isDroppable={isDroppable}
                onSchemaJsonChange={setSchemaJson}
                onToggleJson={() => setShowJson(!showJson)}
                onApplyJson={() => {
                    try {
                        const parsed = JSON.parse(schemaJson);
                        setSchema(parsed);
                        setError(null);
                        setShowJson(false);
                    } catch (e: any) {
                        setError(e.message);
                    }
                }}
                onNodeClick={handleNodeSelect}
                onToggleDroppable={toggleDroppable}
            />

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
                        <div className="flex-1 py-2 overflow-y-auto">
                            <PropertiesPanel
                                selectedNode={selectedNode}
                                onNodeUpdate={handleNodeUpdate}
                                onSave={handleSave}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Element Selection Modal */}
            {showElementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowElementModal(false)}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-blue-600">🎨</span> Select Element to Add
                            </h2>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                {modalElements.map((element) => (
                                    <button
                                        key={element.id}
                                        onClick={() => handleElementSelect(createElementSchema(element))}
                                        className="p-4 border-2 border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-all flex items-start gap-3 text-left group"
                                    >
                                        <span className="text-3xl group-hover:scale-110 transition-transform">{element.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800">{element.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{element.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setShowElementModal(false)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
