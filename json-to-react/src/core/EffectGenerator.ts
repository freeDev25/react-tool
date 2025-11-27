import { getConfig } from "./config";

const config = getConfig();

/**
 * Interface for effect definitions in component schema
 */
export interface ISchemaEffects {
    [effectName: string]: {
        body: string;               // Effect function body
        dependencies?: string[];    // Dependency array
        cleanup?: string;           // Cleanup function body (optional)
        async?: boolean;            // Whether the effect uses async operations
        condition?: string;         // Conditional effect execution
    };
}

/**
 * EffectGenerator handles generation of React useEffect hooks within components.
 * 
 * Supports multiple scenarios:
 * 1. Simple effects - useEffect(() => { code }, [deps])
 * 2. Effects with cleanup - useEffect(() => { code; return () => cleanup }, [deps])
 * 3. Mount-only effects - useEffect(() => { code }, [])
 * 4. Effects that run on every render - useEffect(() => { code })
 * 5. Async effects - useEffect(() => { async function fn() {...}; fn(); }, [deps])
 * 6. Conditional effects - if (condition) { effect logic }
 * 7. Multiple effects with different dependencies
 * 8. Effects with complex cleanup logic
 */
export default class EffectGenerator {
    public indentSize = config.indentSize;

    constructor() {}

    /**
     * Generates useEffect hooks for React components
     * @param effects - Effect definitions from schema
     * @returns Generated useEffect code
     */
    generateEffectCode(effects: ISchemaEffects): string {
        if (!effects || Object.keys(effects).length === 0) {
            return '';
        }

        const indent = ' '.repeat(this.indentSize);
        let effectCode = '';

        for (const [effectName, effectDef] of Object.entries(effects)) {
            effectCode += this.generateSingleEffect(effectDef, indent);
        }

        return effectCode;
    }

    /**
     * Generates a single useEffect hook
     */
    private generateSingleEffect(
        effectDef: ISchemaEffects[string],
        indent: string
    ): string {
        const hasAsync = effectDef.async === true;
        const hasCleanup = !!(effectDef.cleanup && effectDef.cleanup.trim().length > 0);
        const hasCondition = !!(effectDef.condition && effectDef.condition.trim().length > 0);
        const deps = effectDef.dependencies || [];
        const depsString = this.formatDependencies(deps);

        // Generate effect body
        let effectBody = '';

        if (hasAsync) {
            // Async effect pattern
            effectBody = this.generateAsyncEffect(effectDef, indent, hasCleanup);
        } else if (hasCondition) {
            // Conditional effect pattern
            effectBody = this.generateConditionalEffect(effectDef, indent, hasCleanup);
        } else {
            // Regular effect pattern
            effectBody = this.generateRegularEffect(effectDef, indent, hasCleanup);
        }

        return `\n\n${indent}React.useEffect(() => {${effectBody}${indent}}, ${depsString});`;
    }

    /**
     * Generates a regular (non-async, non-conditional) effect body
     */
    private generateRegularEffect(
        effectDef: ISchemaEffects[string],
        indent: string,
        hasCleanup: boolean
    ): string {
        const bodyLines = this.indentLines(effectDef.body, indent, 2);
        let result = `\n${bodyLines}`;

        if (hasCleanup) {
            const cleanupLines = this.indentLines(effectDef.cleanup!, indent, 3);
            result += `\n${indent}${indent}return () => {${cleanupLines}${indent}${indent}};`;
        }

        return result + '\n';
    }

    /**
     * Generates an async effect body
     * Pattern: useEffect(() => { async function fn() {...}; fn(); }, [deps])
     */
    private generateAsyncEffect(
        effectDef: ISchemaEffects[string],
        indent: string,
        hasCleanup: boolean
    ): string {
        const bodyLines = this.indentLines(effectDef.body, indent, 3);
        
        let result = `\n${indent}${indent}async function fetchData() {${bodyLines}${indent}${indent}}\n`;
        result += `${indent}${indent}fetchData();`;

        if (hasCleanup) {
            const cleanupLines = this.indentLines(effectDef.cleanup!, indent, 3);
            result += `\n${indent}${indent}return () => {${cleanupLines}${indent}${indent}};`;
        }

        return result + '\n';
    }

    /**
     * Generates a conditional effect body
     * Pattern: useEffect(() => { if (condition) { code } }, [deps])
     */
    private generateConditionalEffect(
        effectDef: ISchemaEffects[string],
        indent: string,
        hasCleanup: boolean
    ): string {
        const bodyLines = this.indentLines(effectDef.body, indent, 3);
        let result = `\n${indent}${indent}if (${effectDef.condition}) {${bodyLines}${indent}${indent}}`;

        if (hasCleanup) {
            const cleanupLines = this.indentLines(effectDef.cleanup!, indent, 3);
            result += `\n${indent}${indent}return () => {${cleanupLines}${indent}${indent}};`;
        }

        return result + '\n';
    }

    /**
     * Formats dependency array
     * @param deps - Array of dependency names
     * @returns Formatted dependency array string
     */
    private formatDependencies(deps: string[]): string {
        if (deps.length === 0) {
            return '[]';
        }

        // If single dependency and short, keep on one line
        if (deps.length === 1 && deps[0].length < 30) {
            return `[${deps[0]}]`;
        }

        // If multiple dependencies but total length is short, keep on one line
        const singleLine = `[${deps.join(', ')}]`;
        if (singleLine.length < 60) {
            return singleLine;
        }

        // Multi-line format for many or long dependencies
        return `[\n        ${deps.join(',\n        ')}\n    ]`;
    }

    /**
     * Indents lines of code properly
     * @param code - Code string to indent
     * @param indent - Base indent string
     * @param levels - Number of indent levels to apply
     * @returns Indented code
     */
    private indentLines(code: string, indent: string, levels: number): string {
        const fullIndent = indent.repeat(levels);
        
        // Split by newlines and indent each line
        const lines = code.split('\n');
        return lines
            .map(line => {
                // Skip empty lines
                if (line.trim().length === 0) {
                    return '';
                }
                // If line already has indentation, preserve relative indentation
                const trimmed = line.trimStart();
                const extraSpaces = line.length - line.trimStart().length;
                return fullIndent + ' '.repeat(extraSpaces) + trimmed;
            })
            .join('\n');
    }
}
