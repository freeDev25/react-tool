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

const imageComponent: Schema = {
    type: 'node',
    nodeType: 'img',
    props: {
        src: { type: 'string', default: 'https://via.placeholder.com/300' },
        alt: { type: 'string', default: 'Demo Image' }
    },
    styles: {
        width: '300px',
        height: '300px'
    }
};

const LeftSideBar: Schema = {
    type: 'component',
    name: 'LeftSideBar',
    props: {
        width: { type: 'number', default: 250 }
    },
    styles: {
        width: '250px',
        backgroundColor: '#e0e0e0',
        padding: '10px',
        boxSizing: 'border-box'
    },
    children: [
        {
            type: 'node',
            nodeType: 'h3',
            children: [
                {
                    type: 'text',
                    children: ['Left Side Bar']
                }
            ]
        }
    ]
};

const RightSideBar: Schema = {
    type: 'component',
    name: 'RightSideBar',
    props: {
        width: { type: 'number', default: 200 }
    },
    styles: {
        width: '200px',
        backgroundColor: '#e0e0e0',
        padding: '10px',
        boxSizing: 'border-box'
    },
    children: [
        {
            type: 'node',
            nodeType: 'h3',
            children: [
                {
                    type: 'text',
                    children: ['Right Side Bar']
                }
            ]
        }
    ]
};

const ContentArea: Schema = {
    type: 'component',
    name: 'ContentArea'
};

const MainContent: Schema = {
    type: 'component',
    name: 'MainContent',
    styles: {
        flex: '1',
        padding: '10px',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc'
    },
    children: [
        {
            type: 'node',
            nodeType: 'h2',
            children: [
                {
                    type: 'text',
                    children: ['Main Content Area']
                }
            ]
        },
        {
            type: 'node',
            nodeType: 'p',
            children: [
                {
                    type: 'text',
                    children: ['This is the main content area. Here is an image below:']
                }
            ]
        },
        imageComponent
    ]
};

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

export const Footer: Schema = {
    type: 'component',
    name: 'Footer',
    props: {
        text: { type: 'string', default: '© 2024 My Company' }
    },
    styles: {
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        marginTop: '10px'
    },
    children: [
        {
            type: 'node',
            nodeType: 'p',
            children: [
                {
                    type: 'text',
                    children: ['{props.text}']
                }
            ]
        }
    ]
};


export const MainComponent: Schema = {
    name: "MainComponent",
    type: "component",
    props: {
        showLeftSideBar: { type: "boolean", default: true },
        showRightSideBar: { type: "boolean", default: false },
        title: { type: "string", default: "Playground Application", required: true },
        act: { type: "string", default: "active"},
        border: { type: "string", default: "1px solid black"}
    },
    children: [
        {
            type: 'node',
            nodeType: 'div',
            styles: { padding: '20px', backgroundColor: '#f0f0f0' },
            children: [
                {
                    name: "HeaderComponent",
                    type: "component",
                    props: {
                        title: { isPropMapped: true, mappedTo: 'title'},
                    },
                },
                {
                    name: "ContentArea",
                    type: "component",
                    props: {},
                    children: [
                        {
                            name: "LeftSideBar",
                            type: "component",
                            props: {
                                width: { type: "number", default: 250 },
                            },
                        },
                        {
                            name: "MainContent",
                            type: "component",
                            props: {
                                text: { type: "string", default: "This is the main content area." },
                            },
                        },
                        {
                            name: "RightSideBar",
                            type: "component",
                            props: {
                                width: { type: "number", default: 200 },
                            },
                        },
                    ],
                },
                {
                    name: "Footer",
                    type: "component",
                    props: {
                        text: { type: "string", default: "© 2024 Playground Inc." },
                    },
                },
            ]
        }
    ],
};

async function main(): Promise<void> {
    console.log("Generating components...");
    
    // Reset manifest before generating components
    ComponentGenerator.resetManifest();
    console.log("Manifest reset.");
    
    const generator = new ComponentGenerator();

    // Clear output folder before generating new components
    generator.clearOutputFolder();

    const components = [
        { name: HeaderComponent },
        { name: LeftSideBar },
        { name: MainContent },
        { name: ContentArea },
        { name: RightSideBar },
        { name: Footer },
        { name: MainComponent },
    ];

    components.forEach((comp, index) => {
        console.log(`\n${index + 1}. ${comp.name.name}: Generated successfully.`);
        generator.run(comp.name);
    });
    
    console.log("\nAll components generated and saved to output folder.");
    console.log("Check output/manifest.json for the generation record.");
}

main().catch(err => console.error(err));