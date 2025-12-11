import type { SerializedNodes } from '@craftjs/core';
import type { ComponentSchema, ElementNode, TextNode } from '../types/schema.types';

export const convertCraftToSchema = (nodes: SerializedNodes): ComponentSchema | null => {
  // Find the root node (usually 'ROOT')
  const rootNodeId = 'ROOT';
  const rootNode = nodes[rootNodeId];

  if (!rootNode) return null;

  return mapNode(rootNodeId, nodes);
};

const mapNode = (nodeId: string, nodes: SerializedNodes): ComponentSchema => {
  const node = nodes[nodeId];
  const { displayName, props, nodes: childIds } = node;

  // Map children recursively
  const children = childIds.map(childId => mapNode(childId, nodes));

  switch (displayName) {
    case 'Container':
      return mapContainer(props, children);
    case 'Text':
      return mapText(props);
    case 'Button':
      return mapButton(props);
    case 'Link':
      return mapLink(props, children);
    case 'List':
      return mapList(props, children);
    case 'ListItem':
      return mapListItem(props, children);
    case 'Accordion':
      return mapAccordion(props, children);
    case 'AccordionItem':
      return mapAccordionItem(props, children);
    default:
      // Fallback for unknown components, treat as div
      return {
        type: 'node',
        nodeType: 'div',
        props: props,
        children: children
      } as ElementNode;
  }
};

const mapContainer = (props: any, children: ComponentSchema[]): ElementNode => {
  const { background, padding, ...otherProps } = props;
  
  return {
    type: 'node',
    nodeType: 'div',
    styles: {
      background,
      padding,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      ...otherProps.style
    },
    props: otherProps,
    children
  };
};

const mapText = (props: any): ElementNode => {
  const { text, fontSize, color, ...otherProps } = props;

  return {
    type: 'node',
    nodeType: 'p',
    styles: {
      fontSize,
      color,
      margin: 0,
      ...otherProps.style
    },
    children: [
      {
        type: 'text',
        children: [text || '']
      } as TextNode
    ]
  };
};

const mapButton = (props: any): ElementNode => {
  const { text, variant, ...otherProps } = props;
  
  const bg = variant === 'primary' ? '#3b82f6' : '#6b7280';

  return {
    type: 'node',
    nodeType: 'button',
    styles: {
      padding: '8px 16px',
      backgroundColor: bg,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      ...otherProps.style
    },
    props: {
        ...otherProps
    },
    children: [
      {
        type: 'text',
        children: [text || 'Button']
      } as TextNode
    ]
  };
};

const mapLink = (props: any, children: ComponentSchema[]): ElementNode => {
  const { href, target, text, ...otherProps } = props;
  
  // If there are no children nodes (dragged in), use the text prop
  const linkChildren = children.length > 0 ? children : [
    {
      type: 'text',
      children: [text || 'Link']
    } as TextNode
  ];

  return {
    type: 'node',
    nodeType: 'a',
    props: {
      href,
      target,
      ...otherProps
    },
    children: linkChildren
  };
};

const mapList = (props: any, children: ComponentSchema[]): ElementNode => {
  const { listType, ...otherProps } = props;
  
  return {
    type: 'node',
    nodeType: listType === 'ol' ? 'ol' : 'ul',
    props: {
      ...otherProps
    },
    styles: {
      paddingLeft: '20px',
      margin: '10px 0',
      ...otherProps.style
    },
    children
  };
};

const mapListItem = (props: any, children: ComponentSchema[]): ElementNode => {
  const { text, ...otherProps } = props;

  // If there are no children nodes, use the text prop
  const itemChildren = children.length > 0 ? children : [
    {
      type: 'text',
      children: [text || 'List Item']
    } as TextNode
  ];

  return {
    type: 'node',
    nodeType: 'li',
    props: {
      ...otherProps
    },
    children: itemChildren
  };
};

const mapAccordion = (props: any, children: ComponentSchema[]): ElementNode => {
  return {
    type: 'node',
    nodeType: 'accordion',
    props: {
      ...props
    },
    children
  };
};

const mapAccordionItem = (props: any, children: ComponentSchema[]): ElementNode => {
  const { title, ...otherProps } = props;
  return {
    type: 'node',
    nodeType: 'accordion-item',
    props: {
      title,
      ...otherProps
    },
    children
  };
};
