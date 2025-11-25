import { SchemaAllowed } from '../schema';

export class StyleRegistry {
    private cssRules: Map<string, string> = new Map();
    private classCounter: number = 0;
    private componentPrefix: string = 'generated';

    public clear(): void {
        this.cssRules.clear();
        this.classCounter = 0;
    }

    public setComponentPrefix(componentName: string): void {
        this.componentPrefix = componentName.toLowerCase();
    }

    public generateClassName(schema: SchemaAllowed): string {
        if (!schema.styles || Object.keys(schema.styles).length === 0) {
            return '';
        }

        const className = `${this.componentPrefix}-${this.classCounter++}`;
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
