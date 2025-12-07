import { useDraggable } from "@dnd-kit/core";
import type { ComponentSchema } from "../types/schema.types";

interface DraggableElementProps {
    id: string;
    title: string;
    schema: ComponentSchema;
}

function DraggableSchema({ id, title, schema }: DraggableElementProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: { schema }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                opacity: isDragging ? 0.3 : 1,
                cursor: 'grab'
            }}
            className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-all active:cursor-grabbing"
        >
            {title}
        </div>
    );
}

export default DraggableSchema;