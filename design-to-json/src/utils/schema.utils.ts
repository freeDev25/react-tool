/**
 * Utility functions for schema manipulation
 */

import type { ComponentSchema, NodeType } from '../types/schema.types';

export type DropPosition = 'before' | 'after' | 'inside';

/**
 * Adds a child schema to a node at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @param newChild - The schema to add as a child
 * @returns A new schema with the child added
 */
export function addChildToSchema(
  node: ComponentSchema,
  path: number[],
  newChild: ComponentSchema
): ComponentSchema {
  // Base case: add to root node's children
  if (path.length === 0) {
    if (node.type === 'text') {
      return node; // Can't add children to text nodes
    }

    const children = node.children || [];
    return {
      ...node,
      children: [...children, newChild]
    };
  }

  // Recursive case: navigate to the target node
  if (node.type === 'text') {
    return node; // Can't navigate into text nodes
  }

  const [currentIndex, ...restPath] = path;
  const children = node.children ? [...node.children] : [];
  
  if (children[currentIndex]) {
    children[currentIndex] = addChildToSchema(children[currentIndex], restPath, newChild);
  }

  return {
    ...node,
    children
  };
}

/**
 * Checks if a node can accept children
 * @param node - The schema node to check
 * @returns True if the node can have children
 */
export function canAcceptChildren(node: ComponentSchema): boolean {
  if (node.type === 'text') return false;
  
  const containerTypes: string[] = [
    'div', 'section', 'article', 'header', 'footer', 
    'main', 'aside', 'nav', 'form', 'fieldset'
  ];
  
  return containerTypes.includes(node.nodeType as string);
}

/**
 * Generates a unique ID for canvas elements
 * @returns A unique string ID
 */
export function generateElementId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Inserts a schema relative to a target path using before/after/inside semantics
 */
export function insertSchemaAtPosition(
  node: ComponentSchema,
  targetPath: number[],
  position: DropPosition,
  newChild: ComponentSchema
): ComponentSchema {
  if (position === 'inside') {
    return addChildToSchema(node, targetPath, newChild);
  }

  if (targetPath.length === 0) {
    return node;
  }

  const parentPath = targetPath.slice(0, -1);
  const targetIndex = targetPath[targetPath.length - 1];

  const insertIntoParent = (
    current: ComponentSchema,
    path: number[]
  ): ComponentSchema => {
    if (current.type === 'text') {
      return current;
    }

    if (path.length === 0) {
      const children = current.children ? [...current.children] : [];
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      children.splice(insertIndex, 0, newChild);
      return {
        ...current,
        children
      };
    }

    const [currentIndex, ...restPath] = path;
    const children = current.children ? [...current.children] : [];

    if (children[currentIndex]) {
      children[currentIndex] = insertIntoParent(children[currentIndex], restPath);
    }

    return {
      ...current,
      children
    };
  };

  return insertIntoParent(node, parentPath);
}

/**
 * Retrieves a node from the schema at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @returns The node at the path, or null if not found
 */
export function getNodeByPath(node: ComponentSchema, path: number[]): ComponentSchema | null {
  let current = node;
  for (const index of path) {
    if (current.type === 'text' || !current.children || !current.children[index]) {
      return null;
    }
    current = current.children[index];
  }
  return current;
}

/**
 * Updates the styles of a node at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @param newStyles - The new styles to apply (merged with existing)
 * @returns A new schema with the updated styles
 */
export function updateNodeStyle(
  node: ComponentSchema,
  path: number[],
  newStyles: Record<string, any>
): ComponentSchema {
  if (path.length === 0) {
    if (node.type === 'text') return node;
    
    // Create a new styles object by merging existing with new
    const updatedStyles = { ...node.styles, ...newStyles };
    
    // Remove keys that are explicitly undefined
    Object.keys(newStyles).forEach(key => {
      if (newStyles[key] === undefined) {
        delete (updatedStyles as any)[key];
      }
    });

    return {
      ...node,
      styles: updatedStyles
    };
  }

  if (node.type === 'text') return node;

  const [currentIndex, ...restPath] = path;
  const children = node.children ? [...node.children] : [];

  if (children[currentIndex]) {
    children[currentIndex] = updateNodeStyle(children[currentIndex], restPath, newStyles);
  }

  return {
    ...node,
    children
  };
}

/**
 * Updates the content of a text node at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @param newContent - The new text content
 * @returns A new schema with the updated content
 */
export function updateTextNodeContent(
  node: ComponentSchema,
  path: number[],
  newContent: string
): ComponentSchema {
  if (path.length === 0) {
    if (node.type !== 'text') return node;
    return {
      ...node,
      children: [newContent]
    };
  }

  if (node.type === 'text') return node;

  const [currentIndex, ...restPath] = path;
  const children = node.children ? [...node.children] : [];

  if (children[currentIndex]) {
    children[currentIndex] = updateTextNodeContent(children[currentIndex], restPath, newContent);
  }

  return {
    ...node,
    children
  };
}

/**
 * Updates the nodeType of a node at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @param newNodeType - The new node type
 * @returns A new schema with the updated nodeType
 */
export function updateNodeType(
  node: ComponentSchema,
  path: number[],
  newNodeType: NodeType
): ComponentSchema {
  if (path.length === 0) {
    if (node.type === 'text') return node;
    return {
      ...node,
      nodeType: newNodeType
    };
  }

  if (node.type === 'text') return node;

  const [currentIndex, ...restPath] = path;
  const children = node.children ? [...node.children] : [];

  if (children[currentIndex]) {
    children[currentIndex] = updateNodeType(children[currentIndex], restPath, newNodeType);
  }

  return {
    ...node,
    children
  };
}

/**
 * Updates the props of a node at the specified path
 * @param node - The root schema node
 * @param path - Array of indices representing the path to the target node
 * @param newProps - The new props to apply (merged with existing)
 * @returns A new schema with the updated props
 */
export function updateNodeProps(
  node: ComponentSchema,
  path: number[],
  newProps: Record<string, any>
): ComponentSchema {
  if (path.length === 0) {
    if (node.type === 'text') return node;
    
    // Create a new props object by merging existing with new
    const updatedProps = { ...node.props, ...newProps };
    
    // Remove keys that are explicitly undefined
    Object.keys(newProps).forEach(key => {
      if (newProps[key] === undefined) {
        delete (updatedProps as any)[key];
      }
    });

    return {
      ...node,
      props: updatedProps
    };
  }

  if (node.type === 'text') return node;

  const [currentIndex, ...restPath] = path;
  const children = node.children ? [...node.children] : [];

  if (children[currentIndex]) {
    children[currentIndex] = updateNodeProps(children[currentIndex], restPath, newProps);
  }

  return {
    ...node,
    children
  };
}
