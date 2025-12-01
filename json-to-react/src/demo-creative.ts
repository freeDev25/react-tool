import { WeatherDashboardSchema } from './tests/creative-example';

console.log('Generating Weather Dashboard - Creative Example combining Variables & Effects...\n');

async function generateCreativeExample() {
    const result = await WeatherDashboardSchema.generate();
    
    console.log(`${result.name}: Generated successfully.`);
    console.log('\n📊 Component Features:');
    console.log('   - 11 computed/memoized variables');
    console.log('   - 6 useEffect hooks with various patterns');
    console.log('   - Conditional rendering');
    console.log('   - Real-time weather data fetching');
    console.log('   - Auto-refresh with cleanup');
    console.log('   - Online/offline detection');
    console.log('   - Performance optimizations\n');
    console.log(result.path);
}

generateCreativeExample().then(() => {
    console.log('\n✨ Demo complete. Check output folder for the full component!');
}).catch(err => {
    console.error('Error generating demo:', err);
});
