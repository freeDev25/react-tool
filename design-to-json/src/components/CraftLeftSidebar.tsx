import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Container } from './user/Container';
import { Text } from './user/Text';
import { Button } from './user/Button';
import { Image } from './user/Image';
import { Input } from './user/Input';
import { Link } from './user/Link';
import { List, ListItem } from './user/List';
import { Accordion, AccordionItem } from '../craft/utils/Acordian';
import baseSchemas from '../schemas/base.json';
import type { ComponentSchema } from '../types/schema.types';

const createCraftElement = (schema: ComponentSchema): React.ReactElement => {
  if (schema.type === 'text') {
    return <Text text={schema.children[0] as string} />;
  }

  const { nodeType, props, styles, children } = schema;

  // Map children recursively
  const childElements = children?.map((child, index) => (
    <React.Fragment key={index}>
      {createCraftElement(child as ComponentSchema)}
    </React.Fragment>
  ));

  switch (nodeType) {
    case 'div':
    case 'section':
    case 'article':
    case 'header':
    case 'footer':
    case 'main':
    case 'aside':
    case 'nav':
      return (
        <Element is={Container} canvas style={styles} {...props}>
          {childElements}
        </Element>
      );
    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'span':
      // For text nodes that are containers (like p with text inside), we need to handle them carefully.
      // Our Text component handles tagName.
      // If it has children that are text nodes, we extract the text.
      let textContent = '';
      if (children && children.length > 0 && children[0].type === 'text') {
        textContent = children[0].children[0];
      }
      return <Text tagName={nodeType} text={textContent} style={styles} {...props} />;
    case 'button':
      let buttonText = 'Button';
      if (children && children.length > 0 && children[0].type === 'text') {
        buttonText = children[0].children[0];
      }
      return <Button text={buttonText} style={styles} {...props} />;
    case 'img':
      return <Image src={props?.src as string} alt={props?.alt as string} width={props?.width as string} height={props?.height as string} style={styles} />;
    case 'input':
      return <Input type={props?.type as string} placeholder={props?.placeholder as string} style={styles} />;
    case 'a':
      return (
        <Element is={Link} canvas href={props?.href as string} target={props?.target as string} style={styles} {...props}>
          {childElements}
        </Element>
      );
    case 'ul':
    case 'ol':
      return (
        <Element is={List} canvas tag={nodeType} style={styles} {...props}>
          {childElements}
        </Element>
      );
    case 'li':
      return (
        <Element is={ListItem} canvas style={styles} {...props}>
          {childElements}
        </Element>
      );
    case 'accordion':
      return (
        <Element is={Accordion} canvas style={styles} {...props}>
          {childElements}
        </Element>
      );
    case 'accordion-item':
      return (
        <Element is={AccordionItem} canvas style={styles} {...props}>
          {childElements}
        </Element>
      );
    default:
      return <Element is={Container} canvas style={styles} {...props}>{childElements}</Element>;
  }
};

export default function CraftLeftSidebar() {
  const { connectors } = useEditor();

  

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Components</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {baseSchemas.schemas.map((item, index) => (
            <button
                key={index}
                ref={(ref: HTMLButtonElement | null) => {
                    if (ref) {
                        connectors.create(ref, createCraftElement(item.schema as ComponentSchema));
                    }
                }}
                className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex flex-col items-center gap-2 cursor-move text-center h-full justify-center"
            >
                <span className="text-xs font-medium">{item.title}</span>
            </button>
        ))}
      </div>
    </aside>
  );
}
