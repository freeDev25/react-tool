# React Tool - AI Coding Agent Instructions

## 🎯 Engineering Philosophy
**You are a Tech Architect.** Your code must reflect enterprise-grade standards.
- **Architectural Integrity**: Always use proper architecture and design patterns.
- **Strict Typing**: Enforce strict TypeScript standards. No `any`.
- **Modular Design**: Break down complex systems into focused, reusable modules.
- **Clean Architecture**: Separation of concerns, single responsibility principle.
- **Best Practices**: Follow industry standards, SOLID principles, and modern patterns.
- **Documentation**: Comprehensive inline docs and architectural documentation.

## 🏗️ Code Organization Standards

### Component Structure
- **One Component Per File**: Never define multiple components in a single file.
- **Folder-Based Structure**: Create a dedicated folder for each major component.
  ```
  src/components/MyComponent/
  ├── index.tsx          # Main component export
  ├── MyComponent.tsx    # Implementation
  ├── MyComponent.utils.ts # Helper functions specific to this component
  ├── MyComponent.types.ts # Type definitions
  └── SubComponent.tsx   # Child components used only here
  ```
- **Co-location**: Keep utils, types, and styles close to where they are used.

### Typing Standards
- **Explicit Interfaces**: Define interfaces for all props and state.
- **No Inline Types**: Move complex types to `*.types.ts` files.
- **Strict Mode**: Ensure all code passes strict TypeScript checks.

## Project Overview
Multi-purpose React tooling project with three distinct parts:
1. **CLI Generator** (`/src`, `/output`) - TypeScript tool that converts JSON schemas to React components
2. **Playground App** (`/playground`) - Interactive Vite+React app for visual component design with runtime JSON-to-React conversion
3. **Design-to-JSON** (`/design-to-json`) - Drag-and-drop visual builder using @dnd-kit for creating component schemas

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
- **Generate.tsx** (270 lines) - State orchestrator with helper functions: `getNodeByPath()`, `updateNodeByPath()`, `handleNodeSelect()`, `handleDrop()`
- **ElementsList.tsx** - Left sidebar with 8 draggable base elements (Text, Div, Button, Image, etc.) - implements drag start with schema data transfer
- **PropertiesPanel.tsx** - Figma-style property editor with collapsible sections: Layout, Fill, Stroke, Text, Spacing
- **PreviewArea.tsx** - Toggle between component preview and JSON editor, manages drag state (`isDragging`)

**State Management Pattern**: Parent component (Generate.tsx) manages `schema`, `selectedNode`, `selectedNodePath` state and passes callbacks down. localStorage persistence at `'component-schema'` key.

### Drag-and-Drop System
Elements from left sidebar can be dragged into preview area with precise placement:
- **ElementsList**: Creates default `ComponentSchema` for each element type on drag start, transfers via `dataTransfer.setData('application/json')`
- **DynamicComponentRenderer**: Renders drop zones (blue for before/after, green for inside containers) when `isDragging={true}`
- **Drop zones**: 8px height zones expand to 16px on hover, positioned before/after each element or inside containers
- **Position types**: `'before'` | `'after'` | `'inside'` - determines where new element inserts in tree
- **Schema update**: `handleDrop()` in Generate.tsx performs deep clone, navigates path, splices new element at correct index

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

**Adding new element types**: 
1. Update `elements` array in `ElementsList.tsx` with icon, name, description, type, nodeType
2. Add default schema configuration in `createDefaultSchema()` function (styles, props, children)

**Modifying properties panel**: Edit sections in `PropertiesPanel.tsx` - maintain structure: collapsible button → content div with `px-3 pb-3 space-y-2`

**Updating default schema**: Modify `defaultSchema` constant in `Generate.tsx` (persisted to localStorage)

**Styling changes**: Remember Tailwind 4.x gradient syntax differences and minimal padding/no-rounded-corners design system

