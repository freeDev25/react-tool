import React, { CSSProperties, useMemo, useEffect } from 'react';

export interface ComponentSchema {
  type: 'node' | 'component' | 'text';
  nodeType?: keyof JSX.IntrinsicElements;
  dropadble?: boolean;
  name?: string;
  props?: Record<string, any>;
  styles?: CSSProperties;
  children?: ComponentSchema[] | string[];
}

interface DynamicComponentRendererProps {
  schema: ComponentSchema;
  onNodeClick?: (path: number[]) => void;
  selectedPath?: number[];
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
export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ 
  schema, 
  onNodeClick,
  selectedPath = []
}) => {
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

  // Helper to check if path matches
  const isPathEqual = (path1: number[], path2: number[]): boolean => {
    return path1.length === path2.length && path1.every((val, idx) => val === path2[idx]);
  };

  // Helper to check if current node or any ancestor is droppable
  const isInsideDroppable = (currentPath: number[], currentNode: ComponentSchema): boolean => {
    // Check if current node is droppable
    if ((currentNode as any).dropadble === true) {
      return true;
    }
    
    // Check all ancestors in the path
    let testSchema = schema;
    for (let i = 0; i < currentPath.length; i++) {
      const pathSegment = currentPath.slice(0, i + 1);
      let node: any = schema;
      for (const idx of pathSegment) {
        if (node.children && node.children[idx]) {
          node = node.children[idx];
        }
      }
      if (node && (node as any).dropadble === true) {
        return true;
      }
    }
    return false;
  };

  const renderNode = (node: ComponentSchema, index: number = 0, currentPath: number[] = [], isParentDroppable: boolean = false): React.ReactNode => {
    // Handle text nodes
    if (node.type === 'text') {
      const textContent = Array.isArray(node.children) ? node.children.join('') : '';
      const isSelected = isPathEqual(currentPath, selectedPath);
      
      // Don't make text nodes clickable if inside droppable
      if (onNodeClick && !isParentDroppable) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(currentPath);
            }}
            className={`cursor-pointer hover:bg-blue-100 ${isSelected ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}
            style={{ display: 'inline', padding: '2px 4px', borderRadius: '2px' }}
          >
            {textContent}
          </span>
        );
      }
      
      return textContent || null;
    }

    // Handle HTML nodes
    if (node.type === 'node' && node.nodeType) {
      const TagName = node.nodeType;
      const { props = {}, styles = {}, children = [] } = node;
      const isSelected = isPathEqual(currentPath, selectedPath);
      const isDroppable = (node as any).dropadble === true;
      const isInDroppable = isParentDroppable || isDroppable;

      // Generate class name if styles exist
      let className = props.className || '';
      if (styles && Object.keys(styles).length > 0) {
        const generatedClass = `dynamic-${renderClassCounter++}`;
        className = className ? `${className} ${generatedClass}` : generatedClass;
      }

      // Add selection highlight (skip for droppable nodes and their children)
      if (isSelected && !isInDroppable) {
        className = className ? `${className} ring-2 ring-blue-500 ring-offset-2` : 'ring-2 ring-blue-500 ring-offset-2';
      }

      // Add hover effect for selectable nodes (skip for droppable nodes and their children)
      if (onNodeClick && !isInDroppable) {
        className = className ? `${className} cursor-pointer hover:ring-1 hover:ring-blue-300` : 'cursor-pointer hover:ring-1 hover:ring-blue-300';
      }

      // Create props without inline styles
      const elementProps: any = {
        ...props,
        ...(className && { className }),
        key: index,
        ...(!isInDroppable && onNodeClick && {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onNodeClick(currentPath);
          }
        }),
      };

      // Handle void elements (self-closing tags)
      const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
      if (voidElements.includes(node.nodeType)) {
        return React.createElement(TagName, elementProps);
      }

      // Render children (pass down droppable state)
      const renderedChildren = children.map((child, idx) => {
        if (typeof child === 'string') {
          return child;
        }
        return renderNode(child as ComponentSchema, idx, [...currentPath, idx], isInDroppable);
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
