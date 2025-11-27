import { EffectDemoSchema } from './tests/effects.test';

console.log('Generating component with effects...\n');

async function generateEffectDemo() {
    const result = await EffectDemoSchema.generate();
    
    console.log(`${result.name}: Generated successfully.`);
    console.log(JSON.stringify(EffectDemoSchema.schema, null, 2));
    console.log(result.path);
}

generateEffectDemo().then(() => {
    console.log('\nDemo complete. Check output folder.');
}).catch(err => {
    console.error('Error generating demo:', err);
});
