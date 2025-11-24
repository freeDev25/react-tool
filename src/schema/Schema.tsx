import { ISchema, SchemaNode } from ".";
import { SchemaParser } from "../parser";

class Schema {
    schema: ISchema;
    constructor(name: string, props: ISchema['props'] = {}, children: ISchema[] | ISchema    ) {
        children = Array.isArray(children) ? children : [children];
        this.schema = {
            props,
            children
        };
        this.schema.type = 'component';
        this.schema.name = name;
    }

    static node(nodeType: ISchema['nodeType'], schema: Partial<SchemaNode>): ISchema {
        return {
            ...schema,
            type: 'node',
            nodeType
        };
    }

    static text(content: string): ISchema[] {
        return [{
            type: 'text',
            children: content ? [content] : undefined
        }];
    }

    static children(...children: ISchema[]): ISchema[] {
        return children;
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