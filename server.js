/* server.js */
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---
const app = express();
const PORT = 3000;

// Serving files from root directory
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    if(path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if(path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serving files from assets directory
app.use('/assets', express.static(join(__dirname, 'assets'), {
  setHeaders: (res, path) => {
    if(path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error: Middleware error');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Error: Page not found (404)');
});

// Starting server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});