// Simple platformer game using vanilla JavaScript
// This avoids any potential issues with Kaboom.js

// Game state and objects
let gameRunning = false;
let player = null;
let playerX = 100;
let playerY = 500;
let playerSpeed = 5;
let playerJumping = false;
let gravity = 0.7;  // Higher gravity value for more weight
let velocityY = 0;
let velocityX = 0;  // Horizontal velocity for smoother movement
let friction = 0.8; // Friction to slow down the player
let terminalVelocity = 12; // Max falling speed
let jumpStrength = 15; // Initial jump velocity
let playerOnGround = false; // Track if player is on ground
let playerHealth = 3; // Player health
let gameContainer = null;
let gameCanvas = null;
let gameContext = null;
let gameWidth = 1280;
let gameHeight = 720;
let platforms = [];
let enemies = [];
let coins = [];
let goalFlag = null;
let score = 0;
let level = 1;
let maxLevel = 3;
let keyStates = {
  left: false,
  right: false,
  up: false
};

// Sound options
let soundManager = null;

// Levels data
const gameLevels = [
  // Level 1
  {
    platforms: [
      { x: 0, y: 600, width: 500, height: 40 },
      { x: 600, y: 500, width: 200, height: 40 },
      { x: 900, y: 400, width: 200, height: 40 },
      { x: 1100, y: 600, width: 300, height: 40 }
    ],
    enemies: [
      { x: 700, y: 450, width: 30, height: 30, moveRange: 100, speed: 2 }
    ],
    coins: [
      { x: 300, y: 550, collected: false },
      { x: 650, y: 450, collected: false },
      { x: 950, y: 350, collected: false },
      { x: 1200, y: 550, collected: false }
    ],
    flag: { x: 1250, y: 550 }
  },
  // Level 2
  {
    platforms: [
      { x: 0, y: 600, width: 300, height: 40 },
      { x: 350, y: 500, width: 100, height: 20 },
      { x: 500, y: 400, width: 100, height: 20 },
      { x: 650, y: 500, width: 100, height: 20 },
      { x: 800, y: 350, width: 200, height: 40 },
      { x: 1050, y: 450, width: 250, height: 40 }
    ],
    enemies: [
      { x: 400, y: 450, width: 30, height: 30, moveRange: 50, speed: 3 },
      { x: 900, y: 300, width: 30, height: 30, moveRange: 80, speed: 3 }
    ],
    coins: [
      { x: 200, y: 550, collected: false },
      { x: 400, y: 450, collected: false },
      { x: 550, y: 350, collected: false },
      { x: 700, y: 450, collected: false },
      { x: 900, y: 300, collected: false },
      { x: 1150, y: 400, collected: false }
    ],
    flag: { x: 1200, y: 400 }
  },
  // Level 3
  {
    platforms: [
      { x: 0, y: 400, width: 200, height: 40 },
      { x: 250, y: 500, width: 80, height: 20 },
      { x: 400, y: 400, width: 80, height: 20 },
      { x: 550, y: 300, width: 80, height: 20 },
      { x: 700, y: 200, width: 80, height: 20 },
      { x: 850, y: 300, width: 100, height: 20 },
      { x: 1000, y: 400, width: 300, height: 40 }
    ],
    enemies: [
      { x: 300, y: 450, width: 30, height: 30, moveRange: 60, speed: 4 },
      { x: 600, y: 250, width: 30, height: 30, moveRange: 50, speed: 4 },
      { x: 1150, y: 350, width: 30, height: 30, moveRange: 100, speed: 4 }
    ],
    coins: [
      { x: 150, y: 350, collected: false },
      { x: 300, y: 450, collected: false },
      { x: 450, y: 350, collected: false },
      { x: 600, y: 250, collected: false },
      { x: 750, y: 150, collected: false },
      { x: 900, y: 250, collected: false },
      { x: 1050, y: 350, collected: false },
      { x: 1200, y: 350, collected: false }
    ],
    flag: { x: 1200, y: 350 }
  }
];

