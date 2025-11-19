import React from "react";

export type BaseSchema = {
    type: 'node' | 'component' | 'text';
    name?: string;
    props?: Record<string, any>;
    styles?: React.CSSProperties;
    children?: BaseSchema[];
    filename?: string;
}