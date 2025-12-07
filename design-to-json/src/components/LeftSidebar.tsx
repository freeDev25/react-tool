import baseSchemas from '../schemas/base.json';
import type { ComponentSchema } from '../types/schema.types';
import DraggableSchema from './DragableSchema';

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
      <div className="p-2 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Elements</h2>
          <div className="space-y-1">
            {baseSchemas.schemas.map((item, index) => (
                <DraggableSchema
                key={index}
                id={`sidebar-${index}`}
                title={item.title}
                schema={item.schema as ComponentSchema}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