// Initialize game
function initGame(container, soundOptions) {
  console.log("Initializing simple platform game");
  
  // Store sound options
  soundManager = soundOptions;
  
  // Create canvas
  gameContainer = container;
  gameCanvas = document.createElement('canvas');
  gameCanvas.width = gameWidth;
  gameCanvas.height = gameHeight;
  gameContext = gameCanvas.getContext('2d');
  
  // Append canvas to container
  gameContainer.innerHTML = '';
  gameContainer.appendChild(gameCanvas);
  
  // Set up event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Start with menu
  showMenu();
}

// Key handlers
function handleKeyDown(e) {
  console.log("Key down:", e.key);
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      keyStates.left = true;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      keyStates.right = true;
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
    case ' ':
      keyStates.up = true;
      if (!gameRunning && e.key === ' ') {
        startGame();
      }
      break;
  }
}

function handleKeyUp(e) {
  switch(e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      keyStates.left = false;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      keyStates.right = false;
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
    case ' ':
      keyStates.up = false;
      break;
  }
}

// Show main menu
function showMenu() {
  gameRunning = false;
  
  // Draw background
  gameContext.fillStyle = 'black';
  gameContext.fillRect(0, 0, gameWidth, gameHeight);
  
  // Draw title
  gameContext.fillStyle = 'white';
  gameContext.font = '50px Arial';
  gameContext.textAlign = 'center';
  gameContext.fillText('PLATFORMER ADVENTURE', gameWidth/2, 200);
  
  // Draw instructions
  gameContext.font = '25px Arial';
  gameContext.fillText('Use Arrow Keys or WASD to move, Space to jump', gameWidth/2, 300);
  
  // Draw start prompt
  gameContext.font = '30px Arial';
  gameContext.fillText('Press SPACE to start', gameWidth/2, 400);
}

// Start the game
function startGame() {
  gameRunning = true;
  level = 1;
  score = 0;
  loadLevel(level - 1);
  gameLoop();
}

// Load level data
function loadLevel(levelIndex) {
  // Reset player position
  playerX = 100;
  playerY = 500;
  velocityY = 0;
  
  // Load level data
  const currentLevel = gameLevels[levelIndex];
  platforms = currentLevel.platforms;
  enemies = currentLevel.enemies.map(enemy => ({
    ...enemy,
    startX: enemy.x,
    direction: 1
  }));
  coins = currentLevel.coins;
  goalFlag = currentLevel.flag;
  
  console.log("Loaded level", level, "with", platforms.length, "platforms,", 
              enemies.length, "enemies and", coins.length, "coins");
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  
  update();
  render();
  
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // First check if player is on ground
  playerOnGround = isOnGround();
  
  // Apply horizontal acceleration based on key states
  if (keyStates.left) {
    // Apply acceleration left
    velocityX -= playerSpeed * 0.15;
    console.log("Accelerating left, velocityX:", velocityX.toFixed(2));
  } else if (keyStates.right) {
    // Apply acceleration right
    velocityX += playerSpeed * 0.15;
    console.log("Accelerating right, velocityX:", velocityX.toFixed(2));
  } else {
    // Apply friction to slow down when no keys are pressed
    velocityX *= friction;
  }
  
  // Cap horizontal velocity
  if (velocityX > playerSpeed) velocityX = playerSpeed;
  if (velocityX < -playerSpeed) velocityX = -playerSpeed;
  
  // Apply very small friction to prevent sliding at very small values
  if (Math.abs(velocityX) < 0.1) velocityX = 0;
  
  // Handle jumping with more natural feel
  if (keyStates.up && playerOnGround) {
    velocityY = -jumpStrength; // Stronger initial jump
    playerJumping = true;
    
    if (soundManager && !soundManager.isMuted()) {
      // Play jump sound
      try {
        soundManager.playSuccess();
      } catch (e) {
        console.error("Error playing jump sound:", e);
      }
    }
  }
  
  // Variable jump height - if player releases jump key early, reduce upward velocity
  if (!keyStates.up && velocityY < 0) {
    velocityY *= 0.85; // Cut the jump short
  }
  
  // Apply gravity with terminal velocity
  velocityY += gravity;
  
  // Cap falling speed at terminal velocity
  if (velocityY > terminalVelocity) {
    velocityY = terminalVelocity;
  }
  
  // Apply velocities to position
  playerX += velocityX;
  playerY += velocityY;
  
  // Check platform collisions - this might adjust player position and velocity
  handlePlatformCollisions();
  
  // Check boundaries with bounce effect
  if (playerX < 20) {
    playerX = 20;
    velocityX *= -0.3; // Slight bounce
  }
  if (playerX > gameWidth - 20) {
    playerX = gameWidth - 20;
    velocityX *= -0.3; // Slight bounce
  }
  
  // Check if player fell off the screen
  if (playerY > gameHeight + 100) {
    // Restart level
    loadLevel(level - 1);
  }
  
  // Update enemies with physics
  updateEnemies();
  
  // Check coin collisions
  checkCoinCollisions();
  
  // Check enemy collisions
  checkEnemyCollisions();
  
  // Check flag collision
  checkFlagCollision();
}

