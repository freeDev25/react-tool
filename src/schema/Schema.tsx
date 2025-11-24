import { ISchema } from ".";
import { SchemaParser } from "../parser";

class Schema {
    schema: ISchema;
    constructor(name: string, schema: ISchema) {
        this.schema = schema;
        this.schema.type = 'component';
        this.schema.name = name;
    }

    getName() {
        return this.schema.name;
    }

    generate() {
        SchemaParser.resetManifest();

        if (this.schema.type !== 'component') {
            throw new Error('Schema must be a component');
        }

        if (!this.schema.name) {
            throw new Error('Component schema must have a name');
        }

        const generator = new SchemaParser(this.schema);
        generator.clearOutputFolder();

        // generate components
        generator.run();

        return {
            name: this.schema.name as string,
            path: generator.getOutputPath()
        }
    }
}

export default Schema;