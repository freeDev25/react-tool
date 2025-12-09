import baseSchemas from '../schemas/base.json';
import type { ComponentSchema, CanvasElement } from '../types/schema.types';
import DraggableSchema from './DragableSchema';

interface LeftSidebarProps {
  isOpen: boolean;
  disabled?: boolean;
  savedSchemas?: Record<string, CanvasElement[]>;
}

export default function LeftSidebar({ isOpen, disabled = false, savedSchemas = {} }: LeftSidebarProps) {
  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden flex flex-col`}
    >
      <div className="p-2 space-y-4 overflow-y-auto flex-1">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Elements</h2>
          <div className="space-y-1">
            {baseSchemas.schemas.map((item, index) => (
                <DraggableSchema
                key={index}
                id={`sidebar-${index}`}
                title={item.title}
                schema={item.schema as ComponentSchema}
                disabled={disabled}
              />
            ))}
          </div>
        </div>

        {Object.keys(savedSchemas).length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2 pt-4 border-t border-gray-200">Saved Components</h2>
            <div className="space-y-1">
              {Object.entries(savedSchemas).map(([name, elements]) => {
                // Convert elements to a single schema
                let schema: ComponentSchema;
                if (elements.length === 1) {
                  schema = elements[0].schema;
                } else {
                  // Wrap multiple root elements in a div
                  schema = {
                    type: 'node',
                    nodeType: 'div',
                    children: elements.map(e => e.schema)
                  };
                }
                
                return (
                  <DraggableSchema
                    key={name}
                    id={`saved-${name}`}
                    title={name}
                    schema={schema}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
