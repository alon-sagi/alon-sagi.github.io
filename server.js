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

// Debug middleware - log all requests with full paths
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log(`Looking for file: ${join(__dirname, req.url)}`);
  next();
});

// Serve files from root directory
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    console.log(`Serving file: ${path}`);
    if(path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } 
    else if(path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve files from assets directory with explicit content types
app.use('/assets', express.static(join(__dirname, 'assets'), {
  setHeaders: (res, path) => {
    console.log(`Serving asset: ${path}`);
    if(path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache'); // Prevent caching
    } 
    else if(path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Explicit routes for favicon
app.get('/favicon.svg', (req, res) => {
  res.sendFile(join(__dirname, 'assets', 'favicon.svg'));
});

app.get('/assets/favicon.svg', (req, res) => {
  console.log('Favicon requested directly');
  res.sendFile(join(__dirname, 'assets', 'favicon.svg'));
});

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Error handling middleware with more details
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Stack:', err.stack);
  res.status(500).send('Error: Middleware error');
});

// 404 handler with path information
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  console.log('Attempted path:', join(__dirname, req.url));
  res.status(404).send('Error: Page not found (404)');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${__dirname}`);
});