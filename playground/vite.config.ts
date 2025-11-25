import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from monorepo root and json-to-react workspace
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../json-to-react')
      ]
    }
  },
  resolve: {
    alias: {
      '@output': path.resolve(__dirname, '../json-to-react/output')
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  }
})
