import React from 'react';
import { FileWriter } from './../fs/FileWriter';
import { StyleRegistry } from './../core/StyleRegistry';
import { ISchema2, Schema2 } from "./";
import { getConfig } from '../core/config';
import NodeSchema from './Node';

class ComponentSchema implements ISchema2 {
    schema: Schema2;
    imports: Set<string> = new Set();
    styles: Map<string, React.CSSProperties> = new Map();
    styleRegistry: StyleRegistry;
    conig = getConfig();
    logicBlocks: string = '';
    writer: FileWriter

    constructor(schema: Schema2) {
        this.schema = schema || {};
        this.writer = new FileWriter({
            outputDir: this.conig.outputDir || 'output'
        });
        this.styleRegistry = new StyleRegistry();
    }

    getName(): string {
        return this.schema.name || '';
    }

    private generateTree(): string {
        if(this.schema.children) {
            if(typeof this.schema.children === 'string') {
                return this.schema.children;
            } else if (Array.isArray(this.schema.children)) {
                return this.schema.children.map(child => {
                    if (typeof child === 'string') {
                        return child;
                    } else if (typeof child === 'object') {
                        if(child.type === 'text') {
                            let textContent = Array.isArray(child.children) && child.children.every(ch => typeof ch === 'string')
                                ? (child.children as string[]).join('')
                                : (child.props?.text || '');
                                return String(textContent);
                        } else if(child.type == 'node') {
                            const childNode = new NodeSchema(child);
                            const result = childNode.generate();
                            
                            // Collect imports from NodeSchema
                            result.imports.forEach(imp => this.imports.add(imp));
                            
                            // Collect styles from NodeSchema
                            result.styles.forEach((style, key) => this.styles.set(key, style));
                            
                            return result.elementTree;
                        }
                    }
                    return '';
                }).join('\n');
            }
        }
        return '';
    }

    private generatePropsInterface(): string {
        const componentName = this.getName() || 'GeneratedComponent';
        
        if (!this.schema.props || Object.keys(this.schema.props).length === 0) {
            return `interface ${componentName}Props {}\n\n`;
        }
        
        const propEntries = Object.entries(this.schema.props)
            .map(([propName, propDef]) => {
                const optional = propDef.required === false ? '?' : '';
                const propType = propDef.type || 'any';
                return `    ${propName}${optional}: ${propType};`;
            })
            .join('\n');
        
        return `interface ${componentName}Props {\n${propEntries}\n}\n\n`;
    }

    private generate(): string {
        const componentName = this.getName() || 'GeneratedComponent';
        const componentTree = this.generateTree();
        
        // Add React import by default
        this.imports.add(`import React from 'react';`);
        
        // Add style import if there are styles
        if (this.styles.size > 0) {
            this.imports.add(`import './${componentName}.css';`);
        }
        
        // Generate imports section
        const importsSection = this.imports.size > 0 
            ? Array.from(this.imports).join('\n') + '\n\n'
            : '';
        
        // Generate props interface
        const propsInterface = this.generatePropsInterface();
        
        // Add proper indentation to component tree (2 levels: 8 spaces)
        const indentedTree = componentTree.split('\n')
            .map(line => line ? '        ' + line : line)
            .join('\n');
        
        // Implementation for generating React component from schema
        return `${importsSection}${propsInterface}const ${componentName}: React.FC<${componentName}Props> = (props) => {${this.logicBlocks}
    return (
${indentedTree}
    );
};

export default ${componentName};`;
    }

    private generateCSS(): string {
        if (this.styles.size === 0) {
            return '';
        }

        const cssRules: string[] = [];
        
        this.styles.forEach((style, className) => {
            const cssProperties = Object.entries(style)
                .map(([prop, value]) => {
                    // Convert camelCase to kebab-case
                    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return `    ${cssProp}: ${value};`;
                })
                .join('\n');
            
            cssRules.push(`.${className} {\n${cssProperties}\n}`);
        });

        return cssRules.join('\n\n');
    }

    run() {
        this.saveToFile();
    }

    private saveToFile() {
        const componentName = this.getName() || 'GeneratedComponent';
        const componentCode = this.generate();
        
        // Generate CSS content if there are styles
        const cssContent = this.styles.size > 0 ? this.generateCSS() : undefined;
        
        this.writer.saveComponent(componentName, componentCode, cssContent);
    }
}

export default ComponentSchema;