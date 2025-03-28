import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.8.40:8000',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        rewrite: (path) => path,  // Don't remove the /api prefix
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Request URL:', req.url);
            console.log('Request Method:', req.method);
            console.log('Request Body:', req.body);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (proxyRes.statusCode === 404) {
              console.log('404 Not Found:', {
                url: req.url,
                method: req.method,
                headers: req.headers
              });
            }
          });
        }
      }
    }
  },
  // Disable WebSocket connection status messages
  hmr: {
    overlay: false
  },
  logLevel: 'error'
})
