/**
 * Generator Configuration
 * 
 * Central configuration file for the component generator.
 * Modify these values to customize code generation behavior.
 */

export interface GeneratorConfig {
    /**
     * Number of spaces per indentation level
     * @default 4
     */
    indentSize: number;
    outputDir?: string;
}

/**
 * Default configuration values
 */
export const defaultConfig: GeneratorConfig = {
    indentSize: 4,
    outputDir: 'output',
};

/**
 * Get the current generator configuration
 * Merges user config with defaults
 */
export function getConfig(userConfig?: Partial<GeneratorConfig>): GeneratorConfig {
    return {
        ...defaultConfig,
        ...userConfig,
    };
}
