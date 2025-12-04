import baseSchemas from '../schemas/base.json';
import SchemaRenderer from './SchemaRenderer';

interface LeftSidebarProps {
  isOpen: boolean;
}

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
            {baseSchemas.schemas.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