// Check if player is on ground
function isOnGround() {
  for (const platform of platforms) {
    if (playerY + 20 >= platform.y && 
        playerY + 20 <= platform.y + 5 &&
        playerX + 15 >= platform.x && 
        playerX - 15 <= platform.x + platform.width) {
      return true;
    }
  }
  return false;
}

// Handle platform collisions with more realistic physics
function handlePlatformCollisions() {
  // Reset player's grounded state - will be set to true if standing on platform
  playerOnGround = false;
  
  for (const platform of platforms) {
    // Get the collision area
    const overlapX = Math.min(playerX + 20, platform.x + platform.width) - Math.max(playerX - 20, platform.x);
    const overlapY = Math.min(playerY + 20, platform.y + platform.height) - Math.max(playerY - 20, platform.y);
    
    // Check if there's actually a collision (both overlaps must be positive)
    if (overlapX > 0 && overlapY > 0) {
      // Determine collision side by finding the smaller overlap
      if (overlapX < overlapY) {
        // Horizontal collision (left/right)
        if (playerX < platform.x) {
          // Collision from left
          playerX = platform.x - 20;
          velocityX = Math.min(0, velocityX); // Stop rightward movement
        } else {
          // Collision from right
          playerX = platform.x + platform.width + 20;
          velocityX = Math.max(0, velocityX); // Stop leftward movement
        }
      } else {
        // Vertical collision (top/bottom)
        if (playerY < platform.y) {
          // Collision from top - player lands on platform
          playerY = platform.y - 20;
          velocityY = 0;
          playerOnGround = true;
          playerJumping = false;
        } else {
          // Collision from bottom - player hits head
          playerY = platform.y + platform.height + 20;
          velocityY = Math.max(0, velocityY); // Prevent upward movement
        }
      }
    }
    
    // Simple top collision check (more forgiving for gameplay)
    if (velocityY > 0 && 
        playerY + 20 >= platform.y && 
        playerY <= platform.y &&
        playerX + 15 >= platform.x && 
        playerX - 15 <= platform.x + platform.width) {
      
      // Player is landing on platform
      playerY = platform.y - 20;
      velocityY = 0;
      playerOnGround = true;
      playerJumping = false;
    }
  }
}

// Update enemies
function updateEnemies() {
  for (const enemy of enemies) {
    // Move enemy back and forth
    enemy.x += enemy.speed * enemy.direction;
    
    // Reverse direction if at end of range
    if (Math.abs(enemy.x - enemy.startX) > enemy.moveRange) {
      enemy.direction *= -1;
    }
  }
}

