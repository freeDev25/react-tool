import React from 'react';
import { StyleRegistry } from './../core/StyleRegistry';
import { GeneratorConfig, getConfig } from "../core/config";
import { ISchema, Schema2, Schema2Prop, Schema2Types } from "./";
import { Schema } from 'inspector/promises';

export type NodeSchemaReturnType = {
    styles: Map<string, React.CSSProperties>;
    imports: Set<string>;
    props: Record<string, any> | undefined;
    elementTree: string
};

class NodeSchema implements Schema2 {
    schema: Schema2;
    config: GeneratorConfig | undefined;
    type: Schema2Types;
    name?: string | undefined;
    props?: Record<string, Schema2Prop> | undefined;
    styles?: React.CSSProperties | undefined;
    children?: string | Schema2[] | undefined;
    private indentSize: number = 4;
    imports: Set<string> = new Set();

    constructor(schema: Schema2) {
        this.schema = schema || {};
        this.type = schema.type;
        this.name = schema.name;
        this.props = schema.props;
        this.styles = schema.styles;
        this.children = schema.children;
        this.config = getConfig();
        this.indentSize = this.config?.indentSize || 4;
    }


    getName(): string {
        return this.schema.name || '';
    }

    generate(): NodeSchemaReturnType {
        const styles = new Map<string, React.CSSProperties>();
        
        this.collectImportsAndStyles(this.schema, this.imports, styles);
        
        return {
            styles: styles,
            imports: this.imports,
            props: this.props,
            elementTree: this.renderNode(this.schema, 0, '', styles) as string
        };
    }

    private collectImportsAndStyles(schema: Schema2, imports: Set<string>, styles: Map<string, React.CSSProperties>, path: string = ''): void {
        // If this is a component type, add its import
        if (schema.type === 'component' && schema.name) {
            imports.add(`import ${schema.name} from '../${schema.name}/${schema.name}';`);
        }

        // Collect styles if present
        if (schema.styles) {
            const stylePath = path || (schema.name ? String(schema.name) : 'root');
            styles.set(stylePath, schema.styles);
        }

        // Recursively collect from children
        if (schema.children && Array.isArray(schema.children)) {
            schema.children.forEach((child, index) => {
                if (typeof child === 'object') {
                    const childPath = `${path ? path + '-' : ''}${schema.name || 'node'}-${index}`;
                    this.collectImportsAndStyles(child, imports, styles, childPath);
                }
            });
        }
    }

    private generatePropsString(props: Record<string, Schema2Prop>): string {
        let propsString = '';
        for (const [propName, propDef] of Object.entries(props)) {
            if (propDef.default !== undefined) {
                const defaultValue = JSON.stringify(propDef.default);
                propsString += ` ${propName}={${defaultValue}}`;
            }
        }
        return propsString;
    }

    private generateChildrenString(children: string | Schema2[] | undefined, indent: number, path: string = '', stylesMap?: Map<string, React.CSSProperties>): string {
        if (!children) {
            return '';
        }
        if (typeof children === 'string') {
            return children;
        } else if (Array.isArray(children)) {
            return children.map((child, index) => {
                if (typeof child === 'string') {
                    return child;
                } else if (typeof child === 'object') {
                    const childPath = `${path ? path + '-' : ''}${child.name || 'node'}-${index}`;
                    return this.renderNode(child, indent + 1, childPath, stylesMap);
                }
                return '';
            }).filter(Boolean).join('\n');
        }
        return '';
    }

    private renderNode(schema: Schema2, indent: number = 0, path: string = '', stylesMap?: Map<string, React.CSSProperties>): string | null {
        const indentation = ' '.repeat(this.indentSize * indent);
        
        if(schema.type === 'node') {
            const tagName = (schema as any).nodeType || schema.name || 'div';
            const propsString = this.generatePropsString(schema.props || {});
            
            // Add className if this node has styles
            const stylePath = path || (schema.name ? String(schema.name) : 'root');
            const classNameProp = stylesMap && stylesMap.has(stylePath) ? ` className="${stylePath}"` : '';
            
            const childrenString = this.generateChildrenString(schema.children, indent, path, stylesMap);
            
            // Check if node has children
            if (childrenString) {
                return `${indentation}<${tagName}${classNameProp}${propsString}>\n${childrenString}\n${indentation}</${tagName}>`;
            }
            return `${indentation}<${tagName}${classNameProp}${propsString} />`;
        } else if(schema.type === 'text') {
            const textSchema = schema as any;
            let textContent = '';
            
            if (typeof schema.children === 'string') {
                textContent = schema.children;
            } else if (Array.isArray(schema.children) && schema.children.every(ch => typeof ch === 'string')) {
                textContent = (schema.children as string[]).join('');
            }
            
            // Text content should be indented
            return indentation + textContent;
        } else if(schema.type === 'component' && schema.name) {
            const propsString = this.generatePropsString(schema.props || {});
            const childrenString = this.generateChildrenString(schema.children, indent, path, stylesMap);
            
            if (childrenString) {
                return `${indentation}<${schema.name}${propsString}>\n${childrenString}\n${indentation}</${schema.name}>`;
            }
            return `${indentation}<${schema.name}${propsString} />`;
        }
        
        return null;
    }
}

export default NodeSchema;