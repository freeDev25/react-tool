import React from 'react'
// Import the generated component from one level up
// Vite is configured to allow fs access to parent dir in vite.config.ts
import GeneratedPreview from './GeneratedPreview'

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>React Tool Playground</h1>
      <p>Below is the generated component rendered live:</p>
      <div style={{ border: '1px solid #ddd', padding: 12 }}>
        <GeneratedPreview />
      </div>
    </div>
  )
}
