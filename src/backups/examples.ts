import { BaseSchema, JSONSchema } from './types';

export const userProfileSchema: JSONSchema = {
    type: 'object',
    title: 'User Profile',
    description: 'Create or update your user profile',
    required: ['firstName', 'lastName', 'email'],
    properties: {
        firstName: {
            type: 'string',
            title: 'First Name',
            minLength: 2,
            maxLength: 50,
        },
        lastName: {
            type: 'string',
            title: 'Last Name',
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: 'string',
            title: 'Email Address',
            format: 'email',
        },
        age: {
            type: 'integer',
            title: 'Age',
            minimum: 18,
            maximum: 120,
        },
        bio: {
            type: 'string',
            title: 'Biography',
            description: 'Tell us about yourself',
            maxLength: 500,
        },
        country: {
            type: 'string',
            title: 'Country',
            enum: ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Other'],
        },
        newsletter: {
            type: 'boolean',
            title: 'Subscribe to Newsletter',
            default: false,
        },
    },
};

export const contactFormSchema: JSONSchema = {
    type: 'object',
    title: 'Contact Us',
    description: 'Send us a message and we will get back to you',
    required: ['name', 'email', 'message'],
    properties: {
        name: {
            type: 'string',
            title: 'Full Name',
            minLength: 2,
        },
        email: {
            type: 'string',
            title: 'Email',
            format: 'email',
        },
        phone: {
            type: 'string',
            title: 'Phone Number',
            description: 'Optional contact number',
        },
        subject: {
            type: 'string',
            title: 'Subject',
            enum: ['General Inquiry', 'Technical Support', 'Feedback', 'Other'],
        },
        message: {
            type: 'string',
            title: 'Message',
            minLength: 10,
            maxLength: 1000,
        },
    },
};

export const productSchema: JSONSchema = {
    type: 'object',
    title: 'Product Information',
    description: 'Add a new product to the catalog',
    required: ['name', 'price', 'category'],
    properties: {
        name: {
            type: 'string',
            title: 'Product Name',
            minLength: 3,
            maxLength: 100,
        },
        description: {
            type: 'string',
            title: 'Description',
            maxLength: 500,
        },
        price: {
            type: 'number',
            title: 'Price (USD)',
            minimum: 0,
        },
        category: {
            type: 'string',
            title: 'Category',
            enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other'],
        },
        inStock: {
            type: 'boolean',
            title: 'In Stock',
            default: true,
        },
        sku: {
            type: 'string',
            title: 'SKU',
            description: 'Stock Keeping Unit',
            pattern: '^[A-Z0-9-]+$',
        },
    },
};

export const box: BaseSchema = {
    id: 'box1',
    type: "Div",
    name: 'ContainerBox',
    layout: { "width": 560, "height": 60, "x": 20, "y": 200 },
    styles: {},
    props: {},
    children: []
}

export const complexLayout: BaseSchema = {
    id: 'root',
    type: 'Div',
    name: 'ComplexLayout',
    layout: { width: 800, height: 600 },
    styles: {
        'background-color': '#f5f5f5',
        'padding': '20px',
        'border-radius': '8px'
    },
    props: {},
    children: [
        {
            id: 'header',
            type: 'Div',
            name: 'Header',
            layout: { width: 760, height: 80 },
            styles: {
                'background-color': '#4CAF50',
                'color': 'white',
                'padding': '20px',
                'border-radius': '4px',
                'margin-bottom': '20px'
            },
            props: {},
            children: [
                {
                    id: 'title',
                    type: 'Text',
                    name: 'Title',
                    layout: {},
                    styles: {
                        'font-size': '24px',
                        'font-weight': 'bold'
                    },
                    props: {},
                    children: []
                }
            ]
        },
        {
            id: 'content',
            type: 'Div',
            name: 'Content',
            layout: { width: 760, height: 400 },
            styles: {
                'background-color': 'white',
                'padding': '20px',
                'border-radius': '4px',
                'box-shadow': '0 2px 4px rgba(0,0,0,0.1)'
            },
            props: {},
            children: [
                {
                    id: 'image',
                    type: 'Image',
                    name: 'BannerImage',
                    layout: { width: 720, height: 200 },
                    styles: {
                        'border-radius': '4px',
                        'object-fit': 'cover'
                    },
                    props: {
                        src: 'https://via.placeholder.com/720x200',
                        alt: 'Banner'
                    },
                    children: []
                },
                {
                    id: 'description',
                    type: 'Text',
                    name: 'Description',
                    layout: {},
                    styles: {
                        'display': 'block',
                        'margin-top': '16px',
                        'color': '#666',
                        'line-height': '1.6'
                    },
                    props: {},
                    children: []
                }
            ]
        }
    ]
}
