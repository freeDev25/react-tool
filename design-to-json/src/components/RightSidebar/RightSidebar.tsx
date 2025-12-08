import StylePanel from './StylePanel';
import type { ComponentSchema } from '../../types/schema.types';

interface RightSidebarProps {
  isOpen: boolean;
  selectedNode?: ComponentSchema | null;
  onStyleChange?: (styles: React.CSSProperties) => void;
}

export default function RightSidebar({ isOpen, selectedNode, onStyleChange }: RightSidebarProps) {
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

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Properties</h2>
        <div className="text-xs text-gray-500 mt-1">
          {selectedNode.type === 'node' ? selectedNode.nodeType : 'Text Node'}
        </div>
      </div>
      
      <StylePanel 
        currentStyles={selectedNode.type === 'node' ? selectedNode.styles || {} : {}} 
        onStyleChange={onStyleChange || (() => {})} 
      />
      
      {/* Additional panels can go here */}
    </div>
  );
}
