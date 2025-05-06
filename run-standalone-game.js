// This script directly opens the game launcher HTML file in the default browser
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const launcherPath = path.join(__dirname, 'game-launcher.html');
const gamePath = path.join(__dirname, 'platformer-game.html');

// Check if necessary files exist
if (!fs.existsSync(launcherPath)) {
  console.error('Error: game-launcher.html not found');
  process.exit(1);
}

if (!fs.existsSync(gamePath)) {
  console.error('Error: platformer-game.html not found');
  process.exit(1);
}

// Determine the operating system and open the file accordingly
let command;
const platform = process.platform;

if (platform === 'win32') {
  // Windows
  command = `start "" "${launcherPath}"`;
} else if (platform === 'darwin') {
  // macOS
  command = `open "${launcherPath}"`;
} else {
  // Linux
  command = `xdg-open "${launcherPath}"`;
}

console.log('Opening game launcher in your default browser...');
exec(command, (error) => {
  if (error) {
    console.error(`Error opening file: ${error.message}`);
    console.log('\nAlternatively, you can open the files manually:');
    console.log(`- Navigate to: ${launcherPath} or ${gamePath}`);
    console.log('- Double-click the file to open it in your browser');
  } else {
    console.log('Game launcher opened successfully!');
  }
});