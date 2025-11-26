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

// 2. Navigation Item
const NavItem = new Schema('NavItem',
    {
        label: { type: 'string', required: true },
        isActive: { type: 'boolean', default: false }
    },
    Schema.node('div', {
        styles: {
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '4px',
            marginBottom: '4px',
            color: '#333'
        },
        children: Schema.text('{props.label}')
    })
);

// 3. Sidebar
const DashboardSidebar = new Schema('DashboardSidebar',
    {
        userName: { type: 'string', default: 'User' }
    },
    Schema.node('div', {
        styles: {
            width: '250px',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e9ecef',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
        },
        children: Schema.children(
            Schema.node('h2', {
                styles: { marginBottom: '20px', color: '#2c3e50' },
                children: Schema.text('Dashboard')
            }),
            Schema.component('NavItem', {
                label: 'Overview',
                isActive: true
            }),
            Schema.component('NavItem', {
                label: 'Analytics'
            }),
            Schema.component('NavItem', {
                label: 'Settings'
            })
        )
    })
);

// 4. Header
const DashboardHeader = new Schema('DashboardHeader',
    {
        userName: { type: 'string', default: 'User' }
    },
    Schema.node('div', {
        styles: {
            height: '60px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
        },
        children: Schema.children(
            Schema.node('div', {
                // Empty left side for search bar potentially
            }),
            Schema.node('div', {
                styles: { display: 'flex', alignItems: 'center', gap: '10px' },
                children: Schema.children(
                    Schema.node('span', {
                        children: Schema.text('Welcome, {props.userName}')
                    }),
                    Schema.node('img', {
                        styles: { borderRadius: '50%', width: '40px', height: '40px' }
                    }, {
                        src: 'https://via.placeholder.com/40',
                        alt: 'Avatar'
                    })
                )
            })
        )
    })
);

// 5. Empty Wrapper (Testing Fragment Support)
const GridWrapper = new Schema('GridWrapper',
    {},
    Schema.node('div', {})
);

// 6. Main Dashboard Layout
const ComplexDashboard = new Schema('ComplexDashboard',
    {
        userName: { type: 'string', default: 'User' }
    },
    Schema.node('div', {
        styles: {
            display: 'flex',
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        },
        children: Schema.children(
            Schema.component('DashboardSidebar', {
                userName: '{props.userName}'
            }),
            Schema.node('div', {
                styles: { flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f8' },
                children: Schema.children(
                    Schema.component('DashboardHeader', {
                        userName: '{props.userName}'
                    }),
                    Schema.node('main', {
                        styles: { padding: '20px', overflowY: 'auto' },
                        children: Schema.children(
                            Schema.component('GridWrapper', {}, {
                                children: Schema.children(
                                    Schema.node('div', {
                                        styles: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '20px',
                                            marginBottom: '30px'
                                        },
                                        children: Schema.children(
                                            Schema.component('StatCard', {
                                                title: 'Total Users',
                                                value: '1,234',
                                                trend: 'up'
                                            }),
                                            Schema.component('StatCard', {
                                                title: 'Revenue',
                                                value: '$45,678',
                                                trend: 'up'
                                            }),
                                            Schema.component('StatCard', {
                                                title: 'Bounce Rate',
                                                value: '23%',
                                                trend: 'down'
                                            })
                                        )
                                    })
                                )
                            }),
                            Schema.node('div', {
                                styles: { backgroundColor: 'white', padding: '20px', borderRadius: '8px' },
                                children: Schema.children(
                                    Schema.node('h3', {
                                        children: Schema.text('Recent Activity')
                                    }),
                                    Schema.node('p', {
                                        children: Schema.text('No recent activity to show.')
                                    })
                                )
                            })
                        )
                    })
                )
            })
        )
    })
);

export const ComplexSchemas: Schema[] = [
    StatCard,
    NavItem,
    DashboardSidebar,
    DashboardHeader,
    GridWrapper,
    ComplexDashboard
]
