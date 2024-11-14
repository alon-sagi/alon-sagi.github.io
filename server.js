// server/app.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '');  // Go up one level to project root

const app = express();
const PORT = 3000;

// Debug middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from root
app.use(express.static(rootDir));

// Explicit favicon handling
app.get('/favicon.svg', (req, res) => {
  res.sendFile(join(rootDir, 'assets', 'favicon.svg'));
});

app.get('/assets/favicon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(join(rootDir, 'assets', 'favicon.svg'));
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Root directory: ${rootDir}`);
  console.log(`Favicon path: ${join(rootDir, 'assets', 'favicon.svg')}`);
});