/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/tests/setup.ts', // this is for the mantine library, you do not have to setup anything for the project
  },
})
