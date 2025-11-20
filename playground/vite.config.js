import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        fs: {
            // Allow serving files from the project root so we can import from ../output
            allow: [path.resolve(__dirname, '..')]
        }
    },
    resolve: {
        alias: {
            '@output': path.resolve(__dirname, '../output')
        }
    }
});
