// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    proxy: {
      '/api': 'http://localhost:8080' // conntect to the backend through the port. Although i have to make sure that i allow the origin. 
    }
  }
})
