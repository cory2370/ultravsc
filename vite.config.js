import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: process.env.NODE_ENV === 'production' ? '/ultravsc/' : '/',
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
})
