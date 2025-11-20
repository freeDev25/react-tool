import React, { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'

// Lazy-load the generated component to surface import errors clearly
const Generated = React.lazy(() => import('@output/ExampleComponent/ExampleComponent'))

export default function GeneratedPreview() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading generated component…</div>}>
        <Generated />
      </Suspense>
    </ErrorBoundary>
  )
}
