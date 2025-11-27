import { getConfig } from "./config";

const config = getConfig();

/**
 * Interface for variable definitions in component schema
 */
export interface ISchemaVariables {
    [variableName: string]: {
        type: string;           // TypeScript type (string, number, boolean, object, array, etc.)
        value: any;             // Initial value
        computed?: boolean;     // Whether this is a computed/derived value
        memoized?: boolean;     // Whether to wrap in useMemo (for expensive computations)
        dependencies?: string[]; // Dependencies for memoized values
        const?: boolean;        // Whether to use const (true) or let (false), default: true
    };
}

/**
 * VariableGenerator handles generation of local variables within React components.
 * 
 * Supports multiple scenarios:
 * 1. Simple constants - const name = "value"
 * 2. Mutable variables - let counter = 0
 * 3. Computed/derived values - const fullName = firstName + " " + lastName
 * 4. Memoized computations - const expensiveValue = React.useMemo(() => compute(), [deps])
 * 5. Object destructuring - const { x, y } = position
 * 6. Array destructuring - const [first, second] = items
 * 7. Type assertions - const element = ref.current as HTMLDivElement
 */
export default class VariableGenerator {
    public indentSize = config.indentSize;

    constructor() {}

    /**
     * Generates variable declarations for React components
     * @param variables - Variable definitions from schema
     * @returns Generated variable declaration code
     */
    generateVariableCode(variables: ISchemaVariables): string {
        if (!variables || Object.keys(variables).length === 0) {
            return '';
        }

        const indent = ' '.repeat(this.indentSize);
        let variableCode = '';

        for (const [variableName, variableDef] of Object.entries(variables)) {
            // Handle memoized variables (expensive computations)
            if (variableDef.memoized) {
                variableCode += this.generateMemoizedVariable(
                    variableName, 
                    variableDef, 
                    indent
                );
                continue;
            }

            // Handle computed/derived variables
            if (variableDef.computed) {
                variableCode += this.generateComputedVariable(
                    variableName, 
                    variableDef, 
                    indent
                );
                continue;
            }

            // Handle regular variables
            variableCode += this.generateRegularVariable(
                variableName, 
                variableDef, 
                indent
            );
        }

        return variableCode;
    }

    /**
     * Generates a memoized variable using React.useMemo
     * Best for expensive computations that should only re-run when dependencies change
     */
    private generateMemoizedVariable(
        name: string, 
        def: ISchemaVariables[string], 
        indent: string
    ): string {
        const deps = def.dependencies || [];
        const depsString = `[${deps.join(', ')}]`;
        const typeAnnotation = def.type ? `: ${def.type}` : '';
        
        // Value should be the computation expression or function body
        const computation = this.formatValue(def.value, false);
        
        return `\n${indent}const ${name}${typeAnnotation} = React.useMemo(() => ${computation}, ${depsString});`;
    }

    /**
     * Generates a computed/derived variable
     * These are recalculated on every render (not memoized)
     */
    private generateComputedVariable(
        name: string, 
        def: ISchemaVariables[string], 
        indent: string
    ): string {
        const typeAnnotation = def.type ? `: ${def.type}` : '';
        const value = this.formatValue(def.value, false);
        
        return `\n${indent}const ${name}${typeAnnotation} = ${value};`;
    }

    /**
     * Generates a regular variable declaration
     * Can be const or let based on the const flag
     */
    private generateRegularVariable(
        name: string, 
        def: ISchemaVariables[string], 
        indent: string
    ): string {
        const keyword = def.const === false ? 'let' : 'const';
        const typeAnnotation = def.type ? `: ${def.type}` : '';
        const value = this.formatValue(def.value, true);
        
        return `\n${indent}${keyword} ${name}${typeAnnotation} = ${value};`;
    }

    /**
     * Formats a value for code generation
     * @param value - The value to format
     * @param stringify - Whether to use JSON.stringify for objects/arrays
     * @returns Formatted value string
     */
    private formatValue(value: any, stringify: boolean): string {
        // If value is already a code expression (string starting with certain patterns)
        if (typeof value === 'string') {
            // Check if it's a raw expression (function call, variable reference, computation, etc.)
            if (this.isExpression(value)) {
                return value;
            }
            // It's a string literal
            return `"${value}"`;
        }

        // Handle null and undefined
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';

        // Handle booleans and numbers
        if (typeof value === 'boolean' || typeof value === 'number') {
            return String(value);
        }

        // Handle objects and arrays
        if (typeof value === 'object') {
            if (stringify) {
                return JSON.stringify(value);
            }
            // For computed values, assume it's already formatted
            return String(value);
        }

        return JSON.stringify(value);
    }

    /**
     * Determines if a string value is a code expression rather than a string literal
     * Expressions include:
     * - Function calls: calculateTotal(), getData()
     * - Object property access: user.name, props.value
     * - Array access: items[0]
     * - Arithmetic: count + 1, price * quantity
     * - Ternary: condition ? a : b
     * - Logical: value || default
     * - Template literals: `${name}`
     */
    private isExpression(value: string): boolean {
        // Common patterns that indicate code expressions
        const expressionPatterns = [
            /\(.*\)/,                    // Function calls: func()
            /\./,                        // Property access: obj.prop
            /\[.*\]/,                    // Array access: arr[0]
            /[+\-*/%]/,                  // Arithmetic operators
            /\?.*:/,                     // Ternary operator
            /&&|\|\|/,                   // Logical operators
            /^`.*`$/,                    // Template literals
            /^props\./,                  // Props reference
            /^state\./,                  // State reference
            /^React\./,                  // React API calls
            /^new /,                     // Constructor calls
            /=>/,                        // Arrow functions
            /^function/,                 // Function declarations
            /^\[.*\]$/,                  // Array literals (already formatted)
            /^\{.*\}$/,                  // Object literals (already formatted)
        ];

        return expressionPatterns.some(pattern => pattern.test(value));
    }
}
