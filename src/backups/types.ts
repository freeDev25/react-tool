export interface JSONSchema {
    type: string;
    title?: string;
    description?: string;
    properties?: {
        [key: string]: JSONSchemaProperty;
    };
    required?: string[];
    additionalProperties?: boolean;
}

export interface JSONSchemaProperty {
    type: string | string[];
    title?: string;
    description?: string;
    default?: any;
    enum?: any[];
    format?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    items?: JSONSchemaProperty;
    properties?: {
        [key: string]: JSONSchemaProperty;
    };
    required?: string[];
}

export interface ParsedField {
    name: string;
    type: string;
    title?: string;
    description?: string;
    required: boolean;
    default?: any;
    enum?: any[];
    format?: string;
    validation?: {
        minLength?: number;
        maxLength?: number;
        minimum?: number;
        maximum?: number;
        pattern?: string;
    };
    items?: ParsedField;
}

export interface ParsedSchema {
    title: string;
    description?: string;
    fields: ParsedField[];
}

export type ScemaType = "Text" | "Image" | "Div";

export type LayoutSchema = {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export interface BaseSchema <T = any>{
    id?: string
    type: ScemaType;
    name: string;
    parent?: any;
    children?: BaseSchema[];
    layout?: LayoutSchema;
    styles?: any;
    props?: T;
}
