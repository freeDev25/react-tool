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

const dropableSchema: ComponentSchema = {
    type: 'node',
    nodeType: 'div',
    dropadble: true,
    styles: { padding: '10px 0', backgroundColor: '#cde6ff', borderRadius: '8px' },
    children: []
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
    const [isDroppable, setIsDroppable] = useState(false)

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
            const saved = localStorage.getItem('component-schema')
            if (saved) {
                const parsed = JSON.parse(saved)
                setSchema(parsed)
                setSchemaJson(JSON.stringify(parsed, null, 2))
            }
        }
        setIsDroppable(!isDroppable)
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

    // Handle node selection
    const handleNodeSelect = (path: number[]) => {
        const node = getNodeByPath(schema, path)
        // Don't select droppable schemas
        if (node && (node as any).dropadble) {
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
        </div>
    )
}
