import { describe, it, expect } from 'vitest';
import { ComponentGenerator } from '../parser';
import { Schema, SchemaText } from '../schema';

// --- Schemas from example.ts ---

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

const HeaderComponent: Schema = {
    type: 'component',
    name: 'HeaderComponent',
    props: {
        title: { type: 'string', default: 'Default Title' }
    },
    children: [
        {
            type: 'node',
            nodeType: 'h1',
            children: [
                {
                    type: 'text',
                    children: ['{props.title}']
                }
            ],
            styles: {
                color: '#222',
                textAlign: 'center'
            }
        }
    ]
};

// --- Tests ---

describe('ComponentGenerator Regression', () => {
    it('should generate ExampleComponent correctly', () => {
        const generator = new ComponentGenerator();
        const code = generator.generate(ExampleComponent);
        expect(code).toMatchSnapshot();
    });

    it('should generate HeaderComponent correctly', () => {
        const generator = new ComponentGenerator();
        const code = generator.generate(HeaderComponent);
        expect(code).toMatchSnapshot();
    });
});
