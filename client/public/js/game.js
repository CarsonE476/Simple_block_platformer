// Main game implementation using Kaboom.js
// This file contains the core game logic for our platformer

// Game state
let currentLevel = 0;
let score = 0;
let gameInstance = null;
let scoreText = null;

// Level definitions
const levels = [
  // Level 1 - Introduction
  {
    player: { x: 100, y: 500 },
    platforms: [
      // Starting platform
      { x: 0, y: 600, width: 500, height: 40 },
      // Middle platforms
      { x: 600, y: 500, width: 200, height: 40 },
      { x: 900, y: 400, width: 200, height: 40 },
      // End platform
      { x: 1100, y: 600, width: 300, height: 40 }
    ],
    enemies: [
      // One simple enemy
      { x: 700, y: 450, moveDistance: 100, speed: 70 }
    ],
    coins: [
      { x: 300, y: 550 },
      { x: 650, y: 450 },
      { x: 950, y: 350 },
      { x: 1200, y: 550 }
    ],
    flag: { x: 1250, y: 550 }
  },
  
  // Level 2 - More challenging
  {
    player: { x: 100, y: 500 },
    platforms: [
      // Starting platform
      { x: 0, y: 600, width: 300, height: 40 },
      // Stepping stones
      { x: 350, y: 500, width: 100, height: 20 },
      { x: 500, y: 400, width: 100, height: 20 },
      { x: 650, y: 500, width: 100, height: 20 },
      // Higher platforms
      { x: 800, y: 350, width: 200, height: 40 },
      { x: 1050, y: 450, width: 250, height: 40 }
    ],
    enemies: [
      // Multiple enemies with different patterns
      { x: 400, y: 450, moveDistance: 50, speed: 100 },
      { x: 900, y: 300, moveDistance: 80, speed: 120 },
      { x: 1150, y: 400, moveDistance: 100, speed: 80 }
    ],
    coins: [
      { x: 200, y: 550 },
      { x: 400, y: 450 },
      { x: 550, y: 350 },
      { x: 700, y: 450 },
      { x: 900, y: 300 },
      { x: 1150, y: 400 }
    ],
    flag: { x: 1200, y: 400 }
  },
  
  // Level 3 - Most challenging
  {
    player: { x: 100, y: 300 },
    platforms: [
      // Starting platform
      { x: 0, y: 400, width: 200, height: 40 },
      // Sparse platforms
      { x: 250, y: 500, width: 80, height: 20 },
      { x: 400, y: 400, width: 80, height: 20 },
      { x: 550, y: 300, width: 80, height: 20 },
      { x: 700, y: 200, width: 80, height: 20 },
      // Ending area
      { x: 850, y: 300, width: 100, height: 20 },
      { x: 1000, y: 400, width: 300, height: 40 }
    ],
    enemies: [
      // More enemies with faster movement
      { x: 300, y: 450, moveDistance: 60, speed: 140 },
      { x: 450, y: 350, moveDistance: 60, speed: 150 },
      { x: 600, y: 250, moveDistance: 50, speed: 160 },
      { x: 900, y: 250, moveDistance: 50, speed: 170 },
      { x: 1150, y: 350, moveDistance: 100, speed: 180 }
    ],
    coins: [
      { x: 150, y: 350 },
      { x: 300, y: 450 },
      { x: 450, y: 350 },
      { x: 600, y: 250 },
      { x: 750, y: 150 },
      { x: 900, y: 250 },
      { x: 1050, y: 350 },
      { x: 1200, y: 350 }
    ],
    flag: { x: 1200, y: 350 }
  }
];

// Helper functions to generate sprite data
function generateRectSpriteData(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.fillRect(0, 0, 32, 32);
  return canvas;
}

