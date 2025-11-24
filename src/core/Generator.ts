import { PropSchema, ISchema, SchemaComponent, SchemaFragment, SchemaNode, SchemaText } from '../schema';
import { StyleRegistry } from './StyleRegistry';

export interface GeneratedResult {
    componentCode: string;
    css: string;
    name: string;
}

export class Generator {
    private styleRegistry: StyleRegistry;

    constructor() {
        this.styleRegistry = new StyleRegistry();
    }

    public generate(schema: SchemaComponent | SchemaNode | SchemaFragment | SchemaText | any): GeneratedResult {
        if (!schema) {
            throw new Error('ISchema is required');
        }
        if (typeof schema !== 'object') {
            throw new Error('ISchema must be an object');
        }
        if (!schema.type && !schema.children) {
            // Basic validation, though schema might be partial
        }

        this.styleRegistry.clear();
        const componentName = schema.name || schema.filename || 'GeneratedComponent';
        this.styleRegistry.setComponentPrefix(componentName);
        const props = schema.props ?? {};

        // Normalize schema
        let rootSchema = schema;
        if (schema.children && schema.children.length > 0) {
            if (schema.children.length > 1) {
                rootSchema = {
                    type: 'fragment',
                    children: schema.children
                };
            } else {
                rootSchema = schema.children[0];
            }
        } else {
            // Check if we have styles to decide between div and fragment
            if (schema.styles && Object.keys(schema.styles).length > 0) {
                rootSchema = { type: 'node', nodeType: 'div', styles: schema.styles };
            } else {
                rootSchema = { type: 'fragment' };
            }
        }

        const component = this.generateComponent(rootSchema, componentName);
        const imports = this.generateImports(rootSchema);
        const propsInterface = this.generatePropsInterface(componentName, props, rootSchema);
        const css = this.styleRegistry.generateCSSContent();

        const componentCode = `${imports}\n\n${propsInterface}\n\n${component}`;

        return {
            componentCode,
            css,
            name: componentName
        };
    }

    private generateImports(schema: ISchema): string {
        const importsChildrenString = this.generateChildComponentImports(schema);
        let cssStyleFileImportString = `\nimport './style.css';`;
        if (!this.styleRegistry.hasStyles()) {
            cssStyleFileImportString = '';
        }
        return `import React from 'react';${importsChildrenString}${cssStyleFileImportString}`;
    }

    private generateChildComponentImports(schema: ISchema, importsSet: Set<string> = new Set()): string {
        // Check children in schema.children
        if (schema.children) {
            schema.children.forEach(child => {
                if (child.type === 'component' && child.name) {
                    importsSet.add(`import ${child.name} from '../${child.name}/${child.name}';`);
                }
                // Recurse for all children, not just components
                if (child.children && child.children.length > 0) {
                    this.generateChildComponentImports(child, importsSet);
                }
                // Also check if this child has props.children
                if (child.props?.children && Array.isArray(child.props.children)) {
                    this.generateChildComponentImports(child, importsSet);
                }
            });
        }
        
        // Also check children passed as props (for components like GridWrapper)
        if (schema.props?.children && Array.isArray(schema.props.children)) {
            schema.props.children.forEach((child: ISchema) => {
                if (child.type === 'component' && child.name) {
                    importsSet.add(`import ${child.name} from '../${child.name}/${child.name}';`);
                }
                // Recurse
                if (child.children && child.children.length > 0) {
                    this.generateChildComponentImports(child, importsSet);
                }
                // Also check nested props.children
                if (child.props?.children && Array.isArray(child.props.children)) {
                    this.generateChildComponentImports(child, importsSet);
                }
            });
        }
        
        return Array.from(importsSet).join('\n');
    }

