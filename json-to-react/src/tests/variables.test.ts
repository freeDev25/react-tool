import Schema from "../schema/Schema";

// Example: Component with various types of variables
const VariableDemo = new Schema('VariableDemo', {
    firstName: { type: 'string', default: 'John' },
    lastName: { type: 'string', default: 'Doe' },
    items: { type: 'any[]', default: [] }
}, 
    Schema.node('div', {
        styles: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        },
        children: Schema.children(
            Schema.node('h1', {
                children: Schema.text('Variable Demo')
            }),
            Schema.node('div', {
                styles: { marginTop: '20px' },
                children: Schema.children(
                    Schema.node('p', {
                        children: Schema.text('Full Name: {fullName}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Total Items: {totalItems}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Display Name: {displayName}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Counter: {counter}')
                    })
                )
            })
        )
    })
);

// Add state
VariableDemo.addState('count', 'number', 0);

// Example 1: Simple constant
VariableDemo.addVariable('greeting', 'string', 'Hello, World!');

// Example 2: Computed variable (recalculated on every render)
VariableDemo.addVariable('fullName', 'string', 'firstName + " " + lastName', {
    computed: true
});

// Example 3: Memoized variable (only recalculates when dependencies change)
VariableDemo.addVariable('displayName', 'string', 'firstName.toUpperCase() + " " + lastName.toUpperCase()', {
    memoized: true,
    dependencies: ['firstName', 'lastName']
});

// Example 4: Let variable (mutable)
VariableDemo.addVariable('counter', 'number', 0, {
    const: false
});

// Example 5: Derived from state
VariableDemo.addVariable('doubleCount', 'number', 'count * 2', {
    computed: true
});

// Example 6: Complex computation with memoization
VariableDemo.addVariable('totalItems', 'number', 'items.reduce((acc, item) => acc + 1, 0)', {
    memoized: true,
    dependencies: ['items']
});

// Example 7: Object variable
VariableDemo.addVariable('config', 'object', { theme: 'dark', fontSize: 14 });

// Example 8: Array variable
VariableDemo.addVariable('colors', 'string[]', ['red', 'green', 'blue']);

// Example 9: Computed object
VariableDemo.addVariable('userInfo', 'object', '{ name: fullName, count: count }', {
    computed: true
});

export const VariableDemoSchema = VariableDemo;
