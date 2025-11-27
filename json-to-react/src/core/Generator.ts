import { PropSchema, ISchema, SchemaComponent, SchemaFragment, SchemaNode, SchemaText } from '../schema';
import FunctionGenerator from './FunctionGenerator';
import StateGenerator from './StateGenerator';
import VariableGenerator from './VariableGenerator';
import { StyleRegistry } from './StyleRegistry';
import { GeneratorConfig, getConfig } from './config';

export interface GeneratedResult {
    componentCode: string;
    css: string;
    name: string;
}

export class Generator {
    private styleRegistry: StyleRegistry;
    private stateGenertor: StateGenerator;
    private functionGenerator: FunctionGenerator;
    private variableGenerator: VariableGenerator;
    private indentSize: number;
    private imports: Set<string> = new Set();
    private config: GeneratorConfig;

    constructor(userConfig?: Partial<GeneratorConfig>) {
        this.config = getConfig(userConfig);
        this.indentSize = this.config.indentSize;
        this.styleRegistry = new StyleRegistry();
        this.stateGenertor = new StateGenerator();
        this.functionGenerator = new FunctionGenerator();
        this.variableGenerator = new VariableGenerator();
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
        this.imports.clear(); // Clear imports for new component generation
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

        const component = this.generateComponent(rootSchema, componentName, schema);
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
        // Use the imports collected during component tree generation
        const importsChildrenString = this.imports.size > 0 ? '\n' + Array.from(this.imports).join('\n') : '';
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

    /**
     * 
     * @param schema 
     * @param componentName 
     * @param originalSchema 
     * @returns The complete component code including hooks and logic and states
     */
    private generateComponent(schema: ISchema, componentName: string, originalSchema?: ISchema): string {
        /**
         * Generate the component tree
         * @return The component tree as a string
         * initail indent is 2 for the return statement
         */
        const componentTree = this.generateComponentTree(schema, 2);
        const schemaForHooks = originalSchema || schema;
        const hooks = this.generateHooks(schemaForHooks);
        const logic = (schemaForHooks as any).componentLogic ? `\n    ${(schemaForHooks as any).componentLogic}\n` : '';
        const propsDestructuring = this.generatePropsDestructuring(originalSchema?.props || {});
        const statesCode = this.stateGenertor.generateStateCode(originalSchema?.states || {});
        const variablesCode = this.variableGenerator.generateVariableCode(originalSchema?.variables || {});
        const functionsCode = this.functionGenerator.generateFunctionCode(originalSchema?.functions || {});

        return `const ${componentName}: React.FC<${componentName}Props> = (props) => {${propsDestructuring}${statesCode}${variablesCode}\n${functionsCode}\n${hooks}\n${logic}
    return (
${componentTree}
    );
};

export default ${componentName};`;
    }

    private generatePropsDestructuring(props: Record<string, PropSchema> | undefined): string {
        if (!props || Object.keys(props).length === 0) {
            return '';
        }

        const indent = ' '.repeat(this.indentSize);
        const propsList = Object.entries(props)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([propName, propDef]) => {
                // If prop has a default value, use it in destructuring
                if (propDef.default !== undefined) {
                    const defaultValue = typeof propDef.default === 'string' 
                        ? `"${propDef.default}"` 
                        : JSON.stringify(propDef.default);
                    return `${propName} = ${defaultValue}`;
                }
                return propName;
            })
            .join(', ');

        return `\n${indent}const { ${propsList} } = props;`;
    }

