import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { CMS_CONFIG } from './src/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parser for API routes
  app.use(express.json({ limit: '50mb' }));

  // API route to write files locally
  app.post('/api/fs/write', (req, res) => {
    try {
      const { filePath, content, encoding } = req.body;
      if (!filePath) return res.status(400).json({ error: 'filePath required' });
      
      const fullPath = path.join(process.cwd(), filePath);
      // Ensure directory exists
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      
      if (encoding === 'base64') {
        fs.writeFileSync(fullPath, Buffer.from(content, 'base64'));
      } else {
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
      
      res.json({ success: true });
    } catch (err: any) {
      console.error('Error writing file locally:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/fs/delete', (req, res) => {
    try {
      const { filePath } = req.body;
      if (!filePath) return res.status(400).json({ error: 'filePath required' });
      
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      
      res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting file locally:', err);
      res.status(500).json({ error: err.message });
    }
  });

  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const githubCache = new Map<string, { data: any, timestamp: number }>();

  // GitHub Proxy with Caching to prevent rate limits on the public site
  app.all('/api/github/*', async (req, res) => {
    try {
      const endpoint = req.params[0];
      const search = req.originalUrl.split('?')[1] || '';
      const fullUrl = `https://api.github.com/${endpoint}${search ? '?' + search : ''}`;
      
      const isGet = req.method === 'GET' || req.method === 'HEAD';
      
      // Check cache first for GET requests, but bypass if Authorization is provided
      const cacheKey = fullUrl;
      if (isGet && !req.headers.authorization) {
        const cached = githubCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          return res.json(cached.data);
        }
      }

      const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'free-career-notice-proxy'
      };

      // Forward Authorization header if provided by the client (Admin)
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      } else if (process.env.GITHUB_PAT) {
        // Fallback to backend PAT to increase public rate limit to 5000/hr
        headers['Authorization'] = `Bearer ${process.env.GITHUB_PAT}`;
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      if (!isGet && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const githubRes = await fetch(fullUrl, fetchOptions);
      
      if (!githubRes.ok) {
        const errorText = await githubRes.text();
        return res.status(githubRes.status).send(errorText);
      }

      if (githubRes.status === 204) {
        return res.status(204).send();
      }

      const data = await githubRes.json();
      
      // Cache the successful response for GET requests
      if (isGet) {
        githubCache.set(cacheKey, { data, timestamp: Date.now() });
      }

      res.json(data);
    } catch (err: any) {
      console.error('GitHub Proxy Error:', err);
      res.status(500).json({ error: err.message });
    }
  });


  

  // Vite middleware for development

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
