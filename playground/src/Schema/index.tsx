import { title } from "process";
import { ComponentSchema } from "../components/DynamicComponentRenderer";

export const schema: ComponentSchema = {
    name: "MainComponent",
    type: "component",
    props: {
        showLeftSideBar: { type: "boolean", default: true },
        showRightSideBar: { type: "boolean", default: false },
        title: { type: "string", default: "Playground Application", required: true },
    },
    children: [
        {
            name: "Header",
            type: "component",
            props: {
                title: { type: "string", default: undefined },
            },
            propMapping: {
                title: "{parentProps.title}",
            },
            children: [
                {
                    type: "node",
                    nodeType: "h2",
                    children: "{parentProps.title}"
                }
            ]
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
    ],
};