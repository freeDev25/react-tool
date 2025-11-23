// This file will process a schema and convert it into a React element tree
import { Schema } from "./schema";

export class ComponentGenerator {
    private cssRules: Map<string, string> = new Map();
    private classCounter: number = 0;
    private static manifestReset: boolean = false;

    /**
     * Reset the manifest file (call this before starting a generation batch)
     */
    public static resetManifest(): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');
        const manifestPath = path.join(outputDir, 'manifest.json');

        // Create empty manifest
        const emptyManifest = { components: [] };

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write empty manifest
        fs.writeFileSync(manifestPath, JSON.stringify(emptyManifest, null, 2), 'utf8');

        // Copy to playground
        const playgroundPublicDir = path.resolve(__dirname, '../playground/public');
        const playgroundManifestPath = path.join(playgroundPublicDir, 'manifest.json');

        try {
            if (!fs.existsSync(playgroundPublicDir)) {
                fs.mkdirSync(playgroundPublicDir, { recursive: true });
            }
            fs.copyFileSync(manifestPath, playgroundManifestPath);
        } catch (err) {
            console.warn('Failed to copy manifest to playground:', err);
        }

        ComponentGenerator.manifestReset = true;
    }

    /**
     * Generate a React component from a Schema tree
     */
    generate(schema: Schema): string {
        this.cssRules.clear();
        this.classCounter = 0;
        const componentName = schema.name || schema.filename || 'GeneratedComponent';
        const props = schema.props ?? {};

        if (schema.children && schema.children.length > 0) {
            if (schema.children.length > 1) {
                schema = {
                    type: 'fragment',
                    children: schema.children
                }
            }
            else {
                schema = schema.children[0]
            }
        }

        const imports = this.generateImports(schema);
        const component = this.generateComponent(schema, componentName);
        const propsInterface = this.generatePropsInterface(componentName, props);

        return `${imports}\n\n${propsInterface}\n\n${component}`;
    }

    /**
     * Generate child component imports in the parent component
     */

    private generateChildComponentImports(schema: Schema, importsArray: string[] = []): string {
        if (schema.children) {
            schema.children.forEach(child => {
                if (child.type === 'component' && child.name) {
                    // Add import for child component
                    // This is a placeholder; in a real scenario, you would determine the correct path
                    importsArray.push(`import ${child.name} from '../${child.name}/${child.name}';`);

                    if(child.children && child.children.length > 0) {
                        const childImports = this.generateChildComponentImports(child, importsArray);
                        if(childImports) {
                            importsArray.concat(childImports);
                        }
                    }
                }
            });
        }
        // console.log('Generated child imports:', {importsArray, schema});
        return importsArray.join('\n');
    }
    

    /**
     * Generate import statements
     */
    private generateImports(schema: Schema): string {
        const filename = schema.name || schema.filename || 'GeneratedComponent';
        const importsChildrenString: string = this.generateChildComponentImports(schema);
        // Generate class names for styles in the root schema
        let cssStyleFileImportString = `\nimport './style.css';`;
        if (this.cssRules.size === 0) {
            cssStyleFileImportString = '';
        }
        return `import React from 'react';\n${importsChildrenString}${cssStyleFileImportString}`;
    }

    /**
     * Generate props interface
     */
    private generatePropsInterface(componentName: string, props: Schema['props'] | undefined): string {
        if (!props || Object.keys(props).length === 0) {
            return `interface ${componentName}Props {}`;
        }

        const propsEntries = Object.entries(props)
            .sort((a, b) => a[0].localeCompare(b[0])) // Sort props alphabetically
            .map(([key, value]) => {
                let tsType: string = value.type;
                const isRequired = value.required ? true : false;

                return `    ${key}${!isRequired ? '?' : ''}: ${tsType};`;
            })
            .join('\n');

        return `interface ${componentName}Props {\n${propsEntries}\n}`;
    }

    /**
     * Generate the main component code
     */
    private generateComponent(schema: Schema, componentName: string): string {
        const componentTree = this.generateComponentTree(schema, 4);

        return `const ${componentName}: React.FC<${componentName}Props> = (props) => {
    return (
${componentTree}
    );
};

export default ${componentName};`;
    }

    /**
     * Generate the component tree recursively
     */
    private generateComponentTree(schema: Schema, indent: number = 0): string {
        const indentation = '  '.repeat(indent);
        let elementType = this.getElementType(schema);
        const className = this.generateClassName(schema);
        const propsString = this.generatePropsString(schema.props, className);
        const children = schema.children || [];

        if (schema.type === 'text') {
            // Text nodes may provide children as an array of strings
            if (Array.isArray(schema.children) && schema.children.every(ch => typeof ch === 'string')) {
                return `${indentation}${(schema.children as string[]).join('')}`;
            }
            return `${indentation}${schema.props?.text || ''}`;
        }

        if (schema.type === 'component') {
            if (children.length === 0) {
                return `${indentation}<${elementType}${propsString}/>`;
            } else {
                const childrenStrings = children
                    .map(child => this.generateComponentTree(child, indent + 2))
                    .join('\n');
                return `${indentation}<${elementType}${propsString}>\n${childrenStrings}\n${indentation}</${elementType}>`;
            }
        }

        // Self-close void elements and do not attempt to render children
        if (this.isVoidElement(elementType)) {
            return `${indentation}<${elementType}${propsString} />`;
        }

        const openingTag = `${indentation}<${elementType}${propsString}>`;
        const closingTag = `${indentation}</${elementType}>`;

        if (children.length === 0) {
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

    /**
     * Map schema type to React element type
     */
    private getElementType(schema: Schema): string {
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

    /**
     * Generate CSS class name and add rule to collection
     */
    private generateClassName(schema: Schema): string {
        if (!schema.styles || Object.keys(schema.styles).length === 0) {
            return '';
        }

        const className = `generated-${this.classCounter++}`;
        const cssProperties = Object.entries(schema.styles)
            .map(([key, value]) => {
                // Convert camelCase to kebab-case
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `  ${cssKey}: ${value};`;
            })
            .join('\n');

        this.cssRules.set(className, cssProperties);
        return className;
    }

    /**
     * Generate props string
     */
    private generatePropsString(
        props: Schema['props'] | undefined,
        className: string
    ): string {
        let propsString = '';

        if (props) {
            for (const [key, value] of Object.entries(props)) {
                if (key === 'text') continue; // Skip text prop for non-text elements
                if (value?.isPropMapped) {
                    propsString += ` ${key}={props.${value.mappedTo}}`;
                    continue;
                }
                propsString += ` ${key}={${JSON.stringify(value.default)}}`;
            }
        }

        if (className) {
            propsString += ` className="${className}"`;
        }

        return propsString;
    }

    /**
     * Generate CSS file content
     */
    private generateCSSContent(): string {
        const cssContent = Array.from(this.cssRules.entries())
            .map(([className, properties]) => `.${className} {\n${properties}\n}`)
            .join('\n\n');
        return cssContent;
    }

    /**
     * Save generated component to a file
     */
    private saveToFile(content: string, filename: string, componentFolder: string): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');
        const componentDir = path.join(outputDir, componentFolder);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        const filePath = path.join(componentDir, filename);
        fs.writeFileSync(filePath, content, 'utf8');
    }

    /**
     * Clear the component folder
     */
    private clearComponentFolder(componentFolder: string): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');
        const componentDir = path.join(outputDir, componentFolder);

        if (fs.existsSync(componentDir)) {
            fs.rmSync(componentDir, { recursive: true, force: true });
        }
    }

    /**
     * Update the manifest file with component generation info
     */
    private updateManifest(componentName: string, schema: Schema): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');
        const manifestPath = path.join(outputDir, 'manifest.json');

        let manifest: any = { components: [] };

        // Read existing manifest if it exists
        if (fs.existsSync(manifestPath)) {
            try {
                const content = fs.readFileSync(manifestPath, 'utf8');
                manifest = JSON.parse(content);
            } catch (err) {
                console.warn('Failed to parse manifest.json, creating new one');
            }
        }

        // Remove existing entry for this component if it exists
        manifest.components = manifest.components.filter((c: any) => c.name !== componentName);

        // Add new entry
        manifest.components.push({
            name: componentName,
            type: schema.type,
            generatedAt: new Date().toISOString(),
            path: {
                tsx: `${componentName}/${componentName}.tsx`,
                css: `${componentName}/style.css`
            }
        });

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write manifest
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

        // Copy manifest to playground public folder
        this.copyManifestToPlayground(manifestPath);
    }

    /**
     * Copy manifest to playground public folder
     */
    private copyManifestToPlayground(manifestPath: string): void {
        const fs = require('fs');
        const path = require('path');
        const playgroundPublicDir = path.resolve(__dirname, '../playground/public');
        const playgroundManifestPath = path.join(playgroundPublicDir, 'manifest.json');

        try {
            // Ensure playground public directory exists
            if (!fs.existsSync(playgroundPublicDir)) {
                fs.mkdirSync(playgroundPublicDir, { recursive: true });
            }

            // Copy manifest file
            fs.copyFileSync(manifestPath, playgroundManifestPath);
        } catch (err) {
            console.warn('Failed to copy manifest to playground:', err);
        }
    }

    /**
     * Function to remove all files from output folder
     */
    public clearOutputFolder(): void {
        const fs = require('fs');
        const path = require('path');
        const outputDir = path.resolve(__dirname, '../output');

        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
    }

    /**
     * Run the component generation and save to file
     */

    public run(schema: Schema): void {

        if (schema.type == 'node' || schema.type == 'text') {
            console.warn('\x1b[31mComponentGenerator.run() called with non-component schema. Skipping generation.\x1b[0m');
            console.warn('\x1b[31mSchema details:\x1b[0m', JSON.stringify(schema, null, 2));
            return;
        }

        const componentFolderName = schema.name || schema.filename || 'GeneratedComponent';
        // this.clearComponentFolder(componentFolderName);
        const componentCode = this.generate(schema);
        this.saveToFile(componentCode, `${componentFolderName}.tsx`, componentFolderName);

        // Generate and save CSS file
        const cssContent = this.generateCSSContent();
        if (cssContent) {
            this.saveToFile(cssContent, `style.css`, componentFolderName);
        }

        // Update manifest
        this.updateManifest(componentFolderName, schema);
    }
}

