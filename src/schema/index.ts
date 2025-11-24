import React from "react";

export interface ISchema {
    type?: string;
    name?: string;
    props?: Record<string, PropSchema>;
    children?: ISchema[] | any[];
    nodeType?: keyof HTMLElementTagNameMap;
    filename?: string;
}

export interface SchemaText extends ISchema {
    type: 'text';
    children: ISchema[];
}

export interface SchemaNode extends ISchema {
    type: 'node';
    nodeType: keyof HTMLElementTagNameMap;
    styles?: React.CSSProperties;
    children?: ISchema[];
}

export interface ComponentPropSchema {
    mappedTo?: string;
}

export interface PropSchema extends ComponentPropSchema {
    type: string;
    default?: any;
    required?: boolean;
}

export interface SchemaComponent extends ISchema {
    type: 'component';
    name: string;
    props?: Record<string, PropSchema>;
    children?: ISchema[];
    filename?: string;
}

export interface SchemaFragment extends ISchema {
    type: 'fragment';
    children?: ISchema[];
    filename?: string;
}

export type SchemaAllowed = SchemaComponent | SchemaNode | SchemaText | SchemaFragment |;