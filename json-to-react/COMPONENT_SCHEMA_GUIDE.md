# Using Component Schema Generator

This guide shows how to use the `componentSchemaToReact` function to generate React components from `BaseSchema` definitions.

## Basic Usage

```typescript
import { componentSchemaToReact } from './src/index';

const myComponent: BaseSchema = {
  id: 'box1',
  type: 'Div',
  name: 'ContainerBox',
  layout: { width: 560, height: 60, x: 20, y: 200 },
  styles: {},
  props: {},
  children: []
};

const code = componentSchemaToReact(myComponent, {
  componentName: 'ContainerBox',
  useTypeScript: true,
  includeStyles: true
});

console.log(code);
```

## BaseSchema Structure

### Type Definition
```typescript
interface BaseSchema {
  id?: string;              // Optional unique identifier
  type: ScemaType;          // "Text" | "Image" | "Div"
  name: string;             // Component name
  parent?: any;             // Parent reference
  children?: BaseSchema[];  // Child components
  layout?: LayoutSchema;    // Layout properties
  styles?: any;             // CSS styles
  props?: any;              // Element props
}
```

### Layout Schema
```typescript
type LayoutSchema = {
  width?: number;   // Width in pixels
  height?: number;  // Height in pixels
  x?: number;       // X position (creates absolute positioning)
  y?: number;       // Y position (creates absolute positioning)
}
```

## Examples

### Simple Box
```typescript
const box: BaseSchema = {
  id: 'box1',
  type: 'Div',
  name: 'ContainerBox',
  layout: { width: 560, height: 60, x: 20, y: 200 },
  styles: {
    'background-color': '#f5f5f5',
    'border': '1px solid #ddd'
  },
  props: {},
  children: []
};
```

**Generated Output:**
```tsx
import React from 'react';

const ContainerBox: React.FC = () => {
  return (
  <div id="box1" style={{ width: 560, height: 60, position: "absolute", left: 20, top: 200, backgroundColor: "#f5f5f5", border: "1px solid #ddd" }}></div>
  );
};

export default ContainerBox;
```

### Image Component
```typescript
const imageSchema: BaseSchema = {
  id: 'banner',
  type: 'Image',
  name: 'BannerImage',
  layout: { width: 800, height: 400 },
  styles: {
    'border-radius': '8px',
    'object-fit': 'cover'
  },
  props: {
    src: 'https://example.com/banner.jpg',
    alt: 'Banner Image'
  },
  children: []
};
```

### Nested Components
```typescript
const complexLayout: BaseSchema = {
  id: 'root',
  type: 'Div',
  name: 'Card',
  layout: { width: 400, height: 300 },
  styles: {
    'background-color': 'white',
    'border-radius': '8px',
    'padding': '20px'
  },
  props: {},
  children: [
    {
      id: 'header',
      type: 'Text',
      name: 'CardTitle',
      layout: {},
      styles: {
        'font-size': '24px',
        'font-weight': 'bold',
        'margin-bottom': '16px'
      },
      props: {},
      children: []
    },
    {
      id: 'content',
      type: 'Text',
      name: 'CardContent',
      layout: {},
      styles: {
        'color': '#666',
        'line-height': '1.6'
      },
      props: {},
      children: []
    }
  ]
};
```

## Features

- ✅ Automatic conversion of BaseSchema to React components
- ✅ Layout system with width, height, and absolute positioning
- ✅ CSS-in-JS style generation with camelCase conversion
- ✅ Support for nested component trees
- ✅ Props passthrough for HTML attributes
- ✅ TypeScript support

## Component Types

### Div
Maps to `<div>` element - used for containers and layouts

### Text
Maps to `<span>` element - used for text content

### Image
Maps to `<img>` element - used for images
- Requires `src` prop
- Self-closing tag

## Style Conversion

CSS property names are automatically converted from kebab-case to camelCase:
- `background-color` → `backgroundColor`
- `font-size` → `fontSize`
- `margin-bottom` → `marginBottom`

## Options

```typescript
interface ComponentGeneratorOptions {
  componentName?: string;    // Name of the component (default: schema.name)
  useTypeScript?: boolean;   // Generate TypeScript (default: true)
  includeStyles?: boolean;   // Include styles (default: true)
}
```
