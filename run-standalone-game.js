// This script directly opens the HTML file in the default browser without a server
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const htmlPath = path.join(__dirname, 'platformer-game.html');

// Check if platformer-game.html exists
if (!fs.existsSync(htmlPath)) {
  console.error('Error: platformer-game.html not found');
  process.exit(1);
}

// Determine the operating system and open the file accordingly
let command;
const platform = process.platform;

if (platform === 'win32') {
  // Windows
  command = `start "" "${htmlPath}"`;
} else if (platform === 'darwin') {
  // macOS
  command = `open "${htmlPath}"`;
} else {
  // Linux
  command = `xdg-open "${htmlPath}"`;
}

console.log('Opening platformer-game.html in your default browser...');
exec(command, (error) => {
  if (error) {
    console.error(`Error opening file: ${error.message}`);
    console.log('\nAlternatively, you can open the file manually:');
    console.log(`- Navigate to: ${htmlPath}`);
    console.log('- Double-click the file to open it in your browser');
  } else {
    console.log('Game launched successfully!');
  }
});