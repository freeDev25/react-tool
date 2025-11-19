import { ParsedSchema, ParsedField } from './types';

export interface GeneratorOptions {
  componentName?: string;
  useTypeScript?: boolean;
  includeValidation?: boolean;
  includeStyles?: boolean;
}

export class ComponentGenerator {
  /**
   * Generate a React component from a parsed schema
   */
  generate(schema: ParsedSchema, options: GeneratorOptions = {}): string {
    const {
      componentName = 'GeneratedForm',
      useTypeScript = true,
      includeValidation = true,
      includeStyles = true,
    } = options;

    const imports = this.generateImports(useTypeScript);
    const typeDefinitions = useTypeScript ? this.generateTypeDefinitions(schema) : '';
    const component = this.generateComponent(schema, componentName, useTypeScript, includeValidation);
    const styles = includeStyles ? this.generateStyles() : '';

    return `${imports}\n\n${typeDefinitions}${component}\n\n${styles}`;
  }

  /**
   * Generate import statements
   */
  private generateImports(useTypeScript: boolean): string {
    return `import React, { useState } from 'react';`;
  }

  /**
   * Generate TypeScript type definitions
   */
  private generateTypeDefinitions(schema: ParsedSchema): string {
    const fields = schema.fields.map((field) => {
      const optional = field.required ? '' : '?';
      const type = this.getTypeScriptType(field);
      return `  ${field.name}${optional}: ${type};`;
    });

    return `interface FormData {\n${fields.join('\n')}\n}\n\n`;
  }

  /**
   * Get TypeScript type for a field
   */
  private getTypeScriptType(field: ParsedField): string {
    if (field.enum) {
      return field.enum.map((v) => JSON.stringify(v)).join(' | ');
    }

    switch (field.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (field.items) {
          return `${this.getTypeScriptType(field.items)}[]`;
        }
        return 'any[]';
      case 'object':
        return 'object';
      default:
        return 'any';
    }
  }

  /**
   * Generate the main component code
   */
  private generateComponent(
    schema: ParsedSchema,
    componentName: string,
    useTypeScript: boolean,
    includeValidation: boolean
  ): string {
    const stateInitialization = this.generateStateInitialization(schema);
    const handleChange = this.generateHandleChange();
    const handleSubmit = includeValidation
      ? this.generateHandleSubmit(schema)
      : this.generateSimpleHandleSubmit();
    const formFields = this.generateFormFields(schema);

    return `const ${componentName}${useTypeScript ? ': React.FC' : ''} = () => {
  const [formData, setFormData] = useState${useTypeScript ? '<FormData>' : ''}(${stateInitialization});
  const [errors, setErrors] = useState${useTypeScript ? '<Record<string, string>>' : ''}({});

${handleChange}

${handleSubmit}

  return (
    <div className="form-container">
      <h2>${schema.title}</h2>
      ${schema.description ? `<p className="form-description">${schema.description}</p>` : ''}
      <form onSubmit={handleSubmit}>
${formFields}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ${componentName};`;
  }

  /**
   * Generate initial state object
   */
  private generateStateInitialization(schema: ParsedSchema): string {
    const initialValues = schema.fields.map((field) => {
      let value = 'undefined';
      
      if (field.default !== undefined) {
        value = JSON.stringify(field.default);
      } else {
        switch (field.type) {
          case 'string':
            value = "''";
            break;
          case 'number':
          case 'integer':
            value = '0';
            break;
          case 'boolean':
            value = 'false';
            break;
          case 'array':
            value = '[]';
            break;
          case 'object':
            value = '{}';
            break;
        }
      }

      return `    ${field.name}: ${value}`;
    });

    return `{\n${initialValues.join(',\n')}\n  }`;
  }

  /**
   * Generate handleChange function
   */
  private generateHandleChange(): string {
    return `  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };`;
  }

  /**
   * Generate handleSubmit with validation
   */
  private generateHandleSubmit(schema: ParsedSchema): string {
    const validations = schema.fields
      .filter((field) => field.required || field.validation)
      .map((field) => this.generateFieldValidation(field))
      .filter(Boolean);

    return `  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

${validations.map((v) => `    ${v}`).join('\n\n')}

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };`;
  }

  /**
   * Generate simple handleSubmit without validation
   */
  private generateSimpleHandleSubmit(): string {
    return `  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };`;
  }

