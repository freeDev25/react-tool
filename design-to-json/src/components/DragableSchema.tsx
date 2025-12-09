import { useDraggable } from "@dnd-kit/core";
import type { ComponentSchema } from "../types/schema.types";

interface DraggableElementProps {
    id: string;
    title: string;
    schema: ComponentSchema;
    disabled?: boolean;
}

function DraggableSchema({ id, title, schema, disabled }: DraggableElementProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: { schema },
        disabled
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                opacity: isDragging ? 0.3 : (disabled ? 0.5 : 1),
                cursor: disabled ? 'not-allowed' : 'grab'
            }}
            className={`w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded transition-all ${
                disabled 
                    ? 'bg-gray-50 text-gray-400' 
                    : 'hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing'
            }`}
        >
            {title}
        </div>
    );
}

export default DraggableSchema;