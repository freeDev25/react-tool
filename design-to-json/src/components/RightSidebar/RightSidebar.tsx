import { useState } from 'react';
import { LayoutSection, SpacingSection, BackgroundSection, BorderSection, TypographySection } from './StylePanel';
import type { ComponentSchema, NodeType } from '../../types/schema.types';
import baseSchemas from '../../schemas/base.json';

interface RightSidebarProps {
  isOpen: boolean;
  selectedNode?: ComponentSchema | null;
  onStyleChange?: (styles: React.CSSProperties) => void;
  onContentChange?: (content: string) => void;
  onNodeTypeChange?: (nodeType: NodeType) => void;
  onPropChange?: (props: Record<string, any>) => void;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className={`border-b border-gray-200 last:border-0 flex flex-col ${isOpen ? 'flex-1 min-h-0' : 'shrink-0'}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors shrink-0"
      >
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 overflow-y-auto flex-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function RightSidebar({ isOpen, selectedNode, onStyleChange, onContentChange, onNodeTypeChange, onPropChange }: RightSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(() => {
    if (!selectedNode || selectedNode.type === 'text') return 'layoutAndStyles';
    
    const matchingSchema = baseSchemas.schemas.find(s => 
      s.nodeTypes?.includes(selectedNode.nodeType as string)
    );
    const availableNodeTypes = matchingSchema?.nodeTypes || [];
    
    return availableNodeTypes.length > 0 ? 'element' : 'layoutAndStyles';
  });

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  if (!isOpen) return null;

  // If no node is selected, show empty state or placeholder
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 text-center text-gray-500 text-sm mt-10">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  // Handle Text Node Selection
  if (selectedNode.type === 'text') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="font-semibold text-gray-800">Text Content</h2>
          <div className="text-xs text-gray-500">Text Node</div>
        </div>
        <div className="p-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={selectedNode.children?.[0] || ''}
            onChange={(e) => onContentChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            placeholder="Enter text content..."
          />
        </div>
      </div>
    );
  }

  const currentStyles = selectedNode.type === 'node' ? selectedNode.styles || {} : {};
  const handleStyleChange = onStyleChange || (() => {});

  // Find matching schema definition to get available node types
  const matchingSchema = baseSchemas.schemas.find(s => 
    s.nodeTypes?.includes(selectedNode.nodeType as string)
  );
  const availableNodeTypes = matchingSchema?.nodeTypes || [];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-gray-800">Properties</h2>
        <div className="text-xs text-gray-500">
          {selectedNode.type === 'node' ? selectedNode.nodeType : 'Text Node'}
        </div>
      </div>
      
      {availableNodeTypes.length > 0 && (
        <AccordionItem 
          title="Element" 
          isOpen={activeSection === 'element'} 
          onToggle={() => toggleSection('element')}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Html Tag
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedNode.nodeType}
                onChange={(e) => onNodeTypeChange?.(e.target.value as NodeType)}
              >
                {availableNodeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </AccordionItem>
      )}

      <AccordionItem 
        title="Layout and Styles" 
        isOpen={activeSection === 'layoutAndStyles'} 
        onToggle={() => toggleSection('layoutAndStyles')}
      >
        <div className="space-y-6">
          <LayoutSection currentStyles={currentStyles} onStyleChange={handleStyleChange} />
          
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Spacing</h3>
            <SpacingSection currentStyles={currentStyles} onStyleChange={handleStyleChange} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Fills</h3>
            <BackgroundSection currentStyles={currentStyles} onStyleChange={handleStyleChange} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Borders</h3>
            <BorderSection currentStyles={currentStyles} onStyleChange={handleStyleChange} />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem 
        title="Typography" 
        isOpen={activeSection === 'typography'} 
        onToggle={() => toggleSection('typography')}
      >
        <TypographySection currentStyles={currentStyles} onStyleChange={handleStyleChange} />
      </AccordionItem>

      <AccordionItem 
        title="Props" 
        isOpen={activeSection === 'props'} 
        onToggle={() => toggleSection('props')}
      >
        <div className="space-y-3">
          {selectedNode.type === 'node' && selectedNode.props && Object.keys(selectedNode.props).length > 0 ? (
            Object.entries(selectedNode.props).map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-1">
                <label className="text-xs font-medium text-gray-600">{key}</label>
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => onPropChange?.({ [key]: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic p-2 text-center">
              No properties available
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
}