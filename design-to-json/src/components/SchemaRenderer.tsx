import { useDndContext } from '@dnd-kit/core';
import React from 'react';
import type { ComponentSchema, ElementNode } from '../types/schema.types';
import { canAcceptChildren } from '../utils/schema.utils';
import { DroppableNode, DropZone } from './DnDComponents';

interface SchemaRendererProps {
  schema: ComponentSchema;
  elementId: string;
  path?: number[];
  selectedElementId: string | null;
  selectedPath: number[] | null;
  onSelect: (elementId: string, path: number[]) => void;
}

export default function SchemaRenderer({ 
  schema, 
  elementId, 
  path = [],
  selectedElementId,
  selectedPath,
  onSelect
}: SchemaRendererProps) {
  const { active } = useDndContext();
  const isDragging = Boolean(active);

  const renderNode = (node: ComponentSchema, currentPath: number[] = []): React.ReactNode => {
    if (!node) return null;

    const isRoot = currentPath.length === 0;

    // Handle text nodes
    if (node.type === 'text') {
      return (
        <span 
          key={currentPath.join('-')}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(elementId, currentPath);
          }}
          style={{
            cursor: 'pointer',
            ...(selectedElementId === elementId && 
               selectedPath?.length === currentPath.length &&
               selectedPath.every((val, index) => val === currentPath[index])
               ? { outline: '2px solid #3b82f6', outlineOffset: '2px' } 
               : {})
          }}
        >
          {node.children.join('')}
        </span>
      );
    }

    // Handle HTML element nodes
    const elementNode = node as ElementNode;
    const Tag = elementNode.nodeType;
    
    const isSelected = selectedElementId === elementId && 
      selectedPath?.length === currentPath.length &&
      selectedPath.every((val, index) => val === currentPath[index]);

    const props: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties } = {
      style: {
        ...(elementNode.styles || elementNode.style || {}),
        ...(isSelected ? {
          outline: '2px solid #3b82f6',
          outlineOffset: '2px',
        } : {})
      },
      ...elementNode.props,
      onClick: (e) => {
        e.stopPropagation();
        onSelect(elementId, currentPath);
      }
    };

    // Render children recursively
    const hasChildren = Boolean(elementNode.children && elementNode.children.length > 0);
    const children = hasChildren
      ? elementNode.children!.map((child, index) => (
          <React.Fragment key={[...currentPath, index].join('-')}>
            {renderNode(child, [...currentPath, index])}
          </React.Fragment>
        ))
      : null;

    const renderContent = () => {
      // Wrap in droppable for container elements that can accept children
      if (canAcceptChildren(elementNode)) {
        return (
          <DroppableNode 
            elementId={elementId} 
            path={currentPath} 
            tag={Tag}
            nodeProps={props}
          >
            {hasChildren ? children : (
              <DropZone
                elementId={elementId}
                path={currentPath}
                position="inside"
                isEmpty
                isActive={isDragging}
              />
            )}
          </DroppableNode>
        );
      }
      return React.createElement(Tag as string, props, children);
    };

    if (isRoot) {
      return renderContent();
    }

    return (
      <>
        <DropZone
          elementId={elementId}
          path={currentPath}
          position="before"
          isActive={isDragging}
        />
        {renderContent()}
        <DropZone
          elementId={elementId}
          path={currentPath}
          position="after"
          isActive={isDragging}
        />
      </>
    );
  };

  return <>{renderNode(schema, path)}</>;
}
