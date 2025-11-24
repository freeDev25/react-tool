import { ComponentGenerator } from "./parser";
import { Schema, SchemaText } from "./schema";

const ExampleTextNode: SchemaText = {
    type: 'text',
    children: ['Hello, World!']
}

const ExampleH1Node: Schema = {
    type: 'node',
    nodeType: 'h1',
    children: [
        {
            type: 'text',
            children: ['Example Heading']
        }
    ],
    styles: {
        color: 'blue',
        fontSize: '24px'
    }
};

const ExampleParagraphNode: Schema = {
    type: 'node',
    nodeType: 'p',
    children: [ExampleTextNode],
};

const ExampleImageNode: Schema = {
    type: 'node',
    nodeType: 'img',
    props: {
        src: { type: 'string', default: 'https://picsum.photos/150/150' },
        alt: { type: 'string', default: 'Random Image' }
    },
    styles: {
        width: '150px',
        height: '150px'
    }
};

const ExampleDivNode: Schema = {
    type: 'node',
    nodeType: 'div',
    styles: {
        border: '2px solid black',
        padding: '10px',
        display: 'inline-block'
    },
    children: [ExampleH1Node, ExampleParagraphNode, ExampleImageNode],
};

const ExampleComponent: Schema = {
    type: 'component',
    name: 'ExampleComponent',
    props: { id: { type: 'string', default: 'main-container' } },
    styles: { padding: '10px', backgroundColor: '#f0f0f0' },
    children: [
        ExampleDivNode,
    ]
}

async function main(): Promise<void> {
    console.log("Generating demo components...");

    ComponentGenerator.resetManifest();

    const generator = new ComponentGenerator();
    generator.clearOutputFolder();

    const components = [
        { name: ExampleComponent }
    ];

    components.forEach((comp, index) => {
        console.log(`\n${index + 1}. ${comp.name.name}: Generated successfully.`);
        generator.run(comp.name);
    });

    console.log("\nDemo complete. Check output folder.");
}

main().catch(err => console.error(err));
