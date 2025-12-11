import { useEditor, Element } from '@craftjs/core';
import { Container } from '../../user/Container';
import { Text } from '../../user/Text';
import { Button } from '../../user/Button';

export const LeftSidebar = () => {
  const { connectors } = useEditor();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-2 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Components</h2>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                connectors.create(ref, <Element is={Container} canvas />);
              }
            }}
            className="aspect-square bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
              <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
            </div>
            <span className="text-xs font-medium text-gray-600">Container</span>
          </button>
          <button
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                connectors.create(ref, <Text text="Hi world" />);
              }
            }}
            className="aspect-square bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
              <span className="text-gray-600 font-serif font-bold text-lg">T</span>
            </div>
            <span className="text-xs font-medium text-gray-600">Text</span>
          </button>
          <button
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) {
                connectors.create(ref, <Button text="Click me" />);
              }
            }}
            className="aspect-square bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-500 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
              <div className="w-5 h-2 bg-gray-400 rounded-sm" />
            </div>
            <span className="text-xs font-medium text-gray-600">Button</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
