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
        const styles = (schema as any).styles;
        if (!styles || Object.keys(styles).length === 0) {
            return '';
        }

        const className = `${this.componentPrefix}-${this.classCounter++}`;
        const cssProperties = Object.entries(styles)
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
