import * as fs from 'fs';
import * as path from 'path';
import { jsonSchemaToReact, componentSchemaToReact } from './index';
import { userProfileSchema, contactFormSchema, productSchema, box, complexLayout } from './examples';

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('🚀 Generating React components from JSON schemas...\n');

// Generate User Profile Form
console.log('📝 Generating UserProfileForm...');
const userProfileComponent = jsonSchemaToReact(userProfileSchema, {
  componentName: 'UserProfileForm',
  useTypeScript: true,
  includeValidation: true,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'UserProfileForm.tsx'), userProfileComponent);
console.log('✅ UserProfileForm.tsx created\n');

// Generate Contact Form
console.log('📝 Generating ContactForm...');
const contactFormComponent = jsonSchemaToReact(contactFormSchema, {
  componentName: 'ContactForm',
  useTypeScript: true,
  includeValidation: true,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'ContactForm.tsx'), contactFormComponent);
console.log('✅ ContactForm.tsx created\n');

// Generate Product Form
console.log('📝 Generating ProductForm...');
const productFormComponent = jsonSchemaToReact(productSchema, {
  componentName: 'ProductForm',
  useTypeScript: true,
  includeValidation: true,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'ProductForm.tsx'), productFormComponent);
console.log('✅ ProductForm.tsx created\n');

// Generate JavaScript version (without TypeScript)
console.log('📝 Generating SimpleForm (JavaScript)...');
const simpleFormComponent = jsonSchemaToReact(contactFormSchema, {
  componentName: 'SimpleForm',
  useTypeScript: false,
  includeValidation: false,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'SimpleForm.jsx'), simpleFormComponent);
console.log('✅ SimpleForm.jsx created\n');

// Generate Component from BaseSchema
console.log('📝 Generating ContainerBox from BaseSchema...');
const boxComponent = componentSchemaToReact(box, {
  componentName: 'ContainerBox',
  useTypeScript: true,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'ContainerBox.tsx'), boxComponent);
console.log('✅ ContainerBox.tsx created\n');

// Generate Complex Layout Component
console.log('📝 Generating ComplexLayout from BaseSchema...');
const complexComponent = componentSchemaToReact(complexLayout, {
  componentName: 'ComplexLayout',
  useTypeScript: true,
  includeStyles: true,
});
fs.writeFileSync(path.join(outputDir, 'ComplexLayout.tsx'), complexComponent);
console.log('✅ ComplexLayout.tsx created\n');

console.log('🎉 All components generated successfully!');
console.log(`📂 Check the output directory: ${outputDir}`);
