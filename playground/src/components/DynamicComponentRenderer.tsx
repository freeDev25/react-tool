import React, { CSSProperties } from 'react';

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
 * Converts a JSON schema to a live React component at runtime
 */
export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ schema }) => {
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

      // Merge styles into props
      const elementProps: any = {
        ...props,
        style: styles,
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
