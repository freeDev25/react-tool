import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DropAnimation } from '@dnd-kit/core';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Canvas from '../components/Canvas';
import NameModal from '../components/NameModal';
import type { CanvasElement, ComponentSchema, NodeType } from '../types/schema.types';
import { generateElementId, insertSchemaAtPosition, type DropPosition, getNodeByPath, updateNodeStyle, updateTextNodeContent, updateNodeType, updateNodeProps, deleteNodeFromSchema } from '../utils/schema.utils';

export default function Home() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);
  
  const [componentName, setComponentName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeSchema, setActiveSchema] = useState<ComponentSchema | null>(null);

  // Derive selected node
  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null;
  const selectedNode = selectedElement && selectedPath 
    ? getNodeByPath(selectedElement.schema, selectedPath)
    : null;

  const handleSelect = (elementId: string | null, path: number[] | null) => {
    setSelectedElementId(elementId);
    setSelectedPath(path);
  };

  const handleNewComponent = () => {
    setIsModalOpen(true);
  };

  const handleSaveName = (name: string) => {
    setComponentName(name);
    setIsModalOpen(false);
    // Optionally clear canvas when starting new component
    // setElements([]); 
  };

  const handleSaveSchema = () => {
    if (!componentName) return;
    
    const savedSchemas = JSON.parse(localStorage.getItem('saved-schemas') || '{}');
    savedSchemas[componentName] = elements;
    localStorage.setItem('saved-schemas', JSON.stringify(savedSchemas));
    
    alert(`Schema for "${componentName}" saved successfully!`);
  };

  const handleStyleChange = (newStyles: React.CSSProperties) => {
    if (!selectedElementId || !selectedPath) return;

    setElements(prevElements => 
      prevElements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            schema: updateNodeStyle(el.schema, selectedPath, newStyles)
          };
        }
        return el;
      })
    );
  };

  const handleContentChange = (newContent: string) => {
    if (!selectedElementId || !selectedPath) return;

    setElements(prevElements => 
      prevElements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            schema: updateTextNodeContent(el.schema, selectedPath, newContent)
          };
        }
        return el;
      })
    );
  };

  const handleNodeTypeChange = (newNodeType: NodeType) => {
    if (!selectedElementId || !selectedPath) return;

    setElements(prevElements => 
      prevElements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            schema: updateNodeType(el.schema, selectedPath, newNodeType)
          };
        }
        return el;
      })
    );
  };

  const handlePropChange = (newProps: Record<string, any>) => {
    if (!selectedElementId || !selectedPath) return;

    setElements(prevElements => 
      prevElements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            schema: updateNodeProps(el.schema, selectedPath, newProps)
          };
        }
        return el;
      })
    );
  };

  const handleDelete = () => {
    if (!selectedElementId) return;

    // If no path or empty path, delete the whole element
    if (!selectedPath || selectedPath.length === 0) {
      setElements(prev => prev.filter(el => el.id !== selectedElementId));
      handleSelect(null, null);
      return;
    }

    // Otherwise delete nested node
    setElements(prev => prev.map(el => {
      if (el.id === selectedElementId) {
        return {
          ...el,
          schema: deleteNodeFromSchema(el.schema, selectedPath)
        };
      }
      return el;
    }));
    handleSelect(null, null); // Clear selection after delete
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!componentName) return; // Prevent dragging if no component name set
    setActiveId(event.active.id as string);
    setActiveSchema(event.active.data.current?.schema as ComponentSchema || null);
  };

  const dropAnimation: DropAnimation = {
    duration: 0,
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0',
        },
      },
    }),
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveSchema(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // console.log('Drag End Event:', event);
    console.log('over Item:', over);
    
    // Reset drag state immediately
    setActiveId(null);
    setActiveSchema(null);

    if (!over) return;

    // Get the schema from the dragged item
    const schema = active.data.current?.schema as ComponentSchema | undefined;
    if (!schema) return;

    // Check if dropping on canvas (new element) or into existing element
    if (over.id === 'canvas') {
      // Add new element to canvas
      const newElement: CanvasElement = {
        id: generateElementId(),
        schema
      };
      setElements([...elements, newElement]);
      return;
    }

    const dropData = over.data.current;

    if (dropData?.acceptsChildren && dropData.elementId) {
      const targetElementId = dropData.elementId as string;
      const targetPath = (dropData.path || []) as number[];
      const position: DropPosition = (dropData.position as DropPosition) || 'inside';

      setElements(prevElements => 
        prevElements.map(el => {
          if (el.id === targetElementId) {
            const updatedSchema = insertSchemaAtPosition(el.schema, targetPath, position, schema);
            return {
              ...el,
              schema: updatedSchema
            };
          }
          return el;
        })
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          handleDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, selectedPath]);

  console.log('Canvas Elements:', elements);

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col h-screen">
        <Header
          onLeftToggle={() => setLeftOpen(!leftOpen)}
          onRightToggle={() => setRightOpen(!rightOpen)}
          componentName={componentName}
          onNewComponent={handleNewComponent}
          onSaveSchema={handleSaveSchema}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar isOpen={leftOpen} disabled={!componentName} />
          <Canvas 
            elements={elements} 
            onElementsChange={setElements}
            selectedElementId={selectedElementId}
            selectedPath={selectedPath}
            onSelect={handleSelect}
            disabled={!componentName}
          />
          <RightSidebar 
            key={selectedElementId && selectedPath ? `${selectedElementId}-${selectedPath.join('-')}` : 'no-selection'}
            isOpen={rightOpen} 
            selectedNode={selectedNode}
            onStyleChange={handleStyleChange}
            onContentChange={handleContentChange}
            onNodeTypeChange={handleNodeTypeChange}
            onPropChange={handlePropChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeSchema ? (
          <div className="bg-white border-2 border-blue-500 px-4 py-2 rounded shadow-2xl opacity-90">
            {activeSchema.type === 'node' && activeSchema.nodeType}
          </div>
        ) : null}
      </DragOverlay>
      
      <NameModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveName}
      />
    </DndContext>
  );
}
