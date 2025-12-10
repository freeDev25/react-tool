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
    disabled?: boolean;
    isPreviewMode?: boolean;
}

export default function Canvas({
    elements,
    selectedElementId,
    selectedPath,
    onSelect,
    disabled = false,
    isPreviewMode = false
}: CanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
        disabled: disabled || isPreviewMode
    });

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Only clear if clicking directly on the canvas background
        if (e.target === e.currentTarget) {
            onSelect(null, null);
        }
    };

    let content = null;

    if (disabled) {
        content = (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg font-medium">Canvas is inactive</p>
                <p className="text-sm mt-2">Click "New Component" to start designing</p>
            </div>
        );
    } else if(elements.length === 0) {
        content = <EmptyCanvas />;
    } else {
        content = (
            <div className="space-y-2">
                {elements.map(element => (
                    <SchemaRenderer
                        key={element.id}
                        schema={element.schema}
                        elementId={element.id}
                        selectedElementId={selectedElementId}
                        selectedPath={selectedPath}
                        onSelect={onSelect}
                        isPreviewMode={isPreviewMode}
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
