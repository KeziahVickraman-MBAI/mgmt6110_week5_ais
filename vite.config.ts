import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import 'dotenv/config';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiRoutesPlugin(): Plugin {
  const handleApi = async (req: any, res: any, next: any) => {
    if (!req.url) return next();
    const pathname = req.url.split('?')[0];
    if (pathname === '/api/bus' || pathname === '/api/bus.js') {
      try {
        const { default: handler } = await import('./api/bus.js');
        return await handler(req, res);
      } catch (err) {
        console.error('Error in /api/bus:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
    }
    if (pathname === '/api/health' || pathname === '/api/health.js') {
      try {
        const { default: handler } = await import('./api/health.js');
        return await handler(req, res);
      } catch (err) {
        console.error('Error in /api/health:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
    }
    next();
  };

  return {
    name: 'vite-plugin-api-serverless',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
