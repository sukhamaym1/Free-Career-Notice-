import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

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
