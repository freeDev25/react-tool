import { ComponentGenerator } from "../parser";
import { BaseSchema } from "../schema";

const componentSchema: BaseSchema = {
    type: 'node',
    name: 'ExampleComponent',
    props: { id: 'main-container' },
    styles: { padding: '10px', backgroundColor: '#f0f0f0' },
    children: []
}

async function main(): Promise<void> {
    const generator = new ComponentGenerator();
    generator.run(componentSchema);
    console.log("Component generated and saved to output folder.");
}

main().catch(err => console.error(err));