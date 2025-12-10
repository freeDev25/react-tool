import React from 'react';
import { useNode } from '@craftjs/core';

interface ContainerProps {
  background?: string;
  padding?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container = ({ background, padding = '20px', children, style }: ContainerProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref: HTMLDivElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{ 
        background, 
        padding, 
        border: '1px dashed #ccc',
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        ...style 
      }}
    >
      {children}
    </div>
  );
};

import { useEditor } from '@craftjs/core';

export const ContainerSettings = () => {
  const { actions: { setProp }, props, id } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    if (currentNodeId) {
        return {
            id: currentNodeId,
            props: state.nodes[currentNodeId].data.props
        }
    }
    return { id: null, props: null };
  });

  if (!props || !id) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Background Color</label>
        <div className="flex items-center gap-2">
            <input 
                type="color" 
                value={props.background} 
                onChange={(e) => {
                    const color = e.target.value;
                    setProp(id, (props: any) => props.background = color);
                }}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-400">{props.background}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Padding</label>
        <input 
            type="text" 
            value={props.padding} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.padding = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#ffffff',
    padding: '20px'
  },
  related: {
    settings: ContainerSettings
  }
};
