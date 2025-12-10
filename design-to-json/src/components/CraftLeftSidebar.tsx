import { useEditor, Element } from '@craftjs/core';
import { Container } from './user/Container';
import { Text } from './user/Text';
import { Button } from './user/Button';

export default function CraftLeftSidebar() {
  const { connectors } = useEditor();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Components</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                  connectors.create(ref, <Element is={Container} canvas />);
              }
          }}
          className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex flex-col items-center gap-2 cursor-move"
        >
          <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded" />
          <span className="text-xs">Container</span>
        </button>

        <button
          ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                  connectors.create(ref, <Text text="New Text" />);
              }
          }}
          className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex flex-col items-center gap-2 cursor-move"
        >
          <span className="text-lg font-serif">T</span>
          <span className="text-xs">Text</span>
        </button>

        <button
          ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                  connectors.create(ref, <Button text="Click Me" />);
              }
          }}
          className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex flex-col items-center gap-2 cursor-move"
        >
          <div className="w-6 h-2 bg-blue-500 rounded" />
          <span className="text-xs">Button</span>
        </button>
      </div>
    </aside>
  );
}
