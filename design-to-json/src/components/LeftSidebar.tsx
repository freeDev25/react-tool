interface LeftSidebarProps {
  isOpen: boolean;
}

const elements = [
  { id: 'text', label: 'Text' },
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'container', label: 'Container' },
];

export default function LeftSidebar({ isOpen }: LeftSidebarProps) {
  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Elements</h2>
          <div className="space-y-1">
            {elements.map((element) => (
              <button
                key={element.id}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white rounded transition-colors"
              >
                {element.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
