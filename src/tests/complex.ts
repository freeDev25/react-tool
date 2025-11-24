import Schema from "../schema/Schema";

// 1. Reusable Stat Card Component
const StatCard = new Schema('StatCard',
    {
        title: { type: 'string', default: 'Stat' },
        value: { type: 'string', default: '0' },
        trend: { type: 'string', default: 'neutral' } // up, down, neutral
    },
    Schema.node('div', {
        styles: {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
        },
        children: Schema.children(
            Schema.node('h4', {
                styles: {
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    color: '#333'
                },
                children: Schema.text('{props.title}')
            }),
            Schema.node('div', {
                styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#000'
                },
                children: Schema.text('{props.value}')
            }),
            Schema.node('span', {
                styles: {
                    display: 'inline-block',
                    marginTop: '8px',
                    fontSize: '14px',
                    color: '#666'
                },
                children: Schema.text('Trend: {props.trend}')
            })
        )
    })
);

// // 2. Navigation Item
// const NavItem = new SchemaGenerator({
//     type: 'component',
//     name: 'NavItem',
//     props: {
//         label: { type: 'string', required: true },
//         isActive: { type: 'boolean', default: false }
//     },
//     styles: {
//         padding: '10px 15px',
//         cursor: 'pointer',
//         borderRadius: '4px',
//         marginBottom: '4px',
//         color: '#333'
//     },
//     children: [
//         { type: 'text', children: ['{props.label}'] }
//     ]
// });

// // 3. Sidebar
// const DashboardSidebar = new SchemaGenerator({
//     type: 'component',
//     name: 'DashboardSidebar',
//     styles: {
//         width: '250px',
//         backgroundColor: '#f8f9fa',
//         borderRight: '1px solid #e9ecef',
//         padding: '20px',
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     props: {
//         userName: { type: 'string', default: 'User' }
//     },
//     children: [
//         {
//             type: 'node',
//             nodeType: 'h2',
//             styles: { marginBottom: '20px', color: '#2c3e50' },
//             children: [{ type: 'text', children: ['Dashboard'] }]
//         },
//         {
//             type: 'component',
//             name: 'NavItem',
//             props: { label: { type: 'string', default: 'Overview' }, isActive: { type: 'boolean', default: true } }
//         },
//         {
//             type: 'component',
//             name: 'NavItem',
//             props: { label: { type: 'string', default: 'Analytics' } }
//         },
//         {
//             type: 'component',
//             name: 'NavItem',
//             props: { label: { type: 'string', default: 'Settings' } }
//         }
//     ]
// });

// // 4. Header
// const DashboardHeader = new SchemaGenerator({
//     type: 'component',
//     name: 'DashboardHeader',
//     props: {
//         userName: { type: 'string', default: 'User' }
//     },
//     styles: {
//         height: '60px',
//         backgroundColor: 'white',
//         borderBottom: '1px solid #e9ecef',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '0 20px'
//     },
//     children: [
//         {
//             type: 'node',
//             nodeType: 'div',
//             // Empty left side for search bar potentially
//         },
//         {
//             type: 'node',
//             nodeType: 'div',
//             styles: { display: 'flex', alignItems: 'center', gap: '10px' },
//             children: [
//                 {
//                     type: 'node',
//                     nodeType: 'span',
//                     children: [{ type: 'text', children: ['Welcome, {props.userName}'] }]
//                 },
//                 {
//                     type: 'node',
//                     nodeType: 'img',
//                     props: {
//                         src: { type: 'string', default: 'https://via.placeholder.com/40' },
//                         alt: { type: 'string', default: 'Avatar' }
//                     },
//                     styles: { borderRadius: '50%', width: '40px', height: '40px' }
//                 }
//             ]
//         }
//     ]
// });

// // 5. Empty Wrapper (Testing Fragment Support)
// const GridWrapper = new SchemaGenerator({
//     type: 'component',
//     name: 'GridWrapper',
//     // No props, no styles -> Should be Fragment
// });

// // 6. Main Dashboard Layout
// const ComplexDashboard = new SchemaGenerator({
//     type: 'component',
//     name: 'ComplexDashboard',
//     props: {
//         userName: { type: 'string', default: 'User' }
//     },
//     styles: {
//         display: 'flex',
//         height: '100vh',
//         fontFamily: 'Arial, sans-serif'
//     },
//     children: [
//         DashboardHeader.toComponent({
//             userName: {
//                 mappedTo: 'userName'
//             }
//         }),
//         {
//             type: 'node',
//             nodeType: 'div',
//             styles: { flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f8' },
//             children: [
//                 DashboardHeader.toComponent({
//                     userName: {
//                         mappedTo: 'userName'
//                     }
//                 }),
//                 {
//                     type: 'node',
//                     nodeType: 'main',
//                     styles: { padding: '20px', overflowY: 'auto' },
//                     children: [
//                         {
//                             type: 'component',
//                             name: 'GridWrapper',
//                             children: [
//                                 {
//                                     type: 'node',
//                                     nodeType: 'div',
//                                     styles: {
//                                         display: 'grid',
//                                         gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                                         gap: '20px',
//                                         marginBottom: '30px'
//                                     },
//                                     children: [
//                                         {
//                                             type: 'component',
//                                             name: 'StatCard',
//                                             props: { title: { type: 'string', default: 'Total Users' }, value: { type: 'string', default: '1,234' }, trend: { type: 'string', default: 'up' } }
//                                         },
//                                         {
//                                             type: 'component',
//                                             name: 'StatCard',
//                                             props: { title: { type: 'string', default: 'Revenue' }, value: { type: 'string', default: '$45,678' }, trend: { type: 'string', default: 'up' } }
//                                         },
//                                         {
//                                             type: 'component',
//                                             name: 'StatCard',
//                                             props: { title: { type: 'string', default: 'Bounce Rate' }, value: { type: 'string', default: '23%' }, trend: { type: 'string', default: 'down' } }
//                                         }
//                                     ]
//                                 }
//                             ]
//                         },
//                         {
//                             type: 'node',
//                             nodeType: 'div',
//                             styles: { backgroundColor: 'white', padding: '20px', borderRadius: '8px' },
//                             children: [
//                                 {
//                                     type: 'node',
//                                     nodeType: 'h3',
//                                     children: [{ type: 'text', children: ['Recent Activity'] }]
//                                 },
//                                 {
//                                     type: 'node',
//                                     nodeType: 'p',
//                                     children: [{ type: 'text', children: ['No recent activity to show.'] }]
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// });

export const ComplexSchemas: Schema[] = [
    StatCard
]
