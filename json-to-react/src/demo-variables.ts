import { VariableDemoSchema } from './tests/variables.test';
import * as fs from 'fs';
import * as path from 'path';

console.log('Generating component with variables...\n');

async function generateVariableDemo() {
    const result = await VariableDemoSchema.generate();
    
    console.log(`${result.name}: Generated successfully.`);
    console.log(JSON.stringify(VariableDemoSchema.schema, null, 2));
    console.log(result.path);
}

generateVariableDemo().then(() => {
    console.log('\nDemo complete. Check output folder.');
}).catch(err => {
    console.error('Error generating demo:', err);
});
