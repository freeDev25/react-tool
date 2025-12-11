import { useEditor } from '@craftjs/core';
import React from 'react';

export const RightSidebar = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings
      };
    }

    return {
      selected
    };
  });

  return (
    <aside className="w-64 bg-[#2c2c2c] border-l border-black flex flex-col h-full text-white">
      <div className="px-4 py-3 border-b border-black flex items-center justify-end gap-2">
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Publish
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-[#444] text-white rounded hover:bg-[#555] transition-colors">
          Share
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 border-b border-black">
            <h2 className="text-xs font-bold text-[#a0a0a0] uppercase tracking-wider">Properties</h2>
        </div>
        <div className="p-3">
            {selected && selected.settings ? (
            <div>
                <div className="mb-4 pb-2 border-b border-[#444] font-medium text-sm flex items-center justify-between">
                    <span>{selected.name}</span>
                    <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded text-white">Selected</span>
                </div>
                <div className="space-y-4">
                    {React.createElement(selected.settings)}
                </div>
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded mb-2"></div>
                <div className="text-xs text-gray-400">Select a layer to edit properties</div>
            </div>
            )}
        </div>
      </div>
    </aside>
  );
};