    private generateHooks(schema: ISchema): string {
        const schemaWithHooks = schema as any;
        if (!schemaWithHooks.hooks || schemaWithHooks.hooks.length === 0) {
            return '';
        }

        const hookStrings = schemaWithHooks.hooks.map((hook: any) => {
            switch (hook.type) {
                case 'useState':
                    const initialVal = typeof hook.initialValue === 'string' 
                        ? `'${hook.initialValue}'` 
                        : JSON.stringify(hook.initialValue);
                    const stateName = hook.name || 'state';
                    const setterName = `set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
                    return `    const [${stateName}, ${setterName}] = React.useState(${initialVal});`;
                
                case 'useEffect':
                    const deps = hook.dependencies ? `[${hook.dependencies.join(', ')}]` : '[]';
                    return `    React.useEffect(() => {\n        ${hook.body || ''}\n    }, ${deps});`;
                
                case 'useCallback':
                    const cbDeps = hook.dependencies ? `[${hook.dependencies.join(', ')}]` : '[]';
                    return `    const ${hook.name} = React.useCallback(() => {\n        ${hook.body || ''}\n    }, ${cbDeps});`;
                
                case 'useMemo':
                    const memoDeps = hook.dependencies ? `[${hook.dependencies.join(', ')}]` : '[]';
                    return `    const ${hook.name} = React.useMemo(() => {\n        ${hook.body || ''}\n    }, ${memoDeps});`;
                
                case 'useRef':
                    const refInit = hook.initialValue !== undefined ? `(${JSON.stringify(hook.initialValue)})` : '(null)';
                    return `    const ${hook.name} = React.useRef${refInit};`;
                
                default:
                    return '';
            }
        }).filter(Boolean);

        return hookStrings.length > 0 ? '\n' + hookStrings.join('\n') : '';
    }

    private generateComponentTree(schema: ISchema, indent: number = 0): string {
        if(!schema) {
            return '';
        }
        
        // Collect imports for component types
        if (schema.type === 'component' && schema.name) {
            this.imports.add(`import ${schema.name} from '../${schema.name}/${schema.name}';`);
        }
        
        const indentation = ' '.repeat(this.indentSize * indent);
        let elementType = this.getElementType(schema);
        const className = this.styleRegistry.generateClassName(schema as any);
        const propsString = this.generatePropsString(schema.props, className, schema.handlers);
        const children = schema.children || [];
        
        // Text nodes handle their own conditionals inline
        if (schema.type === 'text') {
            return this.generateElementTree(schema, elementType, propsString, children, indent, indentation);
        }
        
        // Wrap non-text nodes with conditional if present
        if (schema.condition) {
            // Generate element tree with one extra level of indentation for inside the conditional
            const conditionalElementTree = this.generateElementTree(schema, elementType, propsString, children, indent + 1, ' '.repeat(this.indentSize * (indent + 1)));
            return `${indentation}{${schema.condition} && (\n${conditionalElementTree}\n${indentation})}`;
        }
        
        // Generate the element tree at current indentation level
        let elementTree = this.generateElementTree(schema, elementType, propsString, children, indent, indentation);
        
        return elementTree;
    }

    private generateElementTree(schema: ISchema, elementType: string, propsString: string, children: any[], indent: number, indentation: string): string {

        if (schema.type === 'text') {
            const textSchema = schema as any;
            const textContent = Array.isArray(schema.children) && schema.children.every(ch => typeof ch === 'string')
                ? (schema.children as string[]).join('')
                : (schema.props?.text || '');
            
            // Ensure textContent is a string before checking
            const contentStr = typeof textContent === 'string' ? textContent : '';
            
            // Check if explicitly marked as JSX text
            const isExplicitJsx = textSchema.isJsxText === true;
            
            // Handle conditional text rendering
            if (textSchema.condition) {
                // If it's JSX text with condition, wrap without quotes
                if (isExplicitJsx) {
                    return `${indentation}{${textSchema.condition} && (${contentStr})}`;
                }
                // Plain text with condition, wrap in quotes
                return `${indentation}{${textSchema.condition} && ("${contentStr}")}`;
            }
            
            // Text explicitly marked as JSX - wrap in braces
            if (isExplicitJsx) {
                return `${indentation}{${contentStr}}`;
            }
            
            // Plain text (may contain JSX expressions like "Counter: {count}" which React handles natively)
            return `${indentation}${contentStr}`;
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
                    .map(child => this.generateComponentTree(child, indent + 1))
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
            if (indent === 0) { // Root level indentation
                return `${openingTag}\n${indentation}${' '.repeat(this.indentSize)}{props.children}\n${closingTag}`;
            }
            return `${openingTag}${closingTag}`;
        }

        if (!Array.isArray(children)) {
            return `${openingTag}\n${indentation}${' '.repeat(this.indentSize)}${children}\n${closingTag}`;
        }

        const childrenStrings = children
            .map(child => this.generateComponentTree(child, indent + 1))
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

    private generatePropsString(props: Record<string, PropSchema | any> | undefined, className: string, handlers?: Record<string, string>): string {
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

        // Add event handlers
        if (handlers) {
            for (const [event, handler] of Object.entries(handlers)) {
                propsString += ` ${event}={${handler}}`;
            }
        }

        return propsString;
    }
}
