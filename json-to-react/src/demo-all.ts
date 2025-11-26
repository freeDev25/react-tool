import { SchemaParser } from "./parser";
import { ComplexSchemas } from "./tests/complex";
import { InteractiveSchemas } from "./tests/interactive";

const schemas = [...InteractiveSchemas, ...ComplexSchemas]

schemas.forEach((schema, index) => {
    try {
        const generator = new SchemaParser(schema.schema);
        generator.run();
        
        console.log(`${index + 1}. ${schema.getName()}: Generated successfully.`);
        console.log(JSON.stringify(schema.schema, null, 2));
        console.log({
            name: schema.getName(),
            path: generator.getOutputPath()
        });
        console.log('');
    } catch (error) {
        console.error(`${index + 1}. ${schema.getName()}: Failed to generate.`, error);
    }
});