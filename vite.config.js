import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/products': {
        target: 'https://loveleeva.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
