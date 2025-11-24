import { Schema } from "./schema";
import { Generator } from "./core/Generator";
import { FileWriter } from "./fs/FileWriter";
import * as path from 'path';

export class ComponentGenerator {
    private generator: Generator;
    private fileWriter: FileWriter;

    constructor() {
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
    public generate(schema: Schema): string {
        const result = this.generator.generate(schema);
        return result.componentCode;
    }

    /**
     * Function to remove all files from output folder
     */
    public clearOutputFolder(): void {
        this.fileWriter.clearOutputFolder();
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

        const result = this.generator.generate(schema);
        this.fileWriter.saveComponent(result.name, result.componentCode, result.css);
        this.fileWriter.updateManifest(result.name, schema);
    }
}
