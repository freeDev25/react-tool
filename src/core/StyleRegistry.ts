import { SchemaAllowed } from '../schema';

export class StyleRegistry {
    private cssRules: Map<string, string> = new Map();
    private classCounter: number = 0;

    public clear(): void {
        this.cssRules.clear();
        this.classCounter = 0;
    }

    public generateClassName(schema: SchemaAllowed): string {
        if (!schema.styles || Object.keys(schema.styles).length === 0) {
            return '';
        }

        const className = `generated-${this.classCounter++}`;
        const cssProperties = Object.entries(schema.styles)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `  ${cssKey}: ${value};`;
            })
            .join('\n');

        this.cssRules.set(className, cssProperties);

        return className;
    }

    public generateCSSContent(): string {
        if (this.cssRules.size === 0) {
            return '';
        }
        return Array.from(this.cssRules.entries())
            .map(([className, properties]) => `.${className} {\n${properties}\n}`)
            .join('\n\n');
    }

    public hasStyles(): boolean {
        return this.cssRules.size > 0;
    }
}
