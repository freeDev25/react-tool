import { useDroppable } from '@dnd-kit/core';
import SchemaRenderer from './SchemaRenderer';
import type { CanvasElement } from '../types/schema.types';

interface CanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
}

export default function Canvas({ elements }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <main className="flex-1 bg-gray-100 overflow-auto">
      <div
        ref={setNodeRef}
        className={`h-full bg-white p-4 transition-colors ${
          isOver ? 'border-4 border-blue-400 bg-blue-50' : ' border-gray-200'
        }`}
      >
        {elements.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Drop elements here to start designing</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {elements.map((element) => (
              <SchemaRenderer 
                key={element.id}
                elementId={element.id}
                schema={element.schema}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
