import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for local Flask backend
      "/api": {
        target: "http://127.0.0.1:5000",  // Local Flask backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // Proxy for Spade Tools
      "/spade": {
        target: "https://spade.tools",  // Spade Tools
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/spade/, ""),
      },
    },
  },
});
