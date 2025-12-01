import Schema from "../schema/Schema";

// Creative Example: Real-time Weather Dashboard
// Demonstrates the power of combining variables and effects
const WeatherDashboard = new Schema('WeatherDashboard', {
    city: { type: 'string', default: 'New York' },
    units: { type: 'string', default: 'metric' } // metric or imperial
}, 
    Schema.node('div', {
        styles: {
            padding: '30px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            color: 'white'
        },
        children: Schema.children(
            // Header
            Schema.node('header', {
                styles: {
                    textAlign: 'center',
                    marginBottom: '40px'
                },
                children: Schema.children(
                    Schema.node('h1', {
                        styles: { fontSize: '2.5rem', marginBottom: '10px' },
                        children: Schema.text('🌤️ Weather Dashboard')
                    }),
                    Schema.node('p', {
                        styles: { fontSize: '1.2rem', opacity: '0.9' },
                        children: Schema.text('{displayCity}')
                    })
                )
            }),

            // Status Badge
            Schema.node('div', {
                condition: 'isOnline',
                styles: {
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(72, 187, 120, 0.3)',
                    borderRadius: '20px',
                    marginBottom: '20px'
                },
                children: Schema.text('🟢 Live Data')
            }),

            // Main Weather Card
            Schema.node('div', {
                styles: {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                },
                children: Schema.children(
                    // Loading State
                    Schema.node('div', {
                        condition: 'isLoading',
                        styles: {
                            textAlign: 'center',
                            fontSize: '1.5rem'
                        },
                        children: Schema.text('⏳ Loading weather data...')
                    }),

                    // Error State
                    Schema.node('div', {
                        condition: 'error',
                        styles: {
                            textAlign: 'center',
                            color: '#fc8181',
                            fontSize: '1.2rem'
                        },
                        children: Schema.text('❌ {error}')
                    }),

                    // Weather Data
                    Schema.node('div', {
                        condition: '!isLoading && !error && weather',
                        children: Schema.children(
                            // Temperature
                            Schema.node('div', {
                                styles: {
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: '20px'
                                },
                                children: Schema.text('{temperatureDisplay}')
                            }),

                            // Description
                            Schema.node('div', {
                                styles: {
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    marginBottom: '30px',
                                    textTransform: 'capitalize'
                                },
                                children: Schema.text('{weatherDescription}')
                            }),

                            // Stats Grid
                            Schema.node('div', {
                                styles: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '20px'
                                },
                                children: Schema.children(
                                    // Humidity
                                    Schema.node('div', {
                                        styles: {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            textAlign: 'center'
                                        },
                                        children: Schema.children(
                                            Schema.node('div', {
                                                styles: { fontSize: '2rem' },
                                                children: Schema.text('💧')
                                            }),
                                            Schema.node('div', {
                                                styles: { fontSize: '1.5rem', fontWeight: 'bold' },
                                                children: Schema.text('{humidityDisplay}')
                                            }),
                                            Schema.node('div', {
                                                styles: { fontSize: '0.9rem', opacity: '0.8' },
                                                children: Schema.text('Humidity')
                                            })
                                        )
                                    }),

                                    // Wind Speed
                                    Schema.node('div', {
                                        styles: {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            textAlign: 'center'
                                        },
                                        children: Schema.children(
                                            Schema.node('div', {
                                                styles: { fontSize: '2rem' },
                                                children: Schema.text('💨')
                                            }),
                                            Schema.node('div', {
                                                styles: { fontSize: '1.5rem', fontWeight: 'bold' },
                                                children: Schema.text('{windSpeedDisplay}')
                                            }),
                                            Schema.node('div', {
                                                styles: { fontSize: '0.9rem', opacity: '0.8' },
                                                children: Schema.text('Wind Speed')
                                            })
                                        )
                                    })
                                )
                            })
                        )
                    })
                )
            }),

            // Refresh Info
            Schema.node('div', {
                styles: {
                    textAlign: 'center',
                    opacity: '0.8',
                    fontSize: '0.9rem'
                },
                children: Schema.text('Last updated: {lastUpdateTime}')
            }),

            // Auto-refresh indicator
            Schema.node('div', {
                condition: 'autoRefreshEnabled',
                styles: {
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '0.85rem',
                    opacity: '0.7'
                },
                children: Schema.text('🔄 Auto-refreshing every {refreshIntervalSeconds}s')
            })
        )
    })
);

// ========== STATE ==========
WeatherDashboard.addState('weather', 'any', null);
WeatherDashboard.addState('isLoading', 'boolean', true);
WeatherDashboard.addState('error', 'string | null', null);
WeatherDashboard.addState('lastUpdate', 'number', 'Date.now()');
WeatherDashboard.addState('isOnline', 'boolean', true);
WeatherDashboard.addState('autoRefreshEnabled', 'boolean', true);

// ========== VARIABLES ==========

// Simple constants
WeatherDashboard.addVariable('apiKey', 'string', 'demo_api_key_12345');
WeatherDashboard.addVariable('refreshInterval', 'number', 60000); // 60 seconds

// Computed variables from props
WeatherDashboard.addVariable('displayCity', 'string', 'city.charAt(0).toUpperCase() + city.slice(1)', {
    computed: true
});

// Memoized computed variable
WeatherDashboard.addVariable('apiUrl', 'string', '`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`', {
    memoized: true,
    dependencies: ['city', 'units']
});

// Computed from state - Temperature with unit
WeatherDashboard.addVariable('temperatureDisplay', 'string', 'weather ? `${Math.round(weather.main.temp)}°${units === "metric" ? "C" : "F"}` : "--"', {
    computed: true
});

// Computed from state - Weather description
WeatherDashboard.addVariable('weatherDescription', 'string', 'weather?.weather?.[0]?.description || "No data"', {
    computed: true
});

// Computed from state - Humidity
WeatherDashboard.addVariable('humidityDisplay', 'string', 'weather ? `${weather.main.humidity}%` : "--"', {
    computed: true
});

// Computed from state - Wind speed with unit
WeatherDashboard.addVariable('windSpeedDisplay', 'string', 'weather ? `${weather.wind.speed} ${units === "metric" ? "m/s" : "mph"}` : "--"', {
    computed: true
});

// Memoized time formatting
WeatherDashboard.addVariable('lastUpdateTime', 'string', 'new Date(lastUpdate).toLocaleTimeString()', {
    memoized: true,
    dependencies: ['lastUpdate']
});

// Computed constant
WeatherDashboard.addVariable('refreshIntervalSeconds', 'number', 'refreshInterval / 1000', {
    computed: true
});

// ========== EFFECTS ==========

// Effect 1: Fetch weather data on mount and when city/units change
WeatherDashboard.addEffect('fetchWeather', `
setIsLoading(true);
setError(null);

try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    setWeather(data);
    setLastUpdate(Date.now());
} catch (err) {
    setError(err.message || 'Failed to load weather data');
    console.error('Weather fetch error:', err);
} finally {
    setIsLoading(false);
}
`, {
    async: true,
    dependencies: ['apiUrl']
});

// Effect 2: Auto-refresh weather data
WeatherDashboard.addEffect('autoRefresh', `
const interval = setInterval(async () => {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            setWeather(data);
            setLastUpdate(Date.now());
        }
    } catch (err) {
        console.error('Auto-refresh error:', err);
    }
}, refreshInterval);
`, {
    condition: 'autoRefreshEnabled',
    dependencies: ['autoRefreshEnabled', 'apiUrl', 'refreshInterval'],
    cleanup: `
clearInterval(interval);
console.log('Auto-refresh stopped');
`
});

// Effect 3: Monitor online/offline status
WeatherDashboard.addEffect('onlineStatus', `
const handleOnline = () => setIsOnline(true);
const handleOffline = () => setIsOnline(false);

window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
`, {
    dependencies: [],
    cleanup: `
window.removeEventListener('online', handleOnline);
window.removeEventListener('offline', handleOffline);
`
});

// Effect 4: Log when weather data changes
WeatherDashboard.addEffect('weatherLogger', `
console.log('Weather data updated:', {
    city: displayCity,
    temp: temperatureDisplay,
    description: weatherDescription,
    timestamp: lastUpdateTime
});
`, {
    condition: 'weather',
    dependencies: ['weather', 'displayCity', 'temperatureDisplay', 'weatherDescription', 'lastUpdateTime']
});

// Effect 5: Update document title with current temperature
WeatherDashboard.addEffect('updateDocTitle', `
document.title = weather 
    ? \`\${temperatureDisplay} - \${displayCity} Weather\`
    : 'Weather Dashboard';
`, {
    dependencies: ['weather', 'temperatureDisplay', 'displayCity']
});

// Effect 6: Pause auto-refresh when tab is not visible (performance optimization)
WeatherDashboard.addEffect('visibilityHandler', `
const handleVisibilityChange = () => {
    if (document.hidden) {
        console.log('Tab hidden - pausing auto-refresh');
        setAutoRefreshEnabled(false);
    } else {
        console.log('Tab visible - resuming auto-refresh');
        setAutoRefreshEnabled(true);
    }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
`, {
    dependencies: [],
    cleanup: `
document.removeEventListener('visibilitychange', handleVisibilityChange);
`
});

export const WeatherDashboardSchema = WeatherDashboard;
