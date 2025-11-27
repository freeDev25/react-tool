import Schema from "../schema/Schema";

// Example: Component with various types of useEffect hooks
const EffectDemo = new Schema('EffectDemo', {
    userId: { type: 'string', default: '123' },
    enabled: { type: 'boolean', default: true }
}, 
    Schema.node('div', {
        styles: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        },
        children: Schema.children(
            Schema.node('h1', {
                children: Schema.text('Effect Demo')
            }),
            Schema.node('div', {
                styles: { marginTop: '20px' },
                children: Schema.children(
                    Schema.node('p', {
                        children: Schema.text('User ID: {userId}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Data: {data || "Loading..."}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Timer: {timer}')
                    }),
                    Schema.node('p', {
                        children: Schema.text('Mouse Position: ({mouseX}, {mouseY})')
                    })
                )
            })
        )
    })
);

// Add state
EffectDemo.addState('data', 'string | null', null);
EffectDemo.addState('timer', 'number', 0);
EffectDemo.addState('mouseX', 'number', 0);
EffectDemo.addState('mouseY', 'number', 0);

// Example 1: Mount-only effect (runs once on mount)
EffectDemo.addEffect('onMount', `
console.log('Component mounted');
document.title = 'Effect Demo - Mounted';
`, {
    dependencies: [] // Empty array means run only on mount
});

// Example 2: Effect with cleanup (event listeners, subscriptions)
EffectDemo.addEffect('mouseTracking', `
const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
};
window.addEventListener('mousemove', handleMouseMove);
`, {
    dependencies: [],
    cleanup: `
window.removeEventListener('mousemove', handleMouseMove);
console.log('Mouse tracking cleaned up');
`
});

// Example 3: Effect with dependencies (runs when dependencies change)
EffectDemo.addEffect('updateTitle', `
document.title = \`User: \${userId}\`;
console.log('Title updated for user:', userId);
`, {
    dependencies: ['userId']
});

// Example 4: Async effect (data fetching)
EffectDemo.addEffect('fetchUserData', `
try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const result = await response.json();
    setData(result.name);
} catch (error) {
    console.error('Error fetching user data:', error);
    setData('Error loading data');
}
`, {
    async: true,
    dependencies: ['userId']
});

// Example 5: Conditional effect (only runs if condition is met)
EffectDemo.addEffect('conditionalLogger', `
console.log('Enabled state is true, user:', userId);
`, {
    condition: 'enabled',
    dependencies: ['enabled', 'userId']
});

// Example 6: Timer effect with cleanup
EffectDemo.addEffect('timerInterval', `
const interval = setInterval(() => {
    setTimer(prev => prev + 1);
}, 1000);
`, {
    dependencies: [],
    cleanup: `
clearInterval(interval);
console.log('Timer interval cleared');
`
});

// Example 7: Effect that runs on every render (no dependency array)
// Note: This is rarely needed and can cause performance issues
EffectDemo.addEffect('onEveryRender', `
console.log('Component rendered at:', new Date().toISOString());
`);

// Example 8: Complex async effect with abort controller
EffectDemo.addEffect('abortableFetch', `
const controller = new AbortController();
try {
    const response = await fetch(\`/api/data/\${userId}\`, {
        signal: controller.signal
    });
    const result = await response.json();
    console.log('Fetched data:', result);
} catch (error) {
    if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
    }
}
`, {
    async: true,
    dependencies: ['userId'],
    cleanup: `
controller.abort();
console.log('Fetch aborted');
`
});

export const EffectDemoSchema = EffectDemo;
