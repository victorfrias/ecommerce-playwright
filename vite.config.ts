import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { authApiPlugin } from './server/authApi'

export default defineConfig({
  plugins: [react(), authApiPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