  /**
   * Generate validation code for a field
   */
  private generateFieldValidation(field: ParsedField): string {
    const validations: string[] = [];

    if (field.required) {
      if (field.type === 'string') {
        validations.push(
          `if (!formData.${field.name} || formData.${field.name}.trim() === '') {\n      newErrors.${field.name} = '${field.title} is required';\n    }`
        );
      } else {
        validations.push(
          `if (formData.${field.name} === undefined || formData.${field.name} === null) {\n      newErrors.${field.name} = '${field.title} is required';\n    }`
        );
      }
    }

    if (field.validation) {
      if (field.validation.minLength) {
        validations.push(
          `if (formData.${field.name} && formData.${field.name}.length < ${field.validation.minLength}) {\n      newErrors.${field.name} = '${field.title} must be at least ${field.validation.minLength} characters';\n    }`
        );
      }
      if (field.validation.maxLength) {
        validations.push(
          `if (formData.${field.name} && formData.${field.name}.length > ${field.validation.maxLength}) {\n      newErrors.${field.name} = '${field.title} must be at most ${field.validation.maxLength} characters';\n    }`
        );
      }
      if (field.validation.minimum !== undefined) {
        validations.push(
          `if (formData.${field.name} < ${field.validation.minimum}) {\n      newErrors.${field.name} = '${field.title} must be at least ${field.validation.minimum}';\n    }`
        );
      }
      if (field.validation.maximum !== undefined) {
        validations.push(
          `if (formData.${field.name} > ${field.validation.maximum}) {\n      newErrors.${field.name} = '${field.title} must be at most ${field.validation.maximum}';\n    }`
        );
      }
      if (field.validation.pattern) {
        validations.push(
          `if (formData.${field.name} && !/${field.validation.pattern}/.test(formData.${field.name})) {\n      newErrors.${field.name} = '${field.title} format is invalid';\n    }`
        );
      }
    }

    return validations.join(' else ');
  }

  /**
   * Generate form field elements
   */
  private generateFormFields(schema: ParsedSchema): string {
    return schema.fields
      .map((field) => this.generateFormField(field))
      .map((fieldHtml) => `        ${fieldHtml}`)
      .join('\n\n');
  }

  /**
   * Generate a single form field
   */
  private generateFormField(field: ParsedField): string {
    let input: string;

    if (field.enum) {
      // Generate select dropdown for enum
      const options = field.enum
        .map((value) => `            <option value={${JSON.stringify(value)}}>{${JSON.stringify(value)}}</option>`)
        .join('\n');
      input = `<select
            name="${field.name}"
            value={formData.${field.name}}
            onChange={handleChange}
            className="form-input"
            ${field.required ? 'required' : ''}
          >
            <option value="">Select...</option>
${options}
          </select>`;
    } else if (field.type === 'boolean') {
      // Generate checkbox for boolean
      input = `<input
            type="checkbox"
            name="${field.name}"
            checked={formData.${field.name}}
            onChange={handleChange}
            className="form-checkbox"
          />`;
    } else if (field.type === 'string' && field.validation?.maxLength && field.validation.maxLength > 100) {
      // Generate textarea for long strings
      input = `<textarea
            name="${field.name}"
            value={formData.${field.name}}
            onChange={handleChange}
            className="form-input"
            rows={4}
            ${field.required ? 'required' : ''}
            ${field.description ? `placeholder="${field.description}"` : ''}
          />`;
    } else {
      // Generate appropriate input type
      const inputType = this.getInputType(field);
      input = `<input
            type="${inputType}"
            name="${field.name}"
            value={formData.${field.name}}
            onChange={handleChange}
            className="form-input"
            ${field.required ? 'required' : ''}
            ${field.description ? `placeholder="${field.description}"` : ''}
          />`;
    }

    return `<div className="form-field">
          <label className="form-label">
            ${field.title}${field.required ? ' *' : ''}
          </label>
          ${input}
          {errors.${field.name} && <span className="error-message">{errors.${field.name}}</span>}
        </div>`;
  }

  /**
   * Get HTML input type for a field
   */
  private getInputType(field: ParsedField): string {
    if (field.format === 'email') return 'email';
    if (field.format === 'uri' || field.format === 'url') return 'url';
    if (field.format === 'date') return 'date';
    if (field.format === 'date-time') return 'datetime-local';
    if (field.format === 'time') return 'time';

    switch (field.type) {
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'checkbox';
      default:
        return 'text';
    }
  }

  /**
   * Generate CSS styles
   */
  private generateStyles(): string {
    return `const styles = \`
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  }

  .form-container h2 {
    margin-bottom: 10px;
    color: #333;
  }

  .form-description {
    color: #666;
    margin-bottom: 20px;
  }

  .form-field {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
  }

  .form-input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .form-input:focus,
  textarea:focus {
    outline: none;
    border-color: #4CAF50;
  }

  .form-checkbox {
    width: auto;
    margin-right: 5px;
  }

  .error-message {
    display: block;
    color: #f44336;
    font-size: 12px;
    margin-top: 5px;
  }

  .submit-button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
  }

  .submit-button:hover {
    background-color: #45a049;
  }
\`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}`;
  }
}
