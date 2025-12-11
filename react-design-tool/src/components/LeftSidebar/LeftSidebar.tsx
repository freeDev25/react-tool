import { useEditor, Element } from '@craftjs/core';
import { Container } from '../user/Container';
import { Text } from '../user/Text';
import { Button } from '../user/Button';

export const LeftSidebar = () => {
  const { connectors } = useEditor();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-2 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Components</h2>
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2">
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(ref, <Element is={Container} canvas />);
            }
          }}
          className="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-gray-50 text-left"
        >
          Container
        </button>
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(ref, <Text text="Hi world" />);
            }
          }}
          className="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-gray-50 text-left"
        >
          Text
        </button>
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(ref, <Button text="Click me" />);
            }
          }}
          className="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-gray-50 text-left"
        >
          Button
        </button>
      </div>
    </aside>
  );
};
