import { JSONSchema, BaseSchema } from './types';
import { SchemaParser } from './parser';
import { ComponentGenerator, GeneratorOptions } from './generator';
import { ComponentSchemaGenerator, ComponentGeneratorOptions } from './componentSchemaGenerator';

/**
 * Convert a JSON schema to a React component
 */
export function jsonSchemaToReact(schema: JSONSchema, options?: GeneratorOptions): string {
  const parser = new SchemaParser();
  const generator = new ComponentGenerator();

  const parsedSchema = parser.parse(schema);
  const componentCode = generator.generate(parsedSchema, options);

  return componentCode;
}

/**
 * Convert a BaseSchema component tree to a React component
 */
export function componentSchemaToReact(schema: BaseSchema, options?: ComponentGeneratorOptions): string {
  const generator = new ComponentSchemaGenerator();
  return generator.generate(schema, options);
}

// Export classes for advanced usage
export { SchemaParser, ComponentGenerator, ComponentSchemaGenerator };
export * from './types';
