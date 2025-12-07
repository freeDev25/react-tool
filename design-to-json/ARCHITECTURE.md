# Design-to-JSON - Architecture Documentation

## Overview
A visual drag-and-drop component builder that generates JSON schemas for React components. Built with React 19, TypeScript, Vite, and @dnd-kit for drag-and-drop functionality.

## Architecture Principles

### 1. **Type Safety**
- Strict TypeScript configuration with no `any` types
- Comprehensive type definitions in `src/types/`
- Type-only imports for better tree-shaking

### 2. **Separation of Concerns**
- **Types**: Schema definitions in `src/types/schema.types.ts`
- **Utils**: Pure functions for schema manipulation in `src/utils/`
- **Components**: UI components with single responsibilities
- **Pages**: Layout orchestration and state management

### 3. **Modular Design**
- Each component handles one specific responsibility
- Reusable utility functions for schema operations
- Clean interfaces between modules

### 4. **Performance**
- @dnd-kit for optimized drag-and-drop
- React.createElement for dynamic element rendering
- Minimal re-renders with proper React patterns

## Project Structure

```
design-to-json/
├── src/
│   ├── types/
│   │   └── schema.types.ts       # Core type definitions
│   ├── utils/
│   │   └── schema.utils.ts       # Schema manipulation utilities
│   ├── components/
│   │   ├── Canvas.tsx             # Drop zone for elements
│   │   ├── Header.tsx             # Top navigation
│   │   ├── LeftSidebar.tsx        # Element palette
│   │   ├── RightSidebar.tsx       # Properties panel
│   │   └── SchemaRenderer.tsx     # Dynamic schema→React renderer
│   ├── pages/
│   │   └── Home.tsx               # Main page with DndContext
│   └── schemas/
│       └── base.json              # Base element definitions
```

## Core Concepts

### ComponentSchema
The fundamental data structure representing any UI element:

```typescript
type ComponentSchema = TextNode | ElementNode;

interface TextNode {
  type: 'text';
  children: string[];
}

interface ElementNode {
  type: 'node';
  nodeType: NodeType;  // 'div', 'button', etc.
  styles?: React.CSSProperties;
  props?: Record<string, unknown>;
  children?: ComponentSchema[];
}
```

### Schema Manipulation
Utility functions in `schema.utils.ts`:
- `addChildToSchema()`: Immutable tree updates
- `canAcceptChildren()`: Type checking for container elements
- `generateElementId()`: Unique ID generation

### Drag-and-Drop Flow

1. **Drag Start**: LeftSidebar → DraggableElement with schema data
2. **Drag Over**: Canvas/DroppableNode highlights drop target
3. **Drop**: Home.handleDragEnd() processes drop location
4. **State Update**: Elements array updated with new/nested schema
5. **Re-render**: SchemaRenderer converts schema to React elements

## Component Responsibilities

### Home (State Orchestrator)
- Manages global drag-and-drop context
- Maintains canvas elements array
- Handles drop logic (new vs nested)
- Coordinates sidebar visibility

### Canvas (Drop Target)
- Primary drop zone using `useDroppable`
- Renders elements via SchemaRenderer
- Visual feedback on drag over

### LeftSidebar (Element Palette)
- Lists draggable base elements
- Each element uses `useDraggable` hook
- Transfers schema data via DnD context

### SchemaRenderer (Dynamic Renderer)
- Recursively renders ComponentSchema
- Wraps container elements with DroppableNode
- Handles text and element nodes

### DroppableNode (Nested Drop Target)
- Makes specific nodes droppable
- Visual feedback on hover
- Passes element ID and path for nested drops

## Key Design Decisions

### Why @dnd-kit?
- Modern, accessible, framework-agnostic
- Better performance than HTML5 drag-and-drop
- Rich API for complex interactions
- TypeScript support

### Why React.createElement?
- Dynamic tag names from schema
- No need for switch/case statements
- Clean, functional approach
- Better for runtime schema rendering

### Schema Immutability
All schema updates create new objects:
- Predictable state changes
- Easy debugging
- React optimization friendly
- Time-travel debugging potential

## Development Guidelines

### Adding New Element Types
1. Add schema definition to `src/schemas/base.json`
2. Update `canAcceptChildren()` if it's a container
3. No code changes needed - fully schema-driven

### Adding Properties
1. Define property types in `schema.types.ts`
2. Update RightSidebar to edit properties
3. Properties flow through schema to rendered elements

### Testing Strategy
- Unit tests for `schema.utils.ts` functions
- Integration tests for drag-and-drop flows
- Snapshot tests for SchemaRenderer output

## Performance Considerations

### Current Optimizations
- @dnd-kit sensors for smooth dragging
- React.Fragment to avoid extra DOM nodes
- Minimal state in leaf components

### Future Optimizations
- React.memo for SchemaRenderer
- useMemo for rendered elements
- Virtual scrolling for large canvases
- Web Workers for complex schema operations

## Future Enhancements

### Planned Features
1. **Element Selection**: Click to select, show selection ring
2. **Properties Panel**: Edit selected element properties
3. **JSON Export**: Save design as JSON file
4. **Code Generation**: Convert to actual React component
5. **Undo/Redo**: State history management
6. **Keyboard Shortcuts**: Power user features
7. **Nested Drop Indicators**: Visual guides for nesting
8. **Element Tree View**: Hierarchy visualization

### Architectural Improvements
1. **State Management**: Consider Zustand/Jotai for complex state
2. **Command Pattern**: For undo/redo functionality
3. **Plugin System**: Extensible element types
4. **Schema Validation**: Runtime schema checking
5. **Performance Monitoring**: React DevTools Profiler

## Standards & Best Practices

### TypeScript
- Strict mode enabled
- No implicit any
- Type-only imports for types
- Comprehensive interfaces

### React
- Functional components only
- Hooks for state management
- Props interface for all components
- Key props for lists

### Code Style
- ESLint + Prettier configured
- Consistent naming conventions
- Clear function documentation
- Single responsibility principle

### Git Workflow
- Feature branches for new work
- Descriptive commit messages
- PR reviews before merge

## References
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Guide](https://vitejs.dev/guide/)
