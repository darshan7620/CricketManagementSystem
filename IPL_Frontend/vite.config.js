import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      usePolling: true,
      ignored: ['**/public/images/**'],
    },
    proxy: {
      '/player-api': 'http://localhost:9999',
      '/team-api': 'http://localhost:9999',
      '/admin-api': 'http://localhost:9999',
    },
  },
})
