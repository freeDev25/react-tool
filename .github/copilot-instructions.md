# React Tool - AI Coding Agent Instructions

## Project Overview
Dual-purpose React tooling project with two distinct parts:
1. **CLI Generator** (`/src`, `/output`) - TypeScript tool that converts JSON schemas to React components
2. **Playground App** (`/playground`) - Interactive Vite+React app for visual component design with runtime JSON-to-React conversion

## Architecture Principles

### Playground: ComponentSchema System
The core data structure driving the playground is `ComponentSchema` (see `playground/src/components/DynamicComponentRenderer.tsx`):

```typescript
interface ComponentSchema {
  type: 'node' | 'component' | 'text';
  nodeType?: keyof JSX.IntrinsicElements;  // 'div', 'button', etc.
  props?: Record<string, any>;
  styles?: CSSProperties;                   // Inline styles object
  children?: ComponentSchema[] | string[];  // Recursive tree structure
}
```

**Critical Pattern**: Runtime CSS injection via `<style>` tags in document head (not Tailwind classes). The `DynamicComponentRenderer` component:
- Converts `ComponentSchema` JSON → live React elements at runtime
- Generates unique class names (`dynamic-${counter}`) for each styled node
- Injects CSS rules into `<style id="dynamic-component-styles">` element
- Uses path-based selection with blue ring highlights (2px solid #3b82f6)

### Modular Component Architecture
Recent refactor (Nov 2024) split large monolithic files into focused components:
- **Generate.tsx** (238 lines) - State orchestrator with helper functions: `getNodeByPath()`, `updateNodeByPath()`, `handleNodeSelect()`
- **ElementsList.tsx** - Left sidebar with 8 draggable base elements (Text, Div, Button, Image, etc.)
- **PropertiesPanel.tsx** - Figma-style property editor with collapsible sections: Layout, Fill, Stroke, Text, Spacing
- **PreviewArea.tsx** - Toggle between component preview and JSON editor

**State Management Pattern**: Parent component (Generate.tsx) manages `schema`, `selectedNode`, `selectedNodePath` state and passes callbacks down. localStorage persistence at `'component-schema'` key.

## Development Workflows

### Playground Development
```bash
# From project root
npm run play:dev        # Vite dev server on http://localhost:5173
npm run play:build      # Production build
npm run play:preview    # Preview production build
```

### CLI Generator Usage
```bash
npm run build           # Compile TypeScript to /dist
npm run demo            # Generate example forms to /output
npm run gen             # Run test examples
```

## Styling Conventions

### Tailwind CSS 4.1.17 Configuration
- **Special gradients**: Use `bg-linear-to-*` syntax (e.g., `bg-linear-to-r`, `bg-linear-to-br`) - NOT `bg-gradient-to-*`
- **No rounded corners**: Design system explicitly removed `rounded-*` classes from panels/sidebars
- **Minimal padding**: All padding values reduced to 50% during polish phase (px-3, py-2 standard)
- **No horizontal padding**: Removed px-* from blocks per design system

### Color System
- Primary gradients: `from-blue-50 to-indigo-50`, `from-purple-50 to-pink-50`, `from-slate-50 to-slate-100`
- Hover states: Lighten by 50 (e.g., `hover:from-blue-100`)
- Selection highlight: `ring-2 ring-blue-500`

## Key Files & Patterns

### Path-Based Node Selection
Selection uses numeric arrays to traverse `ComponentSchema` tree:
```typescript
// Example: [0, 1] = root's first child's second child
const getNodeByPath = (schema: ComponentSchema, path: number[]) => {
  let current = schema;
  for (const index of path) {
    current = current.children[index];
  }
  return current;
};
```

### Collapsible Sidebar Pattern
Three-column layout with collapse states: `leftCollapsed`, `rightCollapsed`
- Collapsed: `w-0 min-w-0` with vertical button overlay (`w-8`)
- Expanded: `w-1/5 min-w-[250px]` with smooth `transition-all duration-300`
- Middle panel: `flex-1` takes remaining space

### Component Import Pattern
When importing modular components, always import from `components/` directory:
```typescript
import { ElementsList } from '../components/ElementsList'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { PreviewArea } from '../components/PreviewArea'
import { ComponentSchema } from '../components/DynamicComponentRenderer'
```

## Navigation Structure
Two-route app using React Router:
- `/` - Playground page (previews generated components from manifest.json)
- `/generate` - Component builder with three-panel editor

## Testing & Debugging
- No formal test suite - use `npm run demo` for smoke testing CLI generator
- Playground errors shown via `<ErrorBoundary>` component
- JSON validation errors displayed inline in editor with red background

## Common Tasks

**Adding new element types**: Update `elements` array in `ElementsList.tsx` with icon, name, description, type, nodeType

**Modifying properties panel**: Edit sections in `PropertiesPanel.tsx` - maintain structure: collapsible button → content div with `px-3 pb-3 space-y-2`

**Updating default schema**: Modify `defaultSchema` constant in `Generate.tsx` (persisted to localStorage)

**Styling changes**: Remember Tailwind 4.x gradient syntax differences and minimal padding/no-rounded-corners design system
