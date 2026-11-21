// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  const BACKEND_URL = env.VITE_BACKEND_URL;

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false, // Allow self-signed HTTPS certs
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying request:', req.method, req.url);
            });
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
          },
        },
        '/qropay-api': {
          target: 'https://qropay.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/qropay-api/, '/api')
        }
      },
    }
  };
});
