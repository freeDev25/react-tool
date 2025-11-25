import React, { Suspense, useMemo } from 'react'
import ErrorBoundary from './ErrorBoundary'

type ComponentPreviewProps = {
  componentName: string
}

// Component map for dynamic imports
const componentMap: Record<string, () => Promise<any>> = {
  StatCard: () => import('@output/StatCard/StatCard'),
  NavItem: () => import('@output/NavItem/NavItem'),
  DashboardSidebar: () => import('@output/DashboardSidebar/DashboardSidebar'),
  DashboardHeader: () => import('@output/DashboardHeader/DashboardHeader'),
  GridWrapper: () => import('@output/GridWrapper/GridWrapper'),
  ComplexDashboard: () => import('@output/ComplexDashboard/ComplexDashboard'),
  Counter: () => import('@output/Counter/Counter'),
  ToggleMessage: () => import('@output/ToggleMessage/ToggleMessage'),
  InputForm: () => import('@output/InputForm/InputForm'),
  TitleUpdater: () => import('@output/TitleUpdater/TitleUpdater'),
  Timer: () => import('@output/Timer/Timer'),
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
