import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: any }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error('Render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, color: '#b00020', background: '#fde7e9', border: '1px solid #f5c2c7' }}>
          <strong>Failed to render generated component.</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
