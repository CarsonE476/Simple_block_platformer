// Using ES modules syntax to match the project's setup
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the platformer game directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'platformer-game.html'));
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone game server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to play the game`);
});