import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { NodeType } from '../types/schema.types';
import type { DropPosition } from '../utils/schema.utils';

interface DroppableNodeProps {
  children: React.ReactNode;
  elementId: string;
  path: number[];
  tag: NodeType;
  nodeProps: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties };
}

export function DroppableNode({ 
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

export function DropZone({ elementId, path, position, isEmpty, isActive }: DropZoneProps) {
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
