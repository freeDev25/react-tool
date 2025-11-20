import React, { CSSProperties, useMemo, useEffect } from 'react';

export interface ComponentSchema {
  type: 'node' | 'component' | 'text';
  nodeType?: keyof JSX.IntrinsicElements;
  name?: string;
  props?: Record<string, any>;
  styles?: CSSProperties;
  children?: ComponentSchema[] | string[];
}

interface DynamicComponentRendererProps {
  schema: ComponentSchema;
}

/**
 * Converts camelCase CSS property to kebab-case
 */
const camelToKebab = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
};

/**
 * Converts a CSSProperties object to CSS string
 */
const cssPropertiesToString = (styles: CSSProperties): string => {
  return Object.entries(styles)
    .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
    .join(' ');
};

/**
 * Converts a JSON schema to a live React component at runtime
 */
export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ schema }) => {
  let classCounter = 0;
  const cssRules = new Map<string, string>();

  /**
   * Generate a unique class name and store the CSS rule
   */
  const generateClassName = (styles: CSSProperties): string => {
    const className = `dynamic-${classCounter++}`;
    const cssString = cssPropertiesToString(styles);
    cssRules.set(className, cssString);
    return className;
  };

  /**
   * Extract all styles and generate CSS rules
   */
  const extractStyles = (node: ComponentSchema): void => {
    if (node.type === 'node' && node.styles && Object.keys(node.styles).length > 0) {
      generateClassName(node.styles);
    }
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        if (typeof child !== 'string' && child.type !== 'text') {
          extractStyles(child as ComponentSchema);
        }
      });
    }
  };

  // Pre-process to extract all styles
  extractStyles(schema);

  // Generate the complete CSS string
  const cssString = useMemo(() => {
    return Array.from(cssRules.entries())
      .map(([className, rules]) => `.${className} { ${rules} }`)
      .join('\n');
  }, [schema]);

  // Inject styles into the document head
  useEffect(() => {
    const styleId = 'dynamic-component-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = cssString;
    
    return () => {
      // Cleanup on unmount
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [cssString]);

  // Reset counter for rendering
  let renderClassCounter = 0;

  const renderNode = (node: ComponentSchema, index: number = 0): React.ReactNode => {
    // Handle text nodes
    if (node.type === 'text') {
      if (Array.isArray(node.children)) {
        return node.children.join('');
      }
      return null;
    }

    // Handle HTML nodes
    if (node.type === 'node' && node.nodeType) {
      const TagName = node.nodeType;
      const { props = {}, styles = {}, children = [] } = node;

      // Generate class name if styles exist
      let className = props.className || '';
      if (styles && Object.keys(styles).length > 0) {
        const generatedClass = `dynamic-${renderClassCounter++}`;
        className = className ? `${className} ${generatedClass}` : generatedClass;
      }

      // Create props without inline styles
      const elementProps: any = {
        ...props,
        ...(className && { className }),
        key: index,
      };

      // Handle void elements (self-closing tags)
      const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
      if (voidElements.includes(node.nodeType)) {
        return React.createElement(TagName, elementProps);
      }

      // Render children
      const renderedChildren = children.map((child, idx) => {
        if (typeof child === 'string') {
          return child;
        }
        return renderNode(child as ComponentSchema, idx);
      });

      return React.createElement(TagName, elementProps, ...renderedChildren);
    }

    // Handle component nodes (not implemented yet, but structure is here)
    if (node.type === 'component' && node.name) {
      return (
        <div key={index} style={{ padding: '8px', border: '1px dashed #ccc', borderRadius: '4px' }}>
          <em>Component: {node.name} (not yet implemented)</em>
        </div>
      );
    }

    return null;
  };

  return <>{renderNode(schema)}</>;
};

/**
 * Example usage and schema format
 * 
 * const exampleSchema: ComponentSchema = {
 *   type: 'node',
 *   nodeType: 'div',
 *   styles: { padding: '20px', backgroundColor: '#f0f0f0' },
 *   props: { className: 'container' },
 *   children: [
 *     {
 *       type: 'node',
 *       nodeType: 'h1',
 *       styles: { color: '#333' },
 *       children: [{ type: 'text', children: ['Hello World'] }]
 *     },
 *     {
 *       type: 'node',
 *       nodeType: 'p',
 *       children: [{ type: 'text', children: ['This is a paragraph.'] }]
 *     }
 *   ]
 * };
 * 
 * <DynamicComponentRenderer schema={exampleSchema} />
 */
