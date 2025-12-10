import React from 'react';
import { useEditor } from '@craftjs/core';
import { Layers, useLayer } from '@craftjs/layers';

const LayerItem = () => {
  const {
    id,
    depth,
    expanded,
    connectors: { drag, layer },
    actions: { toggleLayer },
  } = useLayer((layer) => ({
    expanded: layer.expanded,
  }));

  const { hasChildComponents } = useEditor((state) => {
      return {
          hasChildComponents: state.nodes[id] && state.nodes[id].data.nodes && state.nodes[id].data.nodes.length > 0
      }
  });

  const { selected } = useEditor((state) => ({
    selected: state.events.selected.has(id),
  }));

  return (
    <div 
      ref={(ref: HTMLDivElement | null) => { if (ref) drag(ref); }}
      className={`flex flex-col`}
    >
      <div
        ref={(ref: HTMLDivElement | null) => { if (ref) layer(ref); }}
        className={`flex items-center py-2 pr-2 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${selected ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <div 
            className="w-4 h-4 mr-1 flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={(e) => {
                e.stopPropagation();
                toggleLayer();
            }}
        >
            {hasChildComponents && (
                <span className={`transform transition-transform text-[10px] ${expanded ? 'rotate-90' : ''}`}>
                    ▶
                </span>
            )}
        </div>
        <div className="flex-1 text-sm select-none truncate font-medium">
            {/* We need to get the display name here, but useLayer doesn't provide it directly easily without another selector */}
            {/* For now, let's just show the ID or a generic name. Better: use the node's displayName */}
            <NodeName id={id} />
        </div>
      </div>
    </div>
  );
};

const NodeName = ({ id }: { id: string }) => {
    const { displayName } = useEditor((state) => ({
        displayName: state.nodes[id] && state.nodes[id].data.displayName
    }));
    return <>{displayName || id}</>;
}

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

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {!selected ? (
          <div className="text-gray-400 text-center mt-10">
            Select an element to edit properties
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="h-1/3 border-t border-gray-200 flex flex-col bg-gray-50">
          <div className="p-2 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase bg-gray-100">
            Layers
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             <Layers expandRootOnLoad={true} renderLayer={LayerItem} />
          </div>
      </div>
    </aside>
  );
}
