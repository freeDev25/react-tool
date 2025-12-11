import React, { useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';

interface AccordionProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Accordion = ({ children, style }: AccordionProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref: HTMLDivElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        ...style 
      }}
    >
      {children}
    </div>
  );
};

export const AccordionSettings = () => {
    return <div>Accordion Settings</div>;
};

Accordion.craft = {
  displayName: 'Accordion',
  props: {},
  related: {
    settings: AccordionSettings
  }
};

interface AccordionItemProps {
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const AccordionItem = ({ title = 'Accordion Item', children, style }: AccordionItemProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      ref={(ref: HTMLDivElement | null) => {
          if (ref) {
              connect(drag(ref));
          }
      }}
      style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '4px',
        overflow: 'hidden',
        ...style 
      }}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 16px', 
          background: '#f9fafb', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isOpen ? '1px solid #e5e7eb' : 'none',
          fontWeight: 500,
          fontSize: '14px',
          color: '#374151'
        }}
      >
        <span>{title}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px' }}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div style={{ padding: '16px', background: '#ffffff', minHeight: '50px' }}>
           {children}
        </div>
      )}
    </div>
  );
};

export const AccordionItemSettings = () => {
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
        <label className="text-xs text-gray-500">Title</label>
        <input 
            type="text" 
            value={props.title} 
            onChange={(e) => {
                const value = e.target.value;
                setProp(id, (props: any) => props.title = value);
            }}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
        />
      </div>
    </div>
  );
};

AccordionItem.craft = {
  displayName: 'Accordion Item',
  props: {
    title: 'Accordion Item'
  },
  related: {
    settings: AccordionItemSettings
  }
};