    private generatePropsInterface(componentName: string, props: ISchema['props'] | undefined, schema: ISchema): string {
        const hasChildren = schema.children && schema.children.length > 0;
        const extendsClause = !hasChildren ? ' extends React.PropsWithChildren' : '';

        if (!props || Object.keys(props).length === 0) {
            return `interface ${componentName}Props${extendsClause} {}`;
        }

        const propsEntries = Object.entries(props)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, value]) => {
                let tsType: string = value.type;
                const isRequired = value.required ? true : false;
                return `    ${key}${!isRequired ? '?' : ''}: ${tsType};`;
            })
            .join('\n');

        return `interface ${componentName}Props${extendsClause} {\n${propsEntries}\n}`;
    }

    private generateComponent(schema: ISchema, componentName: string): string {
        const componentTree = this.generateComponentTree(schema, 4);

        return `const ${componentName}: React.FC<${componentName}Props> = (props) => {
    return (
${componentTree}
    );
};

export default ${componentName};`;
    }

    private generateComponentTree(schema: ISchema, indent: number = 0): string {
        if(!schema) {
            return '';
        }
        const indentation = '  '.repeat(indent);
        let elementType = this.getElementType(schema);
        const className = this.styleRegistry.generateClassName(schema);
        const propsString = this.generatePropsString(schema.props, className);
        const children = schema.children || [];

        if (schema.type === 'text') {
            if (Array.isArray(schema.children) && schema.children.every(ch => typeof ch === 'string')) {
                return `${indentation}${(schema.children as string[]).join('')}`;
            }
            return `${indentation}${schema.props?.text || ''}`;
        }

        if (schema.type === 'component') {
            // Check if children is passed as a prop (not in schema.children)
            const childrenFromProps = schema.props?.children;
            const hasChildrenProp = childrenFromProps && Array.isArray(childrenFromProps);
            
            // Merge children from both sources
            const allChildren = hasChildrenProp 
                ? [...children, ...childrenFromProps]
                : children;
            
            if (allChildren.length === 0) {
                return `${indentation}<${elementType}${propsString}/>`;
            } else {
                const childrenStrings = allChildren
                    .map(child => this.generateComponentTree(child, indent + 2))
                    .join('\n');
                return `${indentation}<${elementType}${propsString}>\n${childrenStrings}\n${indentation}</${elementType}>`;
            }
        }

        if (this.isVoidElement(elementType)) {
            return `${indentation}<${elementType}${propsString} />`;
        }

        const openingTag = `${indentation}<${elementType}${propsString}>`;
        const closingTag = `${indentation}</${elementType}>`;

        if (children.length === 0) {
            // If it's the root component and has no children defined, render {props.children}
            if (indent === 4) { // Root level indentation
                return `${openingTag}\n${indentation}  {props.children}\n${closingTag}`;
            }
            return `${openingTag}${closingTag}`;
        }

        if (!Array.isArray(children)) {
            return `${openingTag}\n${indentation}  ${children}\n${closingTag}`;
        }

        const childrenStrings = children
            .map(child => this.generateComponentTree(child, indent + 2))
            .join('\n');

        return `${openingTag}\n${childrenStrings}\n${closingTag}`;
    }

    private isVoidElement(tag: string): boolean {
        const voids = new Set([
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        ]);
        return voids.has(tag);
    }

    private getElementType(schema: ISchema): string {
        const type = schema.type;
        switch (type) {
            case 'node':
                return schema.nodeType ?? 'div';
            case 'component':
                return schema.name || 'div';
            case 'fragment':
                return '';
            default:
                return 'span';
        }
    }

    private generatePropsString(props: Record<string, PropSchema | any> | undefined, className: string): string {
        let propsString = '';

        if (props) {
            for (const [key, value] of Object.entries(props)) {
                // Skip special props that should not be rendered
                if (key === 'text' || key === 'children') continue;
                
                // Check if it's a PropSchema object with mappedTo
                if (value && typeof value === 'object' && value.mappedTo) {
                    propsString += ` ${key}={props.${value.mappedTo}}`;
                    continue;
                }
                
                // Check if it's a PropSchema object with default property
                if (value && typeof value === 'object' && 'default' in value) {
                    const propValue = value.default;
                    if (typeof propValue === 'string') {
                        propsString += ` ${key}="${propValue}"`;
                    } else if (typeof propValue === 'boolean') {
                        propsString += propValue ? ` ${key}` : '';
                    } else {
                        propsString += ` ${key}={${JSON.stringify(propValue)}}`;
                    }
                } else {
                    // It's a direct value (used by Schema.component())
                    if (typeof value === 'string') {
                        // Check if it's a prop reference like "{props.userName}"
                        if (value.startsWith('{props.') && value.endsWith('}')) {
                            propsString += ` ${key}={${value.slice(1, -1)}}`;
                        } else {
                            propsString += ` ${key}="${value}"`;
                        }
                    } else if (typeof value === 'boolean') {
                        propsString += value ? ` ${key}` : '';
                    } else {
                        propsString += ` ${key}={${JSON.stringify(value)}}`;
                    }
                }
            }
        }

        if (className) {
            propsString += ` className="${className}"`;
        }

        return propsString;
    }
}
