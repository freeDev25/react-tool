/**
 * Core schema type definitions for the component builder
 */
import type React from 'react';

export type NodeType = keyof React.JSX.IntrinsicElements;

export interface TextNode {
  type: 'text';
  children: string[];
  isJsxText?: boolean;
}

export interface ElementNode {
  type: 'node';
  nodeType: NodeType;
  styles?: React.CSSProperties;
  style?: React.CSSProperties;
  props?: Record<string, unknown>;
  children?: (TextNode | ElementNode)[];
}

export type ComponentSchema = TextNode | ElementNode;

export interface CanvasElement {
  id: string;
  schema: ComponentSchema;
}

export interface SchemaItem {
  title: string;
  nodeTypes?: string[];
  schema: ComponentSchema;
}

export interface BaseSchemas {
  schemas: SchemaItem[];
}
