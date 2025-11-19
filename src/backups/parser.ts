import { JSONSchema, JSONSchemaProperty, ParsedSchema, ParsedField } from './types';

export class SchemaParser {
  /**
   * Parse a JSON schema into a simplified structure for component generation
   */
  parse(schema: JSONSchema): ParsedSchema {
    if (schema.type !== 'object') {
      throw new Error('Only object type schemas are supported at the root level');
    }

    const fields: ParsedField[] = [];
    const requiredFields = schema.required || [];

    if (schema.properties) {
      for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
        fields.push(this.parseField(fieldName, fieldSchema, requiredFields.includes(fieldName)));
      }
    }

    return {
      title: schema.title || 'Form',
      description: schema.description,
      fields,
    };
  }

  /**
   * Parse a single field from the schema
   */
  private parseField(name: string, schema: JSONSchemaProperty, required: boolean): ParsedField {
    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;

    const field: ParsedField = {
      name,
      type,
      title: schema.title || this.formatFieldName(name),
      description: schema.description,
      required,
      default: schema.default,
      enum: schema.enum,
      format: schema.format,
    };

    // Add validation rules
    if (schema.minLength || schema.maxLength || schema.minimum || schema.maximum || schema.pattern) {
      field.validation = {
        minLength: schema.minLength,
        maxLength: schema.maxLength,
        minimum: schema.minimum,
        maximum: schema.maximum,
        pattern: schema.pattern,
      };
    }

    // Handle array items
    if (type === 'array' && schema.items) {
      field.items = this.parseField('item', schema.items, false);
    }

    return field;
  }

  /**
   * Convert field name to a human-readable format
   */
  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .trim();
  }
}
