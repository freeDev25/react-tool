import React from 'react';
import { useEditor } from '@craftjs/core';

export default function CraftRightSidebar() {
  const { selected, actions } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selectedNode;

    if (currentNodeId) {
      selectedNode = {
        id: currentNodeId,
        data: state.nodes[currentNodeId].data,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings
      };
    }

    return {
      selected: selectedNode,
    };
  });

  if (!selected) {
    return (
      <aside className="w-64 bg-white border-l border-gray-200 p-4">
        <div className="text-gray-400 text-center mt-10">
          Select an element to edit properties
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-l border-gray-200 p-4">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">
          {selected.data.displayName}
        </h2>
        <div className="text-xs text-gray-500 mt-1">ID: {selected.id}</div>
      </div>

      {selected.settings && React.createElement(selected.settings)}
      
      {!selected.settings && (
        <div className="text-sm text-gray-500">
          No settings available for this component.
        </div>
      )}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <button 
            onClick={() => {
                actions.delete(selected.id);
            }}
            className="w-full py-2 px-4 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
        >
            Delete Component
        </button>
      </div>
    </aside>
  );
}