function generateCircleSpriteData(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.beginPath();
  ctx.arc(16, 16, 16, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

// Function to update the score display
function updateScore() {
  if (scoreText) {
    scoreText.text = `Score: ${score}`;
  }
}

// Build a level
function buildLevel(k, levelData) {
  // Create player with simpler configuration
  console.log("Creating player at", levelData.player.x, levelData.player.y);
  
  // Create a solid blue rectangle for player
  const player = k.add([
    k.rect(40, 40),       // Simple rectangle shape (40x40 pixels)
    k.color(0, 0, 255),   // Solid blue color
    k.pos(levelData.player.x, levelData.player.y),
    k.area({ width: 40, height: 40 }),
    k.body({ weight: 1 }),
    k.health(3),
    k.anchor("center"),
    k.z(100),             // Very high z-index to ensure visibility
    k.rotate(0),          // No rotation
    "player",
  ]);
  
  // Add a custom update function for the player
  player.onUpdate(() => {
    // Add a small bounce to make it more visible
    player.color = k.rgb(0, 0, Math.floor(200 + Math.sin(k.time() * 10) * 55));
  });
  
  // Player hurt handler with more visual feedback
  player.onHurt(() => {
    k.shake(10);
    player.color = k.rgb(255, 0, 0); // Flash red when hurt
    setTimeout(() => {
      player.color = k.rgb(0, 0, 255); // Back to blue
    }, 200);
    
    if (player.hp() <= 0) {
      k.go("gameover");
    }
  });
  
  console.log("Player object created:", player);

  // Add platforms
  levelData.platforms.forEach((platform) => {
    k.add([
      k.sprite("platform"),
      k.pos(platform.x, platform.y),
      k.scale(platform.width / 32, platform.height / 32),
      k.area(),
      k.body({ isStatic: true }),
      "platform",
    ]);
  });

  // Add enemies
  levelData.enemies.forEach((enemy) => {
    const enemyObj = k.add([
      k.sprite("enemy"),
      k.pos(enemy.x, enemy.y),
      k.area(),
      k.body(),
      k.anchor("center"),
      {
        dir: 1,
        speed: enemy.speed || 100,
        moveDistance: enemy.moveDistance || 200,
        startX: enemy.x,
      },
      "enemy",
    ]);

    // Make enemy move
    enemyObj.onUpdate(() => {
      const distanceMoved = Math.abs(enemyObj.pos.x - enemyObj.startX);
      
      if (distanceMoved > enemyObj.moveDistance) {
        enemyObj.dir = -enemyObj.dir;
        enemyObj.startX = enemyObj.pos.x;
      }
      
      enemyObj.move(enemyObj.dir * enemyObj.speed, 0);
    });
  });

  // Add coins
  levelData.coins.forEach((coin) => {
    k.add([
      k.sprite("coin"),
      k.pos(coin.x, coin.y),
      k.area(),
      k.anchor("center"),
      "coin",
    ]);
  });

  // Add level exit flag
  k.add([
    k.sprite("flag"),
    k.pos(levelData.flag.x, levelData.flag.y),
    k.area(),
    k.anchor("center"),
    "flag",
  ]);

  // Camera follow player
  k.onUpdate(() => {
    if (player.pos.y > 1000) {
      player.hurt();
      player.pos.x = levelData.player.x;
      player.pos.y = levelData.player.y;
    }
  });
}

// Initialize and start the game
function initGame(container, soundOptions) {
  // If there's already a game running, clean it up
  if (gameInstance) {
    container.innerHTML = '';
    gameInstance = null;
  }
  
  // Reset game state
  currentLevel = 0;
  score = 0;
  
  // Log key events to help debug
  const logKeys = (e) => {
    console.log("Key event:", e.type, e.key, e.code);
  };
  
  // Add keyboard event listeners to document
  document.addEventListener("keydown", logKeys);
  document.addEventListener("keyup", logKeys);
  document.addEventListener("keypress", logKeys);
  
  console.log("Game initializing, keyboard event listeners attached...");
  
  // Initialize Kaboom with debug enabled
  const k = kaboom({
    global: false,
    canvas: document.createElement("canvas"),
    background: [0, 0, 0],
    width: 1280,
    height: 720,
    scale: 1,
    debug: true,  // Enable debug to help identify issues
    gravity: 1800,  // Slightly reduced gravity
  });
  
  // Store game instance for cleanup
  gameInstance = k;
  
  // Add the canvas to the container
  container.appendChild(k.canvas);
  
  // Focus the canvas to capture input
  k.canvas.focus();
  k.canvas.setAttribute("tabindex", "0");
  
  // Make canvas interactive
  k.canvas.style.outline = "none";
  k.canvas.addEventListener("click", () => {
    k.canvas.focus();
    console.log("Canvas focused");
  });
  
  // Load sprites
  // Player sprite - blue rectangle (larger for visibility)
  k.loadSprite("player", generateRectSpriteData([0, 0, 255]));
  
  // Platform sprite - brown rectangle
  k.loadSprite("platform", generateRectSpriteData([139, 69, 19]));
  
  // Enemy sprite - red rectangle
  k.loadSprite("enemy", generateRectSpriteData([255, 0, 0]));
  
  // Coin sprite - yellow circle
  k.loadSprite("coin", generateCircleSpriteData([255, 255, 0]));
  
  // Flag sprite - green rectangle
  k.loadSprite("flag", generateRectSpriteData([0, 255, 0]));
  
  // Load sounds from the provided assets
  k.loadSound("jump", "/sounds/success.mp3");
  k.loadSound("hit", "/sounds/hit.mp3");
  k.loadSound("complete", "/sounds/success.mp3");
  
  // Set up direct key handlers
  const keys = {
    left: false,
    right: false,
    jump: false
  };
  
  // Use traditional event listeners for keys
  window.addEventListener("keydown", (e) => {
    console.log("Window keydown:", e.key, e.code);
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      keys.left = true;
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      keys.right = true;
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
      keys.jump = true;
    }
  });
  
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      keys.left = false;
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      keys.right = false;
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
      keys.jump = false;
    }
  });
  
  // Player movement in update loop
  const moveSpeed = 300;
  const jumpForce = 650;
  let canJump = true;
  let lastLogTime = 0;
  
  k.onUpdate(() => {
    const player = k.get("player")[0];
    const now = Date.now();
    
    // Debug logging
    if (now - lastLogTime > 1000) {
      console.log("Key states:", keys);
      if (player) {
        console.log("Player position:", player.pos.x, player.pos.y);
      }
      lastLogTime = now;
    }
    
    if (!player) return;
    
    // Handle movement using the tracked key states
    if (keys.left) {
      player.pos.x -= moveSpeed * 1/60; // roughly adjust for frame time
      console.log("Moving left", player.pos.x);
    }
    if (keys.right) {
      player.pos.x += moveSpeed * 1/60; // roughly adjust for frame time
      console.log("Moving right", player.pos.x); 
    }
    
    // Handle jumping with a cooldown to prevent double jumps
    if (keys.jump && canJump && player.isGrounded()) {
      player.jump(jumpForce);
      canJump = false;
      setTimeout(() => { canJump = true; }, 300);
      
      if (!soundOptions.isMuted()) {
        k.play("jump", { volume: 0.5 });
      }
    }
  });

  // Define collisions
  k.onCollide("player", "enemy", () => {
    const player = k.get("player")[0];
    if (player) {
      player.hurt();
      k.shake(10);
      
      if (!soundOptions.isMuted()) {
        soundOptions.playHit();
      }
    }
  });

  k.onCollide("player", "coin", (p, c) => {
    if (!soundOptions.isMuted()) {
      k.play("jump", {
        volume: 0.2,
      });
    }
    k.destroy(c);
    score += 10;
    updateScore();
  });

  k.onCollide("player", "flag", () => {
    if (!soundOptions.isMuted()) {
      soundOptions.playSuccess();
    }
    
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      k.go("game");
    } else {
      k.go("win");
    }
  });
  
  // Menu scene
  k.scene("menu", () => {
    k.add([
      k.rect(1280, 720),
      k.color(0, 0, 0),
      k.z(-1),
    ]);

    k.add([
      k.text("PLATFORMER ADVENTURE", { size: 50 }),
      k.pos(640, 200),
      k.anchor("center"),
    ]);

    k.add([
      k.text("Use Arrow Keys to move, Space to jump", { size: 25 }),
      k.pos(640, 300),
      k.anchor("center"),
    ]);

    k.add([
      k.text("Press SPACE to start", { size: 30 }),
      k.pos(640, 400),
      k.anchor("center"),
    ]);

    // Reset game state
    currentLevel = 0;
    score = 0;

    // Start game on space press
    k.onKeyPress("space", () => {
      k.go("game");
    });
  });

  // Game scene
  k.scene("game", () => {
    // Add background
    k.add([
      k.rect(1280, 720),
      k.color(100, 149, 237), // Cornflower blue
      k.z(-1),
    ]);

    // Add level text
    k.add([
      k.text(`Level ${currentLevel + 1}`, { size: 24 }),
      k.pos(20, 20),
    ]);

    // Add score text
    scoreText = k.add([
      k.text(`Score: ${score}`, { size: 24 }),
      k.pos(20, 50),
    ]);

    // Build level
    const levelData = levels[currentLevel];
    buildLevel(k, levelData);
  });

  // Game over scene
  k.scene("gameover", () => {
    k.add([
      k.rect(1280, 720),
      k.color(0, 0, 0),
      k.z(-1),
    ]);

    k.add([
      k.text("GAME OVER", { size: 60 }),
      k.pos(640, 300),
      k.anchor("center"),
    ]);

    k.add([
      k.text(`Score: ${score}`, { size: 30 }),
      k.pos(640, 380),
      k.anchor("center"),
    ]);

    k.add([
      k.text("Press SPACE to restart", { size: 30 }),
      k.pos(640, 450),
      k.anchor("center"),
    ]);

    k.onKeyPress("space", () => {
      currentLevel = 0;
      score = 0;
      k.go("game");
    });
  });

  // Win scene
  k.scene("win", () => {
    k.add([
      k.rect(1280, 720),
      k.color(0, 0, 0),
      k.z(-1),
    ]);

    k.add([
      k.text("YOU WIN!", { size: 60 }),
      k.pos(640, 300),
      k.anchor("center"),
    ]);

    k.add([
      k.text(`Final Score: ${score}`, { size: 30 }),
      k.pos(640, 380),
      k.anchor("center"),
    ]);

    k.add([
      k.text("Press SPACE to play again", { size: 30 }),
      k.pos(640, 450),
      k.anchor("center"),
    ]);

    k.onKeyPress("space", () => {
      currentLevel = 0;
      score = 0;
      k.go("game");
    });
  });
  
  // Start with menu scene
  k.go("menu");
  
  // Return the game instance for potential cleanup
  return k;
}

// Cleanup function to destroy the game
function destroyGame() {
  if (gameInstance) {
    gameInstance.destroy();
    gameInstance = null;
  }
}

// Export game functions
window.platformerGame = {
  init: initGame,
  destroy: destroyGame
};