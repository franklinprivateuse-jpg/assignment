import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use /assignment/ base for production builds (GitHub Pages sub-path);
  // keep '/' for the dev server so localhost URLs stay short
  base: command === 'build' ? '/assignment/' : '/',
  plugins: [react()],
  server: {
    // Forward /api to the Spring Boot backend so the frontend can use
    // same-origin relative URLs (no CORS issues during development)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
}))
