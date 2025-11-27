
import { HTMLAttributes } from "react";
import { ISchema, ISchemaStates, PropSchema, SchemaNode, SchemaNodeInternal } from ".";
import { SchemaParser } from "../parser";

class Schema {
    schema: ISchema;
    constructor(name: string, props: ISchema['props'] = {}, children: ISchema[] | ISchema, states?: ISchemaStates) {
        children = Array.isArray(children) ? children : [children];
        this.schema = {
            props,
            children
        };
        this.schema.type = 'component';
        this.schema.name = name;
        this.schema.states = states;
    }

    static node(nodeType: ISchema['nodeType'], schema?: SchemaNodeInternal, props?: Record<string, any>): ISchema {
        return {
            ...schema,
            props,
            type: 'node',
            nodeType
        } as any;
    }

    static text(content: string): ISchema[] {
        return [{
            type: 'text',
            children: content ? [content] : undefined
        }];
    }

    static component(name: string, props: Record<string, any>, children?: ISchema[] | ISchema): ISchema {
        let childrenItems: ISchema[];
        if (!children) {
            childrenItems = [];
        } else {
            childrenItems = Array.isArray(children) ? children : [children];
        }
        return {
            type: 'component',
            name,
            props,
            children: childrenItems
        };
    }

    static children(...children: ISchema[]): ISchema[] {
        return children;
    }

    getName() {
        return this.schema.name;
    }

    addState(stateName: string, stateType: string, defaultValue: any) {
        if (!this.schema.states) {
            this.schema.states = {};
        }
        this.schema.states[stateName] = {
            type: stateType,
            default: defaultValue
        };
    }

    addFunction(fnName: string, params: { name: string; type: string }[], body: string) {
        if (!this.schema.functions) {
            this.schema.functions = {};
        }
        this.schema.functions[fnName] = {
            params,
            body
        };
    }

    async generate() {
        // SchemaParser.resetManifest();

        if (this.schema.type !== 'component') {
            throw new Error('Schema must be a component');
        }

        if (!this.schema.name) {
            throw new Error('Component schema must have a name');
        }

        const generator = new SchemaParser(this.schema);
        // generator.clearOutputFolder();

        // generate components
        generator.run();

        return {
            name: this.schema.name as string,
            path: generator.getOutputPath()
        }
    }
}

export default Schema;