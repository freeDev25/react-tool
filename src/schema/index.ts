import React, { HTMLAttributes } from "react";

export type SchemaText = {
    type: 'text';
    children: string[];
    props?: Record<string, any>;
}

export type SchemaNode<T> = {
    type: 'node';
    name: keyof HTMLElementTagNameMap;
    attributes?: HTMLAttributes<T>;
    styles?: React.CSSProperties;
    children?: Schema[];
    props?: Record<string, any>;
}

export type SchemaComponent = {
    type: 'component';
    name: string;
    props?: Record<string, any>;
    children?: any[];
}

type PropSchema = {
    type: string;
    default?: any;
    required?: boolean;
    isPropMapped?: boolean;
    mappedTo?: string;
}

export type Schema = {
    type: 'node' | 'component' | 'text' | 'fragment';
    nodeType?: keyof HTMLElementTagNameMap;
    name?: string;
    props?: Record<string, PropSchema>;
    styles?: React.CSSProperties;
    children?: any[];
    filename?: string;
}