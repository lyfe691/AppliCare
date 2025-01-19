// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { API_URL } from './src/config/urls'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': API_URL // conntect to the backend through the port. Although i have to make sure that i allow the origin. 
    }
  }
})
