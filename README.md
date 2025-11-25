# React Tool Monorepo

A monorepo containing a React component generator and interactive playground.

## 📦 Projects

### `json-to-react/`
TypeScript-based CLI tool that converts JSON schemas to fully functional React components with:
- Automatic TypeScript type generation
- CSS extraction and scoped styling
- Component-specific class names
- Event handlers and state management
- Conditional rendering support
- React hooks (useState, useEffect, etc.)

### `playground/`
Interactive Vite + React application for:
- Visual component design
- Real-time JSON-to-React conversion
- Component preview and testing
- Drag-and-drop UI builder

## 🚀 Quick Start

### Installation

```bash
# Install all dependencies for both projects
npm install
```

Or install individually:
```bash
npm run install:all
```

### Development

**Run the playground:**
```bash
npm run play:dev
# Opens http://localhost:5173
```

**Watch generator for changes:**
```bash
npm run dev:generator
```

**Generate demo components:**
```bash
npm run demo
```

**Generate interactive components:**
```bash
npm run demo:interactive
```

### Building

**Build all projects:**
```bash
npm run build:all
```

**Build specific project:**
```bash
# Generator only
npm run build

# Playground only
npm run play:build
```

## 📂 Project Structure

```
react-tool/
├── json-to-react/          # Component generator CLI
│   ├── src/
│   │   ├── core/           # Generator logic
│   │   ├── schema/         # Schema definitions
│   │   └── tests/          # Example schemas
│   ├── output/             # Generated components
│   └── package.json
│
├── playground/             # Interactive playground
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page routes
│   │   └── main.tsx
│   ├── public/
│   │   └── manifest.json   # Component registry
│   └── package.json
│
├── package.json            # Root workspace config
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run play:dev` - Start playground dev server
- `npm run demo` - Generate example components
- `npm run demo:interactive` - Generate interactive components with logic
- `npm run build` - Build generator
- `npm run build:all` - Build all projects
- `npm run clean` - Remove all node_modules
- `npm run clean:output` - Remove generated components
- `npm run clean:dist` - Remove build outputs

### Generator (`json-to-react/`)
```bash
cd json-to-react
npm run build      # Compile TypeScript
npm run dev        # Watch mode
npm run demo       # Generate examples
npm run gen        # Run test examples
```

### Playground (`playground/`)
```bash
cd playground
npm run dev        # Dev server
npm run build      # Production build
npm run preview    # Preview production build
```

## 🎯 Usage

### 1. Generate Components

Create component schemas in `json-to-react/src/tests/`:

```typescript
import Schema from "../schema/Schema";

const MyButton = new Schema('MyButton', 
    { label: { type: 'string', default: 'Click me' } },
    Schema.node('button', {
        handlers: { onClick: 'handleClick' },
        styles: { padding: '10px 20px' },
        children: Schema.text('{props.label}')
    })
);

// Add logic
(MyButton.schema as any).hooks = [{
    type: 'useState',
    name: 'count',
    initialValue: 0
}];

(MyButton.schema as any).componentLogic = `
    const handleClick = () => setCount(count + 1);
`;
```

Run `npm run demo` to generate components in `output/`.

### 2. Preview in Playground

1. Update `playground/src/ComponentPreview.tsx` to include new components
2. Run `npm run play:dev`
3. View components at http://localhost:5173

## 🛠️ Monorepo Setup

This project uses **npm workspaces** for managing multiple packages:

- Shared `node_modules` at root level
- Independent `package.json` for each project
- Workspace-scoped commands with `--workspace` flag

### Adding Dependencies

**To a specific workspace:**
```bash
npm install <package> --workspace=json-to-react
npm install <package> --workspace=playground
```

**To root:**
```bash
npm install <package> -w
```

## 📝 Component Features

Generated components support:

✅ **Props & TypeScript interfaces**
✅ **Scoped CSS with component-specific class names**
✅ **Event handlers** (onClick, onChange, etc.)
✅ **React Hooks** (useState, useEffect, useCallback, useMemo, useRef)
✅ **Conditional rendering**
✅ **Custom logic and functions**
✅ **Nested component composition**
✅ **Automatic imports**

## 🤝 Contributing

This is a monorepo structure, so:

1. Make changes in the appropriate workspace (`json-to-react/` or `playground/`)
2. Test locally with workspace scripts
3. Commit changes to the monorepo root
4. All projects share the same git repository

## 📄 License

MIT
