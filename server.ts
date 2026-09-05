import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

import http from 'http';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5173;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

// Forward all /api/* requests directly to FastAPI backend via streaming proxy
app.use('/api', (req: Request, res: Response) => {
  try {
    const targetUrl = new URL(`${FASTAPI_URL}/api${req.url}`);

    const headers: http.OutgoingHttpHeaders = {};
    for (const [key, val] of Object.entries(req.headers)) {
      if (key.toLowerCase() !== 'host' && val !== undefined) {
        headers[key] = val;
      }
    }
    headers['host'] = targetUrl.host;

    const proxyReq = http.request({
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method: req.method,
      headers: headers
    }, (proxyRes) => {
      res.status(proxyRes.statusCode || 500);
      for (const [key, val] of Object.entries(proxyRes.headers)) {
        if (val !== undefined) {
          res.setHeader(key, val);
        }
      }
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.warn(`[Proxy Notice] Could not connect to FastAPI at ${targetUrl.toString()}: ${err.message}`);
      if (!res.headersSent) {
        res.status(503).json({
          error: 'Backend API service is warming up. Please ensure FastAPI is running.',
          detail: err.message
        });
      }
    });

    req.pipe(proxyReq);
  } catch (err: any) {
    console.warn(`[Proxy Notice] URL parsing error: ${err.message}`);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Proxy URL parsing error', detail: err.message });
    }
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduMitra Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
