import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import SchemaRenderer from './SchemaRenderer';
import type { CanvasElement } from '../types/schema.types';
import EmptyCanvas from './util/EmptyCanvas';
import { cn } from '../utils/cn';

interface CanvasProps {
    elements: CanvasElement[];
    onElementsChange: (elements: CanvasElement[]) => void;
    selectedElementId: string | null;
    selectedPath: number[] | null;
    onSelect: (elementId: string | null, path: number[] | null) => void;
    disabled?: boolean;
    isPreviewMode?: boolean;
    viewMode?: 'design' | 'preview' | 'json';
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
};

export default function Canvas({
    elements,
    selectedElementId,
    selectedPath,
    onSelect,
    disabled = false,
    isPreviewMode = false,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false
}: CanvasProps) {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const [showGrid, setShowGrid] = useState(true);

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
            <div className="space-y-2 min-h-full">
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
        <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden relative">
            {/* Canvas Toolbar */}
            <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 rounded p-0.5">
                        <button
                            onClick={() => setDevice('desktop')}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                device === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="Desktop (100%)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </button>
                        <button
                            onClick={() => setDevice('tablet')}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                device === 'tablet' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="Tablet (768px)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </button>
                        <button
                            onClick={() => setDevice('mobile')}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                device === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="Mobile (375px)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={cn(
                            "p-1.5 rounded transition-all",
                            showGrid ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                        )}
                        title="Toggle Grid"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo (Ctrl+Z)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                    </button>
                </div>
            </div>

            {/* Canvas Workspace */}
            <div 
                className="flex-1 overflow-auto p-8 flex justify-center relative"
                onClick={handleBackgroundClick}
            >
                {/* Grid Background */}
                {showGrid && !disabled && (
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        }}
                    />
                )}

                {/* Device Frame */}
                <div 
                    ref={setNodeRef}
                    className={cn(
                        "bg-white shadow-sm transition-all duration-300 ease-in-out relative min-h-[calc(100vh-12rem)]",
                        isOver && !disabled ? 'ring-4 ring-blue-400/50' : '',
                        disabled ? 'opacity-50' : 'shadow-lg'
                    )}
                    style={{
                        width: DEVICE_WIDTHS[device],
                        maxWidth: '100%'
                    }}
                >
                    {content}
                </div>
            </div>
        </main>
    );
}
