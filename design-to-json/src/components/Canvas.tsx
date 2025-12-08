import { useDroppable } from '@dnd-kit/core';
import SchemaRenderer from './SchemaRenderer';
import type { CanvasElement } from '../types/schema.types';
import EmptyCanvas from './util/EmptyCanvas';

interface CanvasProps {
    elements: CanvasElement[];
    onElementsChange: (elements: CanvasElement[]) => void;
    selectedElementId: string | null;
    selectedPath: number[] | null;
    onSelect: (elementId: string | null, path: number[] | null) => void;
}

export default function Canvas({
    elements,
    selectedElementId,
    selectedPath,
    onSelect
}: CanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
    });

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Only clear if clicking directly on the canvas background
        if (e.target === e.currentTarget) {
            onSelect(null, null);
        }
    };

    let content = null;

    if(elements.length === 0) {
        content = <EmptyCanvas />;
    } else {
        content = (
            <div className="space-y-2">
                {elements.map((element) => (
                    <SchemaRenderer
                        key={element.id}
                        elementId={element.id}
                        schema={element.schema}
                        selectedElementId={selectedElementId}
                        selectedPath={selectedPath}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        );
    }

    return (
        <main className="flex-1 bg-gray-100 overflow-auto">
            <div
                ref={setNodeRef}
                onClick={handleBackgroundClick}
                className={`h-full bg-white p-4 transition-colors ${isOver ? 'border-4 border-blue-400 bg-blue-50' : ' border-gray-200'
                    }`}
            >
                {content}
            </div>
        </main>
    );
}
