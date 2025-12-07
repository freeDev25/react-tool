import React from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import type { ComponentSchema, ElementNode, NodeType } from '../types/schema.types';
import { canAcceptChildren, type DropPosition } from '../utils/schema.utils';

interface SchemaRendererProps {
  schema: ComponentSchema;
  elementId: string;
  path?: number[];
}

interface DroppableNodeProps {
  children: React.ReactNode;
  elementId: string;
  path: number[];
  tag: NodeType;
  nodeProps: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties };
}

function DroppableNode({ 
  children, 
  elementId, 
  path, 
  tag,
  nodeProps 
}: DroppableNodeProps) {
  const droppableId = `${elementId}-${path.join('-') || 'root'}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      acceptsChildren: true,
      elementId,
      path,
      position: 'inside' as DropPosition
    }
  });

  const style: React.CSSProperties = {
    ...(nodeProps.style || {}),
    ...(isOver && {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    })
  };

  return React.createElement(tag as string, { ref: setNodeRef, ...nodeProps, style }, children);
}

interface DropZoneProps {
  elementId: string;
  path: number[];
  position: DropPosition;
  isEmpty?: boolean;
  isActive: boolean;
}

function DropZone({ elementId, path, position, isEmpty, isActive }: DropZoneProps) {
  const droppableId = `${elementId}-${path.join('-') || 'root'}-${position}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      acceptsChildren: true,
      elementId,
      path,
      position
    }
  });

  if (!isActive) return null;

  const baseStyles: React.CSSProperties =
    position === 'inside'
      ? {
          width: '100%',
          minHeight: isEmpty ? 48 : 16,
          border: '2px dashed transparent',
          margin: '8px 0'
        }
      : {
          width: '100%',
          height: isOver ? 12 : 6,
          borderRadius: 9999,
          margin: '4px 0'
        };

  const activeStyles: React.CSSProperties =
    position === 'inside'
      ? {
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.15)'
        }
      : {
          backgroundColor: 'rgba(59, 130, 246, 0.3)'
        };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...baseStyles,
        ...(isOver ? activeStyles : {}),
        transition: 'all 0.15s ease'
      }}
    />
  );
}

export default function SchemaRenderer({ schema, elementId, path = [] }: SchemaRendererProps) {
  const { active } = useDndContext();
  const isDragging = Boolean(active);

  const renderNode = (node: ComponentSchema, currentPath: number[] = []): React.ReactNode => {
    if (!node) return null;

    const isRoot = currentPath.length === 0;

    // Handle text nodes
    if (node.type === 'text') {
      return node.children.join('');
    }

    // Handle HTML element nodes
    const elementNode = node as ElementNode;
    const Tag = elementNode.nodeType;
    const props: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties } = {
      style: elementNode.styles || elementNode.style || {},
      ...elementNode.props
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
