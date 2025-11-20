import React, { Suspense, useMemo } from 'react'
import ErrorBoundary from './ErrorBoundary'

type ComponentPreviewProps = {
  componentName: string
}

// Component map for dynamic imports
const componentMap: Record<string, () => Promise<any>> = {
  ExampleComponent: () => import('@output/ExampleComponent/ExampleComponent'),
  ComponentOne: () => import('@output/ComponentOne/ComponentOne'),
}

export default function ComponentPreview({ componentName }: ComponentPreviewProps) {
  // Dynamically import the component based on name
  const Component = useMemo(() => {
    const loader = componentMap[componentName]
    if (!loader) {
      return React.lazy(() => Promise.reject(new Error(`Component ${componentName} not found in map`)))
    }
    return React.lazy(loader)
  }, [componentName])

  return (
    <ErrorBoundary key={componentName}>
      <Suspense fallback={<div>Loading {componentName}…</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}
