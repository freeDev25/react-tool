import React from 'react';

interface SchemaRendererProps {
  schema: any;
}

export default function SchemaRenderer({ schema }: SchemaRendererProps) {
  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.type === 'text') {
      const textContent = Array.isArray(node.children) 
        ? node.children.join('') 
        : node.children || '';
      return textContent;
    }

    // Handle HTML nodes
    if (node.type === 'node') {
      const Tag = node.nodeType || 'div';
      const props: any = {
        style: node.styles || node.style || {},
        ...node.props
      };

      // Render children recursively
      const children = node.children 
        ? Array.isArray(node.children)
          ? node.children.map((child: any, index: number) => (
              <React.Fragment key={index}>
                {renderNode(child)}
              </React.Fragment>
            ))
          : node.children
        : null;

      return React.createElement(Tag, props, children);
    }

    return null;
  };

  return <div className="schema-preview">{renderNode(schema)}</div>;
}
