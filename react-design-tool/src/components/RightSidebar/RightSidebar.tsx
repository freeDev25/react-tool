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
    <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      <div className="flex-1 p-2">
        {selected && selected.settings ? (
          <div>
            <div className="mb-4 pb-2 border-b border-gray-200 font-medium">
              {selected.name}
            </div>
            {React.createElement(selected.settings)}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Select a component to edit its properties</div>
        )}
      </div>
    </aside>
  );
};