// Check coin collisions
function checkCoinCollisions() {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (!coin.collected && 
        Math.abs(playerX - coin.x) < 25 && 
        Math.abs(playerY - coin.y) < 25) {
      coin.collected = true;
      score += 10;
      
      if (soundManager && !soundManager.isMuted()) {
        // Play coin sound
        try {
          soundManager.playSuccess();
        } catch (e) {
          console.error("Error playing coin sound:", e);
        }
      }
    }
  }
}

// Check enemy collisions
function checkEnemyCollisions() {
  for (const enemy of enemies) {
    if (Math.abs(playerX - enemy.x) < 25 && 
        Math.abs(playerY - enemy.y) < 25) {
      // Player hit enemy - restart level
      if (soundManager && !soundManager.isMuted()) {
        try {
          soundManager.playHit();
        } catch (e) {
          console.error("Error playing hit sound:", e);
        }
      }
      loadLevel(level - 1);
      break;
    }
  }
}

// Check flag collision
function checkFlagCollision() {
  if (Math.abs(playerX - goalFlag.x) < 25 && 
      Math.abs(playerY - goalFlag.y) < 25) {
    
    if (soundManager && !soundManager.isMuted()) {
      try {
        soundManager.playSuccess();
      } catch (e) {
        console.error("Error playing success sound:", e);
      }
    }
    
    // Next level or win
    level++;
    if (level <= maxLevel) {
      loadLevel(level - 1);
    } else {
      showWinScreen();
    }
  }
}

// Show win screen
function showWinScreen() {
  gameRunning = false;
  
  // Draw background
  gameContext.fillStyle = 'black';
  gameContext.fillRect(0, 0, gameWidth, gameHeight);
  
  // Draw win text
  gameContext.fillStyle = 'white';
  gameContext.font = '60px Arial';
  gameContext.textAlign = 'center';
  gameContext.fillText('YOU WIN!', gameWidth/2, 300);
  
  // Draw score
  gameContext.font = '30px Arial';
  gameContext.fillText(`Final Score: ${score}`, gameWidth/2, 380);
  
  // Draw restart prompt
  gameContext.fillText('Press SPACE to play again', gameWidth/2, 450);
}

// Render game
function render() {
  // Clear canvas
  gameContext.fillStyle = 'cornflowerblue';
  gameContext.fillRect(0, 0, gameWidth, gameHeight);
  
  // Draw platforms
  gameContext.fillStyle = 'brown';
  for (const platform of platforms) {
    gameContext.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
  
  // Draw coins
  gameContext.fillStyle = 'yellow';
  for (const coin of coins) {
    if (!coin.collected) {
      gameContext.beginPath();
      gameContext.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
      gameContext.fill();
    }
  }
  
  // Draw enemies
  gameContext.fillStyle = 'red';
  for (const enemy of enemies) {
    gameContext.fillRect(enemy.x - 15, enemy.y - 15, 30, 30);
  }
  
  // Draw flag
  gameContext.fillStyle = 'lime';
  gameContext.fillRect(goalFlag.x - 5, goalFlag.y - 30, 10, 30);
  gameContext.fillRect(goalFlag.x - 5, goalFlag.y - 30, 20, 15);
  
  // Draw player
  gameContext.fillStyle = 'blue';
  gameContext.fillRect(playerX - 20, playerY - 20, 40, 40);
  
  // Draw UI elements
  gameContext.fillStyle = 'white';
  gameContext.font = '24px Arial';
  gameContext.textAlign = 'left';
  gameContext.fillText(`Level: ${level}`, 20, 30);
  gameContext.fillText(`Score: ${score}`, 20, 60);
}

// Clean up function
function destroyGame() {
  console.log("Destroying game and removing event listeners");
  gameRunning = false;
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  
  if (gameContainer) {
    gameContainer.innerHTML = '';
  }
}

// Export game functions
window.simplePlatformerGame = {
  init: initGame,
  destroy: destroyGame
};