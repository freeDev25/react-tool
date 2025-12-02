import React, { useState } from 'react'

interface ComponentConfig {
  name: string
  props: Record<string, { type: string; default?: any; required?: boolean }>
  states: Record<string, { type: string; default?: any }>
  variables: Record<string, { type: string; value: any; computed?: boolean; memoized?: boolean; dependencies?: string[] }>
  effects: Record<string, { body: string; dependencies?: string[]; cleanup?: string; async?: boolean; condition?: string }>
  nodeType: string
  children: string
}

const defaultConfig: ComponentConfig = {
  name: 'MyComponent',
  props: {},
  states: {},
  variables: {},
  effects: {},
  nodeType: 'div',
  children: 'Hello World'
}

export default function Builder() {
  const [config, setConfig] = useState<ComponentConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState<'props' | 'states' | 'variables' | 'effects' | 'structure'>('props')
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [showCode, setShowCode] = useState(false)

  // Prop management
  const [newPropName, setNewPropName] = useState('')
  const [newPropType, setNewPropType] = useState('string')
  const [newPropDefault, setNewPropDefault] = useState('')
  const [newPropRequired, setNewPropRequired] = useState(false)

  // State management
  const [newStateName, setNewStateName] = useState('')
  const [newStateType, setNewStateType] = useState('string')
  const [newStateDefault, setNewStateDefault] = useState('')

  // Variable management
  const [newVarName, setNewVarName] = useState('')
  const [newVarType, setNewVarType] = useState('string')
  const [newVarValue, setNewVarValue] = useState('')
  const [newVarComputed, setNewVarComputed] = useState(false)
  const [newVarMemoized, setNewVarMemoized] = useState(false)
  const [newVarDeps, setNewVarDeps] = useState('')

  // Effect management
  const [newEffectName, setNewEffectName] = useState('')
  const [newEffectBody, setNewEffectBody] = useState('')
  const [newEffectDeps, setNewEffectDeps] = useState('')
  const [newEffectCleanup, setNewEffectCleanup] = useState('')
  const [newEffectAsync, setNewEffectAsync] = useState(false)
  const [newEffectCondition, setNewEffectCondition] = useState('')

  const addProp = () => {
    if (newPropName) {
      setConfig({
        ...config,
        props: {
          ...config.props,
          [newPropName]: {
            type: newPropType,
            default: newPropDefault || undefined,
            required: newPropRequired
          }
        }
      })
      setNewPropName('')
      setNewPropDefault('')
      setNewPropRequired(false)
    }
  }

  const addState = () => {
    if (newStateName) {
      setConfig({
        ...config,
        states: {
          ...config.states,
          [newStateName]: {
            type: newStateType,
            default: newStateDefault || null
          }
        }
      })
      setNewStateName('')
      setNewStateDefault('')
    }
  }

  const addVariable = () => {
    if (newVarName) {
      setConfig({
        ...config,
        variables: {
          ...config.variables,
          [newVarName]: {
            type: newVarType,
            value: newVarValue,
            computed: newVarComputed,
            memoized: newVarMemoized,
            dependencies: newVarDeps ? newVarDeps.split(',').map(d => d.trim()) : undefined
          }
        }
      })
      setNewVarName('')
      setNewVarValue('')
      setNewVarComputed(false)
      setNewVarMemoized(false)
      setNewVarDeps('')
    }
  }

  const addEffect = () => {
    if (newEffectName && newEffectBody) {
      setConfig({
        ...config,
        effects: {
          ...config.effects,
          [newEffectName]: {
            body: newEffectBody,
            dependencies: newEffectDeps ? newEffectDeps.split(',').map(d => d.trim()) : undefined,
            cleanup: newEffectCleanup || undefined,
            async: newEffectAsync,
            condition: newEffectCondition || undefined
          }
        }
      })
      setNewEffectName('')
      setNewEffectBody('')
      setNewEffectDeps('')
      setNewEffectCleanup('')
      setNewEffectAsync(false)
      setNewEffectCondition('')
    }
  }

  const generateComponent = () => {
    // Build the schema code
    let schemaCode = `import Schema from "../schema/Schema";\n\n`
    schemaCode += `const ${config.name} = new Schema('${config.name}', `
    
    // Props
    schemaCode += `{\n`
    Object.entries(config.props).forEach(([name, prop]) => {
      schemaCode += `    ${name}: { type: '${prop.type}'`
      if (prop.default !== undefined) schemaCode += `, default: ${JSON.stringify(prop.default)}`
      if (prop.required) schemaCode += `, required: true`
      schemaCode += ` },\n`
    })
    schemaCode += `}, \n`
    
    // Structure
    schemaCode += `    Schema.node('${config.nodeType}', {\n`
    schemaCode += `        children: Schema.text('${config.children}')\n`
    schemaCode += `    })\n`
    schemaCode += `);\n\n`
    
    // States
    Object.entries(config.states).forEach(([name, state]) => {
      schemaCode += `${config.name}.addState('${name}', '${state.type}', ${JSON.stringify(state.default)});\n`
    })
    if (Object.keys(config.states).length > 0) schemaCode += '\n'
    
    // Variables
    Object.entries(config.variables).forEach(([name, variable]) => {
      const options: string[] = []
      if (variable.computed) options.push('computed: true')
      if (variable.memoized) options.push('memoized: true')
      if (variable.dependencies) options.push(`dependencies: [${variable.dependencies.map(d => `'${d}'`).join(', ')}]`)
      
      schemaCode += `${config.name}.addVariable('${name}', '${variable.type}', ${JSON.stringify(variable.value)}`
      if (options.length > 0) {
        schemaCode += `, { ${options.join(', ')} }`
      }
      schemaCode += `);\n`
    })
    if (Object.keys(config.variables).length > 0) schemaCode += '\n'
    
    // Effects
    Object.entries(config.effects).forEach(([name, effect]) => {
      schemaCode += `${config.name}.addEffect('${name}', \`\n${effect.body}\n\`, {\n`
      if (effect.async) schemaCode += `    async: true,\n`
      if (effect.dependencies) schemaCode += `    dependencies: [${effect.dependencies.map(d => `'${d}'`).join(', ')}],\n`
      if (effect.cleanup) schemaCode += `    cleanup: \`\n${effect.cleanup}\n\`,\n`
      if (effect.condition) schemaCode += `    condition: '${effect.condition}',\n`
      schemaCode += `});\n\n`
    })
    
    schemaCode += `export default ${config.name};\n`
    
    setGeneratedCode(schemaCode)
    setShowCode(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
    alert('Code copied to clipboard!')
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.name}.ts`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full bg-linear-to-br from-slate-50 to-blue-50">
      {/* Left Panel - Configuration */}
      <div className="w-2/3 flex flex-col border-r border-slate-200 bg-white">
        {/* Header */}
        <div className="py-3 border-b border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-blue-600">🏗️</span> Component Builder
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="px-3 py-1 border border-slate-300 text-sm font-semibold"
                placeholder="Component Name"
              />
              <button
                onClick={generateComponent}
                className="px-4 py-1 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Generate Schema
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {(['props', 'states', 'variables', 'effects', 'structure'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'props' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3">
                <h3 className="font-semibold text-blue-900 mb-3">Add New Prop</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="Prop name"
                    className="px-3 py-2 border border-slate-300 text-sm"
                  />
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value)}
                    className="px-3 py-2 border border-slate-300 text-sm"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="any">any</option>
                  </select>
                  <input
                    type="text"
                    value={newPropDefault}
                    onChange={(e) => setNewPropDefault(e.target.value)}
                    placeholder="Default value"
                    className="px-3 py-2 border border-slate-300 text-sm"
                  />
                  <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-sm">
                    <input
                      type="checkbox"
                      checked={newPropRequired}
                      onChange={(e) => setNewPropRequired(e.target.checked)}
                    />
                    Required
                  </label>
                </div>
                <button
                  onClick={addProp}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 w-full"
                >
                  Add Prop
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Current Props</h3>
                {Object.entries(config.props).map(([name, prop]) => (
                  <div key={name} className="p-3 bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-800">{name}</span>
                      <span className="text-slate-500 text-sm ml-2">: {prop.type}</span>
                      {prop.default && <span className="text-slate-500 text-sm ml-2">= {JSON.stringify(prop.default)}</span>}
                      {prop.required && <span className="text-red-600 text-sm ml-2">*</span>}
                    </div>
                    <button
                      onClick={() => {
                        const newProps = { ...config.props }
                        delete newProps[name]
                        setConfig({ ...config, props: newProps })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {Object.keys(config.props).length === 0 && (
                  <p className="text-slate-500 text-sm italic">No props defined yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'states' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-3">
                <h3 className="font-semibold text-purple-900 mb-3">Add New State</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="State name"
                    className="px-3 py-2 border border-slate-300 text-sm"
                  />
                  <select
                    value={newStateType}
                    onChange={(e) => setNewStateType(e.target.value)}
                    className="px-3 py-2 border border-slate-300 text-sm"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="any">any</option>
                    <option value="string | null">string | null</option>
                    <option value="number | null">number | null</option>
                  </select>
                  <input
                    type="text"
                    value={newStateDefault}
                    onChange={(e) => setNewStateDefault(e.target.value)}
                    placeholder="Initial value"
                    className="px-3 py-2 border border-slate-300 text-sm col-span-2"
                  />
                </div>
                <button
                  onClick={addState}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 w-full"
                >
                  Add State
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Current States</h3>
                {Object.entries(config.states).map(([name, state]) => (
                  <div key={name} className="p-3 bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-800">{name}</span>
                      <span className="text-slate-500 text-sm ml-2">: {state.type}</span>
                      <span className="text-slate-500 text-sm ml-2">= {JSON.stringify(state.default)}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newStates = { ...config.states }
                        delete newStates[name]
                        setConfig({ ...config, states: newStates })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {Object.keys(config.states).length === 0 && (
                  <p className="text-slate-500 text-sm italic">No states defined yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-3">
                <h3 className="font-semibold text-green-900 mb-3">Add New Variable</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newVarName}
                      onChange={(e) => setNewVarName(e.target.value)}
                      placeholder="Variable name"
                      className="px-3 py-2 border border-slate-300 text-sm"
                    />
                    <select
                      value={newVarType}
                      onChange={(e) => setNewVarType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 text-sm"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="any">any</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(e.target.value)}
                    placeholder="Value or expression"
                    className="px-3 py-2 border border-slate-300 text-sm w-full"
                  />
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newVarComputed}
                        onChange={(e) => setNewVarComputed(e.target.checked)}
                      />
                      Computed
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newVarMemoized}
                        onChange={(e) => setNewVarMemoized(e.target.checked)}
                      />
                      Memoized
                    </label>
                  </div>
                  {(newVarComputed || newVarMemoized) && (
                    <input
                      type="text"
                      value={newVarDeps}
                      onChange={(e) => setNewVarDeps(e.target.value)}
                      placeholder="Dependencies (comma-separated)"
                      className="px-3 py-2 border border-slate-300 text-sm w-full"
                    />
                  )}
                </div>
                <button
                  onClick={addVariable}
                  className="mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 w-full"
                >
                  Add Variable
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Current Variables</h3>
                {Object.entries(config.variables).map(([name, variable]) => (
                  <div key={name} className="p-3 bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-slate-800">{name}</span>
                        <span className="text-slate-500 text-sm ml-2">: {variable.type}</span>
                        <div className="text-slate-600 text-sm mt-1">{variable.value}</div>
                        {(variable.computed || variable.memoized) && (
                          <div className="flex gap-2 mt-2">
                            {variable.computed && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs">Computed</span>}
                            {variable.memoized && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs">Memoized</span>}
                            {variable.dependencies && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs">
                                Deps: {variable.dependencies.join(', ')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const newVars = { ...config.variables }
                          delete newVars[name]
                          setConfig({ ...config, variables: newVars })
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {Object.keys(config.variables).length === 0 && (
                  <p className="text-slate-500 text-sm italic">No variables defined yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 p-3">
                <h3 className="font-semibold text-orange-900 mb-3">Add New Effect</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newEffectName}
                    onChange={(e) => setNewEffectName(e.target.value)}
                    placeholder="Effect name"
                    className="px-3 py-2 border border-slate-300 text-sm w-full"
                  />
                  <textarea
                    value={newEffectBody}
                    onChange={(e) => setNewEffectBody(e.target.value)}
                    placeholder="Effect body (JavaScript code)"
                    className="px-3 py-2 border border-slate-300 text-sm w-full h-24 font-mono"
                  />
                  <input
                    type="text"
                    value={newEffectDeps}
                    onChange={(e) => setNewEffectDeps(e.target.value)}
                    placeholder="Dependencies (comma-separated)"
                    className="px-3 py-2 border border-slate-300 text-sm w-full"
                  />
                  <textarea
                    value={newEffectCleanup}
                    onChange={(e) => setNewEffectCleanup(e.target.value)}
                    placeholder="Cleanup code (optional)"
                    className="px-3 py-2 border border-slate-300 text-sm w-full h-20 font-mono"
                  />
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newEffectAsync}
                        onChange={(e) => setNewEffectAsync(e.target.checked)}
                      />
                      Async
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newEffectCondition}
                    onChange={(e) => setNewEffectCondition(e.target.value)}
                    placeholder="Condition (optional, e.g., 'isEnabled')"
                    className="px-3 py-2 border border-slate-300 text-sm w-full"
                  />
                </div>
                <button
                  onClick={addEffect}
                  className="mt-3 px-4 py-2 bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 w-full"
                >
                  Add Effect
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Current Effects</h3>
                {Object.entries(config.effects).map(([name, effect]) => (
                  <div key={name} className="p-3 bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-800">{name}</span>
                      <button
                        onClick={() => {
                          const newEffects = { ...config.effects }
                          delete newEffects[name]
                          setConfig({ ...config, effects: newEffects })
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <pre className="text-xs bg-slate-100 p-2 overflow-x-auto">{effect.body}</pre>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {effect.async && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs">Async</span>}
                      {effect.dependencies && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs">
                          Deps: {effect.dependencies.join(', ')}
                        </span>
                      )}
                      {effect.cleanup && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs">Has Cleanup</span>}
                      {effect.condition && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs">
                          If: {effect.condition}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {Object.keys(config.effects).length === 0 && (
                  <p className="text-slate-500 text-sm italic">No effects defined yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 p-3">
                <h3 className="font-semibold text-indigo-900 mb-3">Component Structure</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Root Node Type</label>
                    <select
                      value={config.nodeType}
                      onChange={(e) => setConfig({ ...config, nodeType: e.target.value })}
                      className="px-3 py-2 border border-slate-300 text-sm w-full"
                    >
                      <option value="div">div</option>
                      <option value="section">section</option>
                      <option value="article">article</option>
                      <option value="main">main</option>
                      <option value="header">header</option>
                      <option value="footer">footer</option>
                      <option value="nav">nav</option>
                      <option value="aside">aside</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <textarea
                      value={config.children}
                      onChange={(e) => setConfig({ ...config, children: e.target.value })}
                      className="px-3 py-2 border border-slate-300 text-sm w-full h-24"
                      placeholder="Text content or JSX expression"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Tip: Use {'{propName}'} for dynamic content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Generated Code */}
      <div className="w-1/3 flex flex-col bg-slate-900">
        <div className="py-3 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> Generated Schema
            </h2>
            {showCode && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadCode}
                  className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {showCode ? (
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{generatedCode}</pre>
          ) : (
            <div className="text-slate-400 text-center mt-20">
              <p className="text-lg mb-2">👈 Configure your component</p>
              <p className="text-sm">Then click "Generate Schema" to see the code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
