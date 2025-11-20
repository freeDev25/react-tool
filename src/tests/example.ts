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
        ExampleDivNode
    ]
}

async function main(): Promise<void> {
    console.log("ExampleComponent Schema:");
    console.log(ExampleComponent);
    const generator = new ComponentGenerator();
    generator.run(ExampleComponent);
    console.log("ExampleComponent generated and saved to output folder.");
}

main().catch(err => console.error(err));