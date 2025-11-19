// This file will process a schema and convert it into a React element tree
import { BaseSchema } from "./schema";

export class ComponentGenerator {
    /**
     * Generate a React component from a BaseSchema tree
     */
    generate(schema: BaseSchema): string {
        const imports = this.generateImports();
        const component = this.generateComponent(schema);

        return `${imports}\n\n${component}`;
    }

    /**
     * Generate import statements
     */
    private generateImports(): string {
        return `import React from 'react';`;
    }

    /**
     * Generate the main component code
     */
    private generateComponent(schema: BaseSchema): string {
        const componentTree = this.generateComponentTree(schema, 2);

        return `const GeneratedComponent: React.FC = () => {
  return (
${componentTree}
  );
};

export default GeneratedComponent;`;
    }

    /**
     * Generate the component tree recursively
     */
    private generateComponentTree(schema: BaseSchema, indent: number = 0): string {
        const indentation = ' '.repeat(indent);
        const elementType = this.getElementType(schema.type);
        const styleObj = this.generateStyleObject(schema);
        const propsString = this.generatePropsString(schema.props, styleObj);
        const children = schema.children || [];

        if (schema.type === 'text') {
            return `${indentation}${schema.props?.text || ''}`;
        }

        const openingTag = `${indentation}<${elementType}${propsString}>`;
        const closingTag = `${indentation}</${elementType}>`;

        if (children.length === 0) {
            return `${openingTag}${closingTag}`;
        }

        const childrenStrings = children
            .map(child => this.generateComponentTree(child, indent + 2))
            .join('\n');

        return `${openingTag}\n${childrenStrings}\n${closingTag}`;
    }

    /**
     * Map schema type to React element type
     */
    private getElementType(type: string): string {
        switch (type) {
            case 'node':
                return 'div';
            case 'component':
                return 'section';
            default:
                return 'span';
        }
    }

    /**
     * Generate style object string
     */
    private generateStyleObject(schema: BaseSchema): string {
        if (!schema.styles) {
            return '{}';
        }
        return JSON.stringify(schema.styles, null, 2);
    }

    /**
     * Generate props string
     */
    private generatePropsString(
        props: Record<string, any> | undefined,
        styleObj: string
    ): string {
        let propsString = '';

        if (props) {
            for (const [key, value] of Object.entries(props)) {
                if (key === 'text') continue; // Skip text prop for non-text elements
                propsString += ` ${key}={${JSON.stringify(value)}}`;
            }
        }
        propsString += ` style={${styleObj}}`;

        return propsString;
    }

    // store it to a folder output
    private saveToFile(content: string, filename: string): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, content, 'utf8');
    }

    public run(schema: BaseSchema): void {
        const componentCode = this.generate(schema);
        const fileName = schema.filename || 'GeneratedComponent';
        this.saveToFile(componentCode, `${fileName}.tsx`);
    }
}

