import { ISchema } from "./schema";
import { Generator } from "./core/Generator";
import { FileWriter } from "./fs/FileWriter";
import * as path from 'path';

export class SchemaParser {
    private generator: Generator;
    private fileWriter: FileWriter;
    private schema: ISchema;

    constructor(schema: ISchema) {
        this.schema = schema;
        if (!this.schema.name) {
            throw new Error('Schema must have a name');
        }
        this.generator = new Generator();
        // Default to the old behavior of writing to ../output
        this.fileWriter = new FileWriter({
            outputDir: path.resolve(__dirname, '../output'),
            playgroundDir: path.resolve(__dirname, '../playground/public')
        });
    }

    /**
     * Reset the manifest file (call this before starting a generation batch)
     */
    public static resetManifest(): void {
        const writer = new FileWriter({
            outputDir: path.resolve(__dirname, '../output'),
            playgroundDir: path.resolve(__dirname, '../playground/public')
        });
        writer.resetManifest();
    }

    /**
     * Generate a React component from a Schema tree
     */
    public generate(): string {
        const result = this.generator.generate(this.schema);
        return result.componentCode;
    }

    /**
     * Function to remove all files from output folder
     */
    public clearOutputFolder(): void {
        this.fileWriter.clearOutputFolder();
    }

    /**
     * Get the output paths for a component
     * @param componentName - Name of the component
     * @returns Object containing relative and absolute paths for .tsx and .css files
     */
    public getOutputPath(): {
        relative: { tsx: string; css: string };
        absolute: { tsx: string; css: string };
    } {
        const outputDir = path.resolve(__dirname, '../output');
        const componentDir = path.join(outputDir, this.schema.name as string);

        return {
            relative: {
                tsx: `${this.schema.name}/${this.schema.name}.tsx`,
                css: `${this.schema.name}/style.css`
            },
            absolute: {
                tsx: path.join(componentDir, `${this.schema.name}.tsx`),
                css: path.join(componentDir, 'style.css')
            }
        };
    }

    /**
     * Run the component generation and save to file
     */
    public run(): void {
        if (this.schema.type == 'node' || this.schema.type == 'text') {
            console.warn('\x1b[31mComponentGenerator.run() called with non-component schema. Skipping generation.\x1b[0m');
            console.warn('\x1b[31mSchema details:\x1b[0m', JSON.stringify(this.schema, null, 2));
            return;
        }

        const result = this.generator.generate(this.schema);
        this.fileWriter.saveComponent(result.name, result.componentCode, result.css);
        this.fileWriter.updateManifest(result.name, this.schema);
    }
}
