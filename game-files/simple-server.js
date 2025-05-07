// Simple CommonJS server for the standalone game
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the game launcher as the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'game-launcher.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone game server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to play the game`);
});