import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  preview: {
    // Allow your deployed Railway frontend host
    allowedHosts: [
      'genuine-freedom-production-62cb.up.railway.app',
      'localhost' // Optional: allow local preview as well
    ]
  }
})