**Adjusting drop zones**: Modify `renderNode()` in `DynamicComponentRenderer.tsx` - drop zone divs use `h-2` default, `h-4` on active, with `bg-blue-*` (before/after) or `bg-green-*` (inside)

## Design-to-JSON Architecture (Dec 2024)

### Core Architecture Principles
The design-to-json workspace follows **enterprise-level architectural patterns**:

**Type System** (`/design-to-json/src/types/schema.types.ts`):
```typescript
type ComponentSchema = TextNode | ElementNode;

interface ElementNode {
  type: 'node';
  nodeType: NodeType;  // keyof React.JSX.IntrinsicElements
  styles?: React.CSSProperties;
  props?: Record<string, unknown>;
  children?: ComponentSchema[];
}

interface CanvasElement {
  id: string;
  schema: ComponentSchema;
}
```

**Utility Layer** (`/design-to-json/src/utils/schema.utils.ts`):
- `addChildToSchema()`: Immutable tree updates with recursion
- `canAcceptChildren()`: Type checking for container elements
- `generateElementId()`: Unique ID generation with timestamp + random

**Component Hierarchy**:
```
Home (DndContext orchestrator)
├── Header (sidebar toggles)
├── LeftSidebar (DraggableElement components)
├── Canvas (useDroppable canvas)
│   └── SchemaRenderer (recursive renderer)
│       └── DroppableNode (nested drop targets)
└── RightSidebar (properties panel)
```

### Drag-and-Drop Flow (@dnd-kit)
1. **LeftSidebar**: `useDraggable` hook on each element, transfers `ComponentSchema` via data prop
2. **Canvas**: `useDroppable` with id='canvas' for top-level drops
3. **DroppableNode**: Nested `useDroppable` for each container element (div, section, etc.)
4. **Home.handleDragEnd**: Determines drop location and updates state immutably
5. **SchemaRenderer**: Recursive React.createElement() for dynamic rendering

### Key Design Decisions
- **@dnd-kit over HTML5 DnD**: Better performance, accessibility, TypeScript support
- **React.createElement()**: Dynamic tag names from schema, no switch statements
- **Immutable Updates**: All schema changes create new objects for predictability
- **Type-Only Imports**: `import type` for better tree-shaking
- **No `any` Types**: Full TypeScript strictness for maintainability

### Development Workflows

#### Design-to-JSON Development
```bash
# From project root
npm run design:dev      # Vite dev server on http://localhost:5175
npm run design:build    # Production build
npm run design:preview  # Preview production build
```

### Code Standards

**TypeScript**:
- Strict mode enabled, no implicit any
- Type-only imports: `import type { Type } from '...'`
- Comprehensive interfaces for all props
- JSDoc comments for utility functions

**React**:
- Functional components only
- Custom hooks for shared logic
- Props interfaces with explicit types
- React.Fragment to avoid extra DOM nodes

**File Organization**:
```
src/
├── types/          # Type definitions (single source of truth)
├── utils/          # Pure functions (testable, side-effect free)
├── components/     # UI components (single responsibility)
│   └── [Component]/ # Complex components with sub-components
│       ├── index.tsx
│       ├── SubComponent.tsx
│       └── types.ts
├── pages/          # Layout & state orchestration
└── schemas/        # JSON data files
```

### Adding Features to Design-to-JSON

**New Element Types**:
1. Add schema to `src/schemas/base.json`
2. Update `canAcceptChildren()` in utils if it's a container
3. No code changes needed - fully schema-driven

**New Properties**:
1. Extend types in `src/types/schema.types.ts`
2. Add UI in `RightSidebar.tsx`
3. Update `SchemaRenderer` if custom rendering needed

**State Management**:
- Current: Lifting state pattern in Home.tsx
- Future: Consider Zustand/Jotai for complex state
- Maintain immutability for all updates

### Reference Documentation
See `/design-to-json/ARCHITECTURE.md` for comprehensive architectural documentation including:
- System overview and design decisions
- Component responsibilities
- Performance considerations
- Future enhancement roadmap
- Testing strategies
