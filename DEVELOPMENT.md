# Development Guide

## Monorepo Structure

This is an **npm workspaces** monorepo with two projects:

```
react-tool/
├── json-to-react/      # Generator package
├── playground/         # Playground package  
└── package.json        # Root workspace config
```

## Initial Setup

```bash
# From root directory
npm install

# This will automatically install dependencies for both workspaces
```

## Development Workflow

### 1. Generate Components

```bash
# Generate example dashboard components
npm run demo

# Generate interactive components (Counter, Timer, etc.)
npm run demo:interactive

# Or from json-to-react directory
cd json-to-react
npm run demo
```

Components are generated in `json-to-react/output/`.

### 2. Preview in Playground

```bash
# Start playground dev server (from root)
npm run play:dev

# Or from playground directory
cd playground
npm run dev
```

Open http://localhost:5173 to see generated components.

### 3. Watch Mode for Generator

```bash
# From root
npm run dev:generator

# Or from json-to-react
cd json-to-react
npm run dev
```

This watches for TypeScript changes and recompiles automatically.

## Common Tasks

### Adding New Components

1. **Create schema** in `json-to-react/src/tests/`:
   ```typescript
   import Schema from "../schema/Schema";
   
   const MyComponent = new Schema('MyComponent', 
     { /* props */ },
     Schema.node('div', { /* structure */ })
   );
   ```

2. **Generate component**:
   ```bash
   npm run demo
   ```

3. **Update ComponentPreview** in `playground/src/ComponentPreview.tsx`:
   ```typescript
   const componentMap = {
     // ... existing
     MyComponent: () => import('@output/MyComponent/MyComponent'),
   }
   ```

4. **View in playground**:
   ```bash
   npm run play:dev
   ```

### Installing Dependencies

**For generator (json-to-react):**
```bash
npm install <package> --workspace=json-to-react
```

**For playground:**
```bash
npm install <package> --workspace=playground
```

**For root (dev tools):**
```bash
npm install <package> -w
```

### Building

**Build generator:**
```bash
npm run build
# or
npm run build --workspace=json-to-react
```

**Build playground:**
```bash
npm run play:build
# or
npm run build --workspace=playground
```

**Build everything:**
```bash
npm run build:all
```

### Cleaning

```bash
# Remove all node_modules
npm run clean

# Remove generated components
npm run clean:output

# Remove build artifacts
npm run clean:dist
```

## Workspace Commands

Run commands in specific workspace:

```bash
# Syntax: npm <command> --workspace=<name>

npm run dev --workspace=json-to-react
npm test --workspace=playground
npm run build --workspace=json-to-react
```

Or use the shorthand `-w`:

```bash
npm run dev -w json-to-react
```

## File Paths & Imports

### In Generator (json-to-react)

Output path is relative to `json-to-react/`:
```typescript
// Generates to: json-to-react/output/MyComponent/
```

### In Playground

Vite alias points to generator output:
```typescript
// vite.config.ts
alias: {
  '@output': path.resolve(__dirname, '../json-to-react/output')
}

// Component imports
import MyComponent from '@output/MyComponent/MyComponent'
```

## Git Workflow

Single repository for both projects:

```bash
# Stage changes from both projects
git add json-to-react/ playground/

# Commit together
git commit -m "feat: add new component with playground preview"

# Push once
git push
```

### What's Tracked

- ✅ Source code (`json-to-react/src/`, `playground/src/`)
- ✅ Configuration files
- ✅ Package definitions
- ❌ `node_modules/` (gitignored)
- ❌ `dist/` builds (gitignored)
- ❌ Generated components in `output/` (gitignored, except `.gitkeep`)

## Troubleshooting

### Playground can't find components

1. Check vite alias in `playground/vite.config.ts`
2. Verify components exist in `json-to-react/output/`
3. Update `ComponentPreview.tsx` component map

### TypeScript errors after moving files

```bash
# Remove build cache
npm run clean:dist

# Rebuild
npm run build:all
```

### Workspace not found

```bash
# Reinstall from root
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Vite will auto-increment port (5173 → 5174)
# Or kill the process:
lsof -ti:5173 | xargs kill -9
```

## Project-Specific Docs

- **Generator**: See `json-to-react/README.md` and `json-to-react/COMPONENT_SCHEMA_GUIDE.md`
- **Playground**: See `playground/README.md`
