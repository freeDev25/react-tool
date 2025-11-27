import React from "react";

export interface ISchema {
    type?: string;
    name?: string;
    props?: Record<string, PropSchema>;
    children?: ISchema[] | any[];
    nodeType?: keyof HTMLElementTagNameMap;
    filename?: string;
    handlers?: Record<string, string>; // Event handlers like onClick, onChange
    condition?: string; // Conditional rendering expression
    states?: ISchemaStates; // Component state definitions
    functions?: ISchemaFunctions; // Custom functions
}

export type ISchemaStates = Record<string, {
    type: string;
    default: any;
}>;

export type ISchemaFunctions = Record<string, {
    params: { name: string; type: string }[];
    body: string;
}>;

export interface SchemaText  {
    type: 'text';
    children?: string[];
    isJsxText?: boolean; // Whether the text is JSX expression
    condition?: string; // Conditional rendering expression
}

export interface SchemaNode extends ISchema {
    type: 'node';
    nodeType: keyof HTMLElementTagNameMap;
    styles?: React.CSSProperties;
    children?: ISchema[];
    handlers?: Record<string, string>; // Event handlers
    condition?: string; // Conditional rendering
}

export type SchemaNodeInternal = {
    styles?: React.CSSProperties;
    children?: ISchema[];
    handlers?: Record<string, string>;
    condition?: string;
    props?: Record<string, any>; // HTML attributes
}

export interface ComponentPropSchema {
    mappedTo?: string;
}

export interface PropSchema extends ComponentPropSchema {
    type: string;
    default?: any;
    required?: boolean;
}

export interface ComponentHook {
    type: 'useState' | 'useEffect' | 'useCallback' | 'useMemo' | 'useRef';
    name?: string; // Variable name for state
    initialValue?: any; // Initial value for useState
    dependencies?: string[]; // Dependencies for useEffect, useCallback, useMemo
    body?: string; // Function body for useEffect, useCallback, useMemo
}

export interface SchemaComponent extends ISchema {
    type: 'component';
    name: string;
    props?: Record<string, PropSchema>;
    children?: ISchema[];
    filename?: string;
    hooks?: ComponentHook[]; // useState, useEffect, etc.
    componentLogic?: string; // Custom functions and logic
}

export interface SchemaFragment extends ISchema {
    type: 'fragment';
    children?: ISchema[];
    filename?: string;
}

export type SchemaAllowed = SchemaComponent | SchemaNode | SchemaText | SchemaFragment;