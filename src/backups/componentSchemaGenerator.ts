import { BaseSchema } from './types';

export interface ComponentGeneratorOptions {
  componentName?: string;
  useTypeScript?: boolean;
  includeStyles?: boolean;
}

export class ComponentSchemaGenerator {
  /**
   * Generate a React component from a BaseSchema tree
   */
  generate(schema: BaseSchema, options: ComponentGeneratorOptions = {}): string {
    const {
      componentName = schema.name || 'GeneratedComponent',
      useTypeScript = true,
      includeStyles = true,
    } = options;

    const imports = this.generateImports();
    const component = this.generateComponent(schema, componentName, useTypeScript);
    const inlineStyles = includeStyles ? this.generateInlineStyles(schema) : '';

    return `${imports}\n\n${component}`;
  }

  /**
   * Generate import statements
   */
  private generateImports(): string {
    return `import React from 'react';`;
  }

  /**
   * Generate the main component code
   */
  private generateComponent(
    schema: BaseSchema,
    componentName: string,
    useTypeScript: boolean
  ): string {
    const propsType = useTypeScript ? ': React.FC' : '';
    const componentTree = this.generateComponentTree(schema, 2);

    return `const ${componentName}${propsType} = () => {
  return (
${componentTree}
  );
};

export default ${componentName};`;
  }

  /**
   * Generate the component tree recursively
   */
  private generateComponentTree(schema: BaseSchema, indent: number = 0): string {
    const indentation = ' '.repeat(indent);
    const elementType = this.getElementType(schema.type);
    const styleObj = this.generateStyleObject(schema);
    const propsStr = this.generatePropsString(schema);
    const idProp = schema.id ? ` id="${schema.id}"` : '';

    // Handle self-closing tags for elements without children
    if (!schema.children || schema.children.length === 0) {
      if (schema.type === 'Image') {
        return `${indentation}<${elementType}${idProp}${propsStr} style={${styleObj}} />`;
      }
      return `${indentation}<${elementType}${idProp}${propsStr} style={${styleObj}}></${elementType}>`;
    }

    // Handle elements with children
    const children = schema.children
      .map((child) => this.generateComponentTree(child, indent + 2))
      .join('\n');

    return `${indentation}<${elementType}${idProp}${propsStr} style={${styleObj}}>
${children}
${indentation}</${elementType}>`;
  }

  /**
   * Map schema type to HTML/React element
   */
  private getElementType(type: string): string {
    switch (type) {
      case 'Div':
        return 'div';
      case 'Text':
        return 'span';
      case 'Image':
        return 'img';
      default:
        return 'div';
    }
  }

  /**
   * Generate style object from layout and styles
   */
  private generateStyleObject(schema: BaseSchema): string {
    const styles: Record<string, any> = {};

    // Add layout styles
    if (schema.layout) {
      if (schema.layout.width !== undefined) {
        styles.width = schema.layout.width;
      }
      if (schema.layout.height !== undefined) {
        styles.height = schema.layout.height;
      }
      if (schema.layout.x !== undefined || schema.layout.y !== undefined) {
        styles.position = 'absolute';
        if (schema.layout.x !== undefined) {
          styles.left = schema.layout.x;
        }
        if (schema.layout.y !== undefined) {
          styles.top = schema.layout.y;
        }
      }
    }

    // Add custom styles
    if (schema.styles && Object.keys(schema.styles).length > 0) {
      Object.entries(schema.styles).forEach(([key, value]) => {
        const reactKey = this.convertToCamelCase(key);
        styles[reactKey] = value;
      });
    }

    if (Object.keys(styles).length === 0) {
      return '{}';
    }

    // Format the style object for JSX
    const styleEntries = Object.entries(styles)
      .map(([key, value]) => {
        if (typeof value === 'number' && key !== 'opacity' && key !== 'zIndex') {
          return `${key}: ${value}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');

    return `{{ ${styleEntries} }}`;
  }

  /**
   * Generate props string for the element
   */
  private generatePropsString(schema: BaseSchema): string {
    if (!schema.props || Object.keys(schema.props).length === 0) {
      return '';
    }

    return Object.entries(schema.props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return ` ${key}="${value}"`;
        }
        return ` ${key}={${JSON.stringify(value)}}`;
      })
      .join('');
  }

  /**
   * Convert CSS property names to camelCase for React
   */
  private convertToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * Generate inline styles helper (not used in current implementation)
   */
  private generateInlineStyles(schema: BaseSchema): string {
    return '';
  }
}
