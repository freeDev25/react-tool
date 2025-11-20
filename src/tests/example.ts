import { ComponentGenerator } from "../parser";
import { Schema, SchemaText } from "../schema";

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
        src: 'https://via.placeholder.com/150',
        alt: 'Placeholder Image'
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
    props: { id: 'main-container' },
    styles: { padding: '10px', backgroundColor: '#f0f0f0' },
    children: [
        ExampleDivNode,
    ]
}

const H2Node: Schema = {
    type: 'node',
    nodeType: 'h2',
    children: [
        { type: 'text', children: ['Subheading'] }
    ]
}

const ComponentOne: Schema = {
    type: "component",
    name: 'ComponentOne',
    children: [ExampleComponent, H2Node, {
        type: 'node',
        nodeType: 'p',
        children: [
            {
                type: 'text',
                children: ['This is Component One rendering ExampleComponent and more.']
            }
        ]
    }]
};


async function main(): Promise<void> {
    console.log("Generating components...");
    const generator = new ComponentGenerator();
    
    // Generate ExampleComponent
    console.log("\n1. ExampleComponent:");
    generator.run(ExampleComponent);
    
    // Generate ComponentOne
    console.log("\n2. ComponentOne:");
    generator.run(ComponentOne);
    
    console.log("\nAll components generated and saved to output folder.");
    console.log("Check output/manifest.json for the generation record.");
}

main().catch(err => console.error(err));