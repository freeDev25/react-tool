# JSON Schema to React Component Generator

A powerful TypeScript tool that automatically converts JSON Schema definitions into fully-functional React components with built-in validation, TypeScript support, and styling.

## Features

- ✅ **Automatic Form Generation**: Convert JSON schemas to React form components
- ✅ **TypeScript Support**: Generate type-safe components with full TypeScript definitions
- ✅ **Built-in Validation**: Automatic field validation based on schema constraints
- ✅ **Multiple Input Types**: Support for text, number, email, checkbox, select, textarea, and more
- ✅ **Responsive Styling**: Pre-built, customizable CSS styles included
- ✅ **Format Support**: Handle email, date, URL, and other special formats
- ✅ **Enum Support**: Automatic dropdown generation for enum fields
- ✅ **Required Fields**: Automatic validation for required fields
- ✅ **Custom Validation**: Support for min/max length, min/max values, and regex patterns

## Installation

```bash
npm install
```

## Quick Start

### Basic Usage

```typescript
import { jsonSchemaToReact } from './src/index';

const schema = {
  type: 'object',
  title: 'User Registration',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email'
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 8
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 18,
      maximum: 120
    }
  }
};

const componentCode = jsonSchemaToReact(schema, {
  componentName: 'RegistrationForm',
  useTypeScript: true,
  includeValidation: true,
  includeStyles: true
});

console.log(componentCode);
```

### Run the Demo

The project includes a demo script that generates several example forms:

```bash
npm run demo
```

This will generate the following components in the `output/` directory:
- `UserProfileForm.tsx` - A complete user profile form
- `ContactForm.tsx` - A contact/inquiry form
- `ProductForm.tsx` - A product information form
- `SimpleForm.jsx` - A JavaScript version without TypeScript

## API Reference

### `jsonSchemaToReact(schema, options)`

Converts a JSON schema to a React component.

#### Parameters

- **schema**: `JSONSchema` - The JSON schema object to convert
- **options**: `GeneratorOptions` (optional)
  - `componentName`: `string` - Name of the generated component (default: 'GeneratedForm')
  - `useTypeScript`: `boolean` - Generate TypeScript code (default: true)
  - `includeValidation`: `boolean` - Include validation logic (default: true)
  - `includeStyles`: `boolean` - Include CSS styles (default: true)

#### Returns

A string containing the complete React component code.

## Supported JSON Schema Features

### Field Types

- `string` - Text input, textarea, or select (with enum)
- `number` / `integer` - Number input
- `boolean` - Checkbox
- `array` - Arrays (basic support)
- `object` - Objects (basic support)

### Formats

- `email` - Email input with validation
- `uri` / `url` - URL input
- `date` - Date picker
- `date-time` - DateTime picker
- `time` - Time picker

### Validation Constraints

- `required` - Required fields
- `minLength` / `maxLength` - String length validation
- `minimum` / `maximum` - Number range validation
- `pattern` - Regex pattern validation
- `enum` - Predefined value options (generates dropdown)

## Example Schemas

### User Profile Form

```typescript
const userProfileSchema = {
  type: 'object',
  title: 'User Profile',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email'
    },
    country: {
      type: 'string',
      title: 'Country',
      enum: ['United States', 'Canada', 'United Kingdom', 'Australia']
    }
  }
};
```

### Contact Form

```typescript
const contactFormSchema = {
  type: 'object',
  title: 'Contact Us',
  required: ['name', 'email', 'message'],
  properties: {
    name: {
      type: 'string',
      title: 'Full Name'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    message: {
      type: 'string',
      title: 'Message',
      minLength: 10,
      maxLength: 1000
    }
  }
};
```

## Generated Component Features

The generated React components include:

1. **State Management**: Uses React hooks for form state
2. **Error Handling**: Real-time validation with error messages
3. **Event Handlers**: Pre-built onChange and onSubmit handlers
4. **Accessibility**: Proper labels and form structure
5. **Styling**: Clean, modern CSS included
6. **Type Safety**: Full TypeScript interfaces (when enabled)

## Project Structure

```
react-tool/
├── src/
│   ├── index.ts           # Main entry point
│   ├── types.ts           # TypeScript type definitions
│   ├── parser.ts          # JSON schema parser
│   ├── generator.ts       # React component generator
│   ├── examples.ts        # Example schemas
│   └── demo.ts            # Demo script
├── output/                # Generated components
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build the project

```bash
npm run build
```

### Watch mode

```bash
npm run dev
```

## Advanced Usage

### Using the Parser and Generator Separately

```typescript
import { SchemaParser, ComponentGenerator } from './src/index';

const parser = new SchemaParser();
const generator = new ComponentGenerator();

// Parse schema
const parsedSchema = parser.parse(mySchema);

// Customize parsed schema if needed
parsedSchema.fields[0].title = 'Custom Title';

// Generate component
const code = generator.generate(parsedSchema, options);
```

## Customization

The generated components use CSS classes that you can override:

- `.form-container` - Main form wrapper
- `.form-field` - Individual field wrapper
- `.form-label` - Field labels
- `.form-input` - Input elements
- `.form-checkbox` - Checkboxes
- `.error-message` - Validation error messages
- `.submit-button` - Submit button

## Limitations

- Nested objects and arrays have basic support
- Complex conditional schemas are not yet supported
- `allOf`, `anyOf`, `oneOf` keywords are not supported
- `$ref` references are not resolved

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT
