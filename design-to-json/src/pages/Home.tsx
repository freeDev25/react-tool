import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DropAnimation } from '@dnd-kit/core';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Canvas from '../components/Canvas';
import NameModal from '../components/NameModal';
import LoadSchemaModal from '../components/LoadSchemaModal';
import SelectionOverlay from '../components/SelectionOverlay';
import UnsavedChangesModal from '../components/UnsavedChangesModal';
import type { CanvasElement, ComponentSchema, NodeType } from '../types/schema.types';
import { useToast } from '../context/ToastContext';
import { generateElementId, insertSchemaAtPosition, type DropPosition, getNodeByPath, updateNodeStyle, updateTextNodeContent, updateNodeType, updateNodeProps, deleteNodeFromSchema } from '../utils/schema.utils';

export default function Home() {
  const { showToast } = useToast();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);
  
  const [componentName, setComponentName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedSchemas, setSavedSchemas] = useState<Record<string, CanvasElement[]>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'load' | 'new' | null>(null);

  const [activeSchema, setActiveSchema] = useState<ComponentSchema | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved-schemas') || '{}');
    setSavedSchemas(saved);
  }, []);

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
    if (isDirty) {
      setPendingAction('new');
      setIsUnsavedModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSaveName = (name: string) => {
    setComponentName(name);
    setIsModalOpen(false);
    setElements([]); 
    setIsDirty(false);
  };

  const handleSaveSchema = () => {
    if (!componentName) return;
    
    const newSavedSchemas = { ...savedSchemas, [componentName]: elements };
    localStorage.setItem('saved-schemas', JSON.stringify(newSavedSchemas));
    setSavedSchemas(newSavedSchemas);
    setIsDirty(false);
    
    showToast(`Schema for "${componentName}" saved successfully!`, 'success');
  };

  const handleLoadSchema = (name: string) => {
    const schema = savedSchemas[name];
    if (schema) {
      setElements(schema);
      setComponentName(name);
      setIsLoadModalOpen(false);
      setIsDirty(false);
    }
  };

  const handleLoadSchemaClick = () => {
    if (isDirty) {
      setPendingAction('load');
      setIsUnsavedModalOpen(true);
    } else {
      setIsLoadModalOpen(true);
    }
  };

  const executePendingAction = () => {
    if (pendingAction === 'load') {
      setIsLoadModalOpen(true);
    } else if (pendingAction === 'new') {
      setIsModalOpen(true);
    }
    setPendingAction(null);
  };

  const handleUnsavedSave = () => {
    handleSaveSchema();
    setIsUnsavedModalOpen(false);
    executePendingAction();
  };

  const handleUnsavedDiscard = () => {
    setIsUnsavedModalOpen(false);
    setIsDirty(false);
    executePendingAction();
  };

  const handleUnsavedCancel = () => {
    setIsUnsavedModalOpen(false);
    setPendingAction(null);
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
    setIsDirty(true);
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
    setIsDirty(true);
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
    setIsDirty(true);
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
    setIsDirty(true);
  };

  const handleDelete = () => {
    if (!selectedElementId) return;

    // If no path or empty path, delete the whole element
    if (!selectedPath || selectedPath.length === 0) {
      setElements(prev => prev.filter(el => el.id !== selectedElementId));
      handleSelect(null, null);
      setIsDirty(true);
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
    setIsDirty(true);
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
      setIsDirty(true);
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
      setIsDirty(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Deletion
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          handleDelete();
        }
        return;
      }

      // Navigation
      if (selectedElementId && selectedPath) {
        const element = elements.find(el => el.id === selectedElementId);
        if (!element) return;

        const currentPath = [...selectedPath];
        const parentPath = currentPath.slice(0, -1);
        const currentIndex = currentPath[currentPath.length - 1];
        let newPath: number[] | null = null;

        // Hierarchy Navigation (Ctrl/Cmd + Arrow)
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            // Go to first child
            const currentNode = getNodeByPath(element.schema, currentPath);
            if (currentNode && currentNode.type === 'node' && currentNode.children && currentNode.children.length > 0) {
              newPath = [...currentPath, 0];
            }
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            // Go to parent
            if (currentPath.length > 0) {
              newPath = parentPath;
            }
          }
        } 
        // Sibling Navigation (Arrow Keys)
        else {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            // Next sibling
            if (currentPath.length > 0) {
              const parentNode = getNodeByPath(element.schema, parentPath);
              if (parentNode && parentNode.type === 'node' && parentNode.children) {
                if (currentIndex + 1 < parentNode.children.length) {
                  newPath = [...parentPath, currentIndex + 1];
                }
              }
            }
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            // Previous sibling
            if (currentPath.length > 0 && currentIndex > 0) {
              newPath = [...parentPath, currentIndex - 1];
            }
          }
        }

        if (newPath) {
          e.preventDefault();
          handleSelect(selectedElementId, newPath);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, selectedPath, elements]);

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
          onLoadSchema={handleLoadSchemaClick}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => {
            setIsPreviewMode(!isPreviewMode);
            if (!isPreviewMode) {
              // Clear selection when entering preview mode
              handleSelect(null, null);
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar 
            isOpen={leftOpen} 
            disabled={!componentName || isPreviewMode} 
            savedSchemas={
              // Filter out the currently active component from the saved list
              Object.fromEntries(
                Object.entries(savedSchemas).filter(([name]) => name !== componentName)
              )
            } 
          />
          <Canvas 
            elements={elements} 
            onElementsChange={(els) => { setElements(els); setIsDirty(true); }}
            selectedElementId={selectedElementId}
            selectedPath={selectedPath}
            onSelect={handleSelect}
            disabled={!componentName}
            isPreviewMode={isPreviewMode}
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
            disabled={isPreviewMode}
          />
        </div>
      </div>
      {!isPreviewMode && (
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeSchema ? (
            <div className="bg-white border-2 border-blue-500 px-4 py-2 rounded shadow-2xl opacity-90">
              {activeSchema.type === 'node' && activeSchema.nodeType}
            </div>
          ) : null}
        </DragOverlay>
      )}
      
      <NameModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveName}
      />

      <LoadSchemaModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoad={handleLoadSchema}
        savedSchemas={Object.keys(savedSchemas)}
      />
      
      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        onSave={handleUnsavedSave}
        onDiscard={handleUnsavedDiscard}
        onCancel={handleUnsavedCancel}
      />
      
      {!isPreviewMode && (
        <SelectionOverlay 
          selectedElementId={selectedElementId}
          selectedPath={selectedPath}
        />
      )}
    </DndContext>
  );
}
