import Schema from "../schema/Schema";

// Example 1: Counter Component with State and Event Handlers
const Counter = new Schema('Counter', {}, 
    Schema.node('div', {
        styles: {
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px'
        },
        children: Schema.children(
            Schema.node('h2', {
                children: Schema.text('Counter: {count}')
            }),
            Schema.node('div', {
                styles: { marginTop: '10px' },
                children: Schema.children(
                    Schema.node('button', {
                        props: { type: 'button' },
                        handlers: {
                            onClick: 'handleIncrement'
                        },
                        styles: {
                            padding: '10px 20px',
                            marginRight: '10px',
                            cursor: 'pointer'
                        },
                        // Text could be conditional like count < 10 ? "Increment" : "Maxed Out" 
                        children: Schema.text(`count < 10 ? "Increment" : "Maxed Out" `, {
                            isJsxText: true
                        })
                    }),
                    Schema.node('button', {
                        props: { type: 'button' },
                        handlers: {
                            onClick: 'handleDecrement'
                        },
                        condition: 'count > 0',
                        styles: {
                            padding: '10px 20px',
                            cursor: 'pointer'
                        },
                        children: Schema.text('Decrement')
                    })
                )
            })
        )
    })
);

Counter.addState('count', 'number', 0);
Counter.addState('step', 'number', 1);

Counter.addFunction('handleIncrement', [
    {
        name: 'event',
        type: 'React.MouseEvent<HTMLButtonElement>'
    }
], `
    event.stopPropagation();
    setCount(count + step);
`);

Counter.addFunction('handleDecrement', [
    {
        name: 'event',
        type: 'React.MouseEvent<HTMLButtonElement>'
    }
], `
    event.preventDefault();
    setCount(count - step);
`);

// Add hooks and logic to Counter
// (Counter.schema as any).hooks = [
//     {
//         type: 'useState',
//         name: 'count',
//         initialValue: 0
//     }
// ];

// (Counter.schema as any).componentLogic = `const handleIncrement = () => {
//         setCount(count + 1);
//     };

//     const handleDecrement = () => {
//         setCount(count - 1);
//     };`;

// // Example 2: Toggle Button with Conditional Rendering
// const ToggleMessage = new Schema('ToggleMessage', {}, 
//     Schema.node('div', {
//         styles: {
//             padding: '20px',
//             border: '1px solid #ccc',
//             borderRadius: '8px'
//         },
//         children: Schema.children(
//             Schema.node('button', {
//                 props: { type: 'button' },
//                 handlers: {
//                     onClick: 'toggleMessage'
//                 },
//                 styles: {
//                     padding: '10px 20px',
//                     marginBottom: '10px',
//                     cursor: 'pointer'
//                 },
//                 children: Schema.text('Toggle Message')
//             }),
//             Schema.node('p', {
//                 condition: 'isVisible',
//                 styles: {
//                     padding: '10px',
//                     backgroundColor: '#e3f2fd',
//                     borderRadius: '4px'
//                 },
//                 children: Schema.text('Hello! This message can be toggled.')
//             })
//         )
//     })
// );

// (ToggleMessage.schema as any).hooks = [
//     {
//         type: 'useState',
//         name: 'isVisible',
//         initialValue: true
//     }
// ];

// (ToggleMessage.schema as any).componentLogic = `const toggleMessage = () => {
//         setIsVisible(!isVisible);
//     };`;

// // Example 3: Input Form with onChange
// const InputForm = new Schema('InputForm', {}, 
//     Schema.node('div', {
//         styles: {
//             padding: '20px',
//             border: '1px solid #ccc',
//             borderRadius: '8px'
//         },
//         children: Schema.children(
//             Schema.node('input', {
//                 props: {
//                     type: 'text',
//                     placeholder: 'Enter your name'
//                 },
//                 handlers: {
//                     onChange: 'handleInputChange'
//                 },
//                 styles: {
//                     padding: '10px',
//                     width: '100%',
//                     marginBottom: '10px',
//                     border: '1px solid #ddd',
//                     borderRadius: '4px'
//                 }
//             }),
//             Schema.node('p', {
//                 condition: 'name',
//                 children: Schema.text('Hello, {name}!')
//             })
//         )
//     })
// );

// (InputForm.schema as any).hooks = [
//     {
//         type: 'useState',
//         name: 'name',
//         initialValue: ''
//     }
// ];

// (InputForm.schema as any).componentLogic = `const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setName(e.target.value);
//     };`;

// // Example 4: useEffect Example - Document Title
// const TitleUpdater = new Schema('TitleUpdater', {
//     pageTitle: { type: 'string', default: 'My Page' }
// }, 
//     Schema.node('div', {
//         styles: {
//             padding: '20px'
//         },
//         children: Schema.children(
//             Schema.node('h1', {
//                 children: Schema.text('{props.pageTitle}')
//             }),
//             Schema.node('p', {
//                 children: Schema.text('The document title updates with this page title!')
//             })
//         )
//     })
// );

// (TitleUpdater.schema as any).hooks = [
//     {
//         type: 'useEffect',
//         body: `document.title = props.pageTitle;`,
//         dependencies: ['props.pageTitle']
//     }
// ];

// // Example 5: Multiple Hooks - Timer with useEffect
// const Timer = new Schema('Timer', {}, 
//     Schema.node('div', {
//         styles: {
//             padding: '20px',
//             textAlign: 'center',
//             border: '1px solid #ccc',
//             borderRadius: '8px'
//         },
//         children: Schema.children(
//             Schema.node('h2', {
//                 children: Schema.text('Timer: {seconds}s')
//             }),
//             Schema.node('div', {
//                 styles: { marginTop: '10px' },
//                 children: Schema.children(
//                     Schema.node('button', {
//                         handlers: {
//                             onClick: 'toggleTimer'
//                         },
//                         styles: {
//                             padding: '10px 20px',
//                             marginRight: '10px',
//                             cursor: 'pointer'
//                         },
//                         children: Schema.text('{isRunning ? "Pause" : "Start"}')
//                     }),
//                     Schema.node('button', {
//                         handlers: {
//                             onClick: 'resetTimer'
//                         },
//                         styles: {
//                             padding: '10px 20px',
//                             cursor: 'pointer'
//                         },
//                         children: Schema.text('Reset')
//                     })
//                 )
//             })
//         )
//     })
// );

// (Timer.schema as any).hooks = [
//     {
//         type: 'useState',
//         name: 'seconds',
//         initialValue: 0
//     },
//     {
//         type: 'useState',
//         name: 'isRunning',
//         initialValue: false
//     },
//     {
//         type: 'useEffect',
//         body: `let interval: NodeJS.Timeout | null = null;
//         if (isRunning) {
//             interval = setInterval(() => {
//                 setSeconds(s => s + 1);
//             }, 1000);
//         }
//         return () => {
//             if (interval) clearInterval(interval);
//         };`,
//         dependencies: ['isRunning']
//     }
// ];

// (Timer.schema as any).componentLogic = `const toggleTimer = () => {
//         setIsRunning(!isRunning);
//     };

//     const resetTimer = () => {
//         setSeconds(0);
//         setIsRunning(false);
//     };`;

export const InteractiveSchemas: Schema[] = [
    Counter,
    // ToggleMessage,
    // InputForm,
    // TitleUpdater,
    // Timer
];
