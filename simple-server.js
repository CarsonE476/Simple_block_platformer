// Simple ES module server for the standalone game
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory and the game-files directory
app.use(express.static(__dirname));
app.use('/game-files', express.static(join(__dirname, 'game-files')));

// Serve the index.html file as the main page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone game server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to play the game`);
});