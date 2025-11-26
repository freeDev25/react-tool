# Quick Reference

## Most Common Commands

```bash
# 🎨 Generate components
npm run demo                    # Dashboard components
npm run demo:interactive        # Interactive components (Counter, Timer, etc.)

# 🚀 Run playground
npm run play:dev               # http://localhost:5173

# 🔨 Development
npm run dev:generator          # Watch generator for changes
npm run build                  # Build generator
npm run build:all              # Build everything

# 🧹 Cleanup
npm run clean                  # Remove all node_modules
npm run clean:output           # Remove generated components
npm run clean:dist             # Remove build outputs
```

## Folder Structure

```
react-tool/                    # 📁 Root (monorepo)
├── json-to-react/            # 📦 Generator package
│   ├── src/                  # Source code
│   │   ├── core/            # Generator logic
│   │   ├── schema/          # Schema definitions  
│   │   └── tests/           # Component examples
│   ├── output/              # 📤 Generated components
│   └── package.json
│
├── playground/               # 📦 Playground package
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Routes
│   │   └── main.tsx
│   ├── public/
│   │   └── manifest.json    # Component registry
│   └── package.json
│
├── package.json             # 📋 Root workspace config
├── README.md                # Documentation
└── DEVELOPMENT.md           # Detailed dev guide
```

## Workflow

### Adding a New Component

1. **Create** `json-to-react/src/tests/my-component.ts`
2. **Generate** `npm run demo`
3. **Update** `playground/src/ComponentPreview.tsx`
4. **Preview** `npm run play:dev`

### Working on Generator

```bash
# Terminal 1: Watch mode
npm run dev:generator

# Terminal 2: Generate on changes
npm run demo

# Terminal 3: See results in playground
npm run play:dev
```

## Path Aliases

**Playground imports from generator:**
```typescript
import MyComponent from '@output/MyComponent/MyComponent'
// → ../json-to-react/output/MyComponent/MyComponent
```

## NPM Workspaces

**Install to specific workspace:**
```bash
npm install <pkg> --workspace=json-to-react
npm install <pkg> --workspace=playground
```

**Run in specific workspace:**
```bash
npm run <script> --workspace=json-to-react
```

## Component Features Checklist

✅ Props & TypeScript types  
✅ Scoped CSS (component-specific classes)  
✅ Event handlers (`onClick`, `onChange`, etc.)  
✅ State management (`useState`)  
✅ Effects (`useEffect`)  
✅ Conditional rendering  
✅ Custom logic  
✅ Nested components  
✅ Auto imports  

## Example Component Schema

```typescript
import Schema from "../schema/Schema";

const MyButton = new Schema('MyButton', 
  {
    label: { type: 'string', default: 'Click me' },
    disabled: { type: 'boolean', default: false }
  },
  Schema.node('button', {
    handlers: {
      onClick: 'handleClick'
    },
    styles: {
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    },
    children: Schema.text('{props.label}')
  })
);

// Add state
(MyButton.schema as any).hooks = [{
  type: 'useState',
  name: 'count',
  initialValue: 0
}];

// Add logic
(MyButton.schema as any).componentLogic = `
  const handleClick = () => {
    console.log('Clicked!');
    setCount(count + 1);
  };
`;

export default MyButton;
```

## Git

Single repository for both projects:
```bash
git add .
git commit -m "feat: add new component"
git push
```

## Ports

- Playground: `5173` (auto-increments if in use)
- Generator: CLI only (no server)

## Help

- 📖 Full docs: `README.md`
- 🔧 Dev guide: `DEVELOPMENT.md`
- 📝 Component schemas: `json-to-react/COMPONENT_SCHEMA_GUIDE.md`
