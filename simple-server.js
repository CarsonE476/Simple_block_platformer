const express = require('express');
const path = require('path');
const fs = require('fs');

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
  console.log(`Game server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to play the game`);
});