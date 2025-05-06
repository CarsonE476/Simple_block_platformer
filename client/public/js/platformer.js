// Simple platformer game using vanilla JavaScript
// This is a complete rewrite to avoid any issues with the previous code

// Game namespace to avoid global variable conflicts
const PlatformerGame = {
  // Game state
  isRunning: false,
  
  // Player properties
  player: {
    x: 100,
    y: 500,
    width: 40,
    height: 40,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isOnGround: false
  },
  
  // Physics settings
  physics: {
    gravity: 0.7,
    friction: 0.8,
    terminalVelocity: 12,
    jumpStrength: 15
  },
  
  // Game objects
  objects: {
    platforms: [],
    enemies: [],
    coins: [],
    goalFlag: null
  },
  
  // Game stats
  stats: {
    score: 0,
    level: 1,
    maxLevel: 3
  },
  
  // Controls
  controls: {
    left: false,
    right: false,
    up: false
  },
  
  // Canvas and rendering
  canvas: null,
  context: null,
  container: null,
  width: 1280,
  height: 720,
  
  // Audio 
  sound: null,
  
  // Level data
  levels: [
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
  ],
  
  // Initialize the game
  init: function(container, soundOptions) {
    console.log("Initializing platformer game");
    
    // Store references
    this.container = container;
    this.sound = soundOptions;
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
    
    // Add canvas to container
    container.innerHTML = '';
    container.appendChild(this.canvas);
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Show main menu
    this.showMenu();
  },
  
  // Handle key down events
  handleKeyDown: function(e) {
    console.log("Key down:", e.key);
    switch(e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.controls.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.controls.right = true;
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        this.controls.up = true;
        if (!this.isRunning && e.key === ' ') {
          this.startGame();
        }
        break;
    }
  },
  
  // Handle key up events
  handleKeyUp: function(e) {
    switch(e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.controls.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.controls.right = false;
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        this.controls.up = false;
        break;
    }
  },
  
  // Show the main menu
  showMenu: function() {
    this.isRunning = false;
    
    // Draw background
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width, this.height);
    
    // Draw title
    this.context.fillStyle = 'white';
    this.context.font = '50px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('PLATFORMER ADVENTURE', this.width/2, 200);
    
    // Draw instructions
    this.context.font = '25px Arial';
    this.context.fillText('Use Arrow Keys or WASD to move, Space to jump', this.width/2, 300);
    
    // Draw start prompt
    this.context.font = '30px Arial';
    this.context.fillText('Press SPACE to start', this.width/2, 400);
  },
  
  // Start the game
  startGame: function() {
    this.isRunning = true;
    this.stats.level = 1;
    this.stats.score = 0;
    this.loadLevel(this.stats.level - 1);
    this.gameLoop();
  },
  
  // Load a level
  loadLevel: function(levelIndex) {
    // Reset player position
    this.player.x = 100;
    this.player.y = 500;
    this.player.velocityY = 0;
    this.player.velocityX = 0;
    
    // Load level data
    const level = this.levels[levelIndex];
    this.objects.platforms = level.platforms;
    this.objects.enemies = level.enemies.map(enemy => ({
      ...enemy,
      startX: enemy.x,
      direction: 1
    }));
    this.objects.coins = level.coins;
    this.objects.goalFlag = level.flag;
    
    console.log(`Loaded level ${this.stats.level} with ${this.objects.platforms.length} platforms, ${this.objects.enemies.length} enemies and ${this.objects.coins.length} coins`);
  },
  
  // Main game loop
  gameLoop: function() {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(this.gameLoop.bind(this));
  },
  
  // Update game state
  update: function() {
    // Check if player is on ground
    this.player.isOnGround = this.checkGroundContact();
    
    // Handle horizontal movement
    if (this.controls.left) {
      this.player.velocityX -= this.player.speed * 0.15;
    } else if (this.controls.right) {
      this.player.velocityX += this.player.speed * 0.15;
    } else {
      // Apply friction when no movement keys are pressed
      this.player.velocityX *= this.physics.friction;
    }
    
    // Cap horizontal velocity
    if (this.player.velocityX > this.player.speed) {
      this.player.velocityX = this.player.speed;
    }
    if (this.player.velocityX < -this.player.speed) {
      this.player.velocityX = -this.player.speed;
    }
    
    // Stop very small movements
    if (Math.abs(this.player.velocityX) < 0.1) {
      this.player.velocityX = 0;
    }
    
    // Handle jumping
    if (this.controls.up && this.player.isOnGround) {
      this.player.velocityY = -this.physics.jumpStrength;
      this.player.isJumping = true;
      
      if (this.sound && !this.sound.isMuted()) {
        try {
          this.sound.playSuccess();
        } catch (e) {
          console.error("Error playing jump sound:", e);
        }
      }
    }
    
    // Variable jump height
    if (!this.controls.up && this.player.velocityY < 0) {
      this.player.velocityY *= 0.85; // Reduce upward velocity when jump button is released
    }
    
    // Apply gravity
    this.player.velocityY += this.physics.gravity;
    
    // Cap falling speed
    if (this.player.velocityY > this.physics.terminalVelocity) {
      this.player.velocityY = this.physics.terminalVelocity;
    }
    
    // Apply velocities to position
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;
    
    // Handle collisions
    this.handleCollisions();
    
    // Check boundaries
    if (this.player.x < this.player.width / 2) {
      this.player.x = this.player.width / 2;
      this.player.velocityX *= -0.3; // Slight bounce
    }
    if (this.player.x > this.width - this.player.width / 2) {
      this.player.x = this.width - this.player.width / 2;
      this.player.velocityX *= -0.3; // Slight bounce
    }
    
    // Check if player fell off screen
    if (this.player.y > this.height + 100) {
      this.loadLevel(this.stats.level - 1);
    }
    
    // Update enemies
    this.updateEnemies();
    
    // Check collisions with other objects
    this.checkCoinCollisions();
    this.checkEnemyCollisions();
    this.checkFlagCollision();
  },
  
  // Check if player is on the ground
  checkGroundContact: function() {
    for (const platform of this.objects.platforms) {
      if (this.player.y + this.player.height/2 >= platform.y && 
          this.player.y + this.player.height/2 <= platform.y + 5 &&
          this.player.x + this.player.width/2 - 5 >= platform.x && 
          this.player.x - this.player.width/2 + 5 <= platform.x + platform.width) {
        return true;
      }
    }
    return false;
  },
  
  // Handle all collisions
  handleCollisions: function() {
    // Reset grounded state
    this.player.isOnGround = false;
    
    for (const platform of this.objects.platforms) {
      // Calculate the overlap between player and platform
      const overlapX = Math.min(this.player.x + this.player.width/2, platform.x + platform.width) - 
                       Math.max(this.player.x - this.player.width/2, platform.x);
      const overlapY = Math.min(this.player.y + this.player.height/2, platform.y + platform.height) - 
                       Math.max(this.player.y - this.player.height/2, platform.y);
      
      // Check if there's a collision (both overlaps must be positive)
      if (overlapX > 0 && overlapY > 0) {
        // Determine which side of the collision has the smaller overlap
        if (overlapX < overlapY) {
          // Horizontal collision (left/right)
          if (this.player.x < platform.x) {
            // Collision from left
            this.player.x = platform.x - this.player.width/2;
            this.player.velocityX = Math.min(0, this.player.velocityX);
          } else {
            // Collision from right
            this.player.x = platform.x + platform.width + this.player.width/2;
            this.player.velocityX = Math.max(0, this.player.velocityX);
          }
        } else {
          // Vertical collision (top/bottom)
          if (this.player.y < platform.y) {
            // Collision from top - player lands on platform
            this.player.y = platform.y - this.player.height/2;
            this.player.velocityY = 0;
            this.player.isOnGround = true;
            this.player.isJumping = false;
          } else {
            // Collision from bottom - player hits head
            this.player.y = platform.y + platform.height + this.player.height/2;
            this.player.velocityY = Math.max(0, this.player.velocityY);
          }
        }
      }
    }
    
    // More forgiving top collision detection for better gameplay
    for (const platform of this.objects.platforms) {
      if (this.player.velocityY > 0 && 
          this.player.y + this.player.height/2 >= platform.y && 
          this.player.y <= platform.y &&
          this.player.x + this.player.width/2 - 5 >= platform.x && 
          this.player.x - this.player.width/2 + 5 <= platform.x + platform.width) {
        
        // Player is landing on platform
        this.player.y = platform.y - this.player.height/2;
        this.player.velocityY = 0;
        this.player.isOnGround = true;
        this.player.isJumping = false;
      }
    }
  },
  
  // Update enemies
  updateEnemies: function() {
    for (const enemy of this.objects.enemies) {
      // Move enemy back and forth
      enemy.x += enemy.speed * enemy.direction;
      
      // Reverse direction at the end of movement range
      if (Math.abs(enemy.x - enemy.startX) > enemy.moveRange) {
        enemy.direction *= -1;
      }
    }
  },
  
  // Check for coin collisions
  checkCoinCollisions: function() {
    for (let i = 0; i < this.objects.coins.length; i++) {
      const coin = this.objects.coins[i];
      if (!coin.collected && 
          Math.abs(this.player.x - coin.x) < (this.player.width/2 + 10) && 
          Math.abs(this.player.y - coin.y) < (this.player.height/2 + 10)) {
        
        coin.collected = true;
        this.stats.score += 10;
        
        if (this.sound && !this.sound.isMuted()) {
          try {
            this.sound.playSuccess();
          } catch (e) {
            console.error("Error playing coin sound:", e);
          }
        }
      }
    }
  },
  
  // Check for enemy collisions
  checkEnemyCollisions: function() {
    for (const enemy of this.objects.enemies) {
      if (Math.abs(this.player.x - enemy.x) < (this.player.width/2 + enemy.width/2 - 5) && 
          Math.abs(this.player.y - enemy.y) < (this.player.height/2 + enemy.height/2 - 5)) {
        
        // Player hit enemy - restart level
        if (this.sound && !this.sound.isMuted()) {
          try {
            this.sound.playHit();
          } catch (e) {
            console.error("Error playing hit sound:", e);
          }
        }
        
        this.loadLevel(this.stats.level - 1);
        break;
      }
    }
  },
  
  // Check for flag collision (level complete)
  checkFlagCollision: function() {
    if (Math.abs(this.player.x - this.objects.goalFlag.x) < (this.player.width/2 + 15) && 
        Math.abs(this.player.y - this.objects.goalFlag.y) < (this.player.height/2 + 15)) {
      
      if (this.sound && !this.sound.isMuted()) {
        try {
          this.sound.playSuccess();
        } catch (e) {
          console.error("Error playing success sound:", e);
        }
      }
      
      // Next level or win
      this.stats.level++;
      if (this.stats.level <= this.stats.maxLevel) {
        this.loadLevel(this.stats.level - 1);
      } else {
        this.showWinScreen();
      }
    }
  },
  
  // Show win screen
  showWinScreen: function() {
    this.isRunning = false;
    
    // Draw background
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width, this.height);
    
    // Draw win text
    this.context.fillStyle = 'white';
    this.context.font = '60px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('YOU WIN!', this.width/2, 300);
    
    // Draw score
    this.context.font = '30px Arial';
    this.context.fillText(`Final Score: ${this.stats.score}`, this.width/2, 380);
    
    // Draw restart prompt
    this.context.fillText('Press SPACE to play again', this.width/2, 450);
  },
  
  // Render game
  render: function() {
    // Clear canvas
    this.context.fillStyle = 'cornflowerblue';
    this.context.fillRect(0, 0, this.width, this.height);
    
    // Draw platforms
    this.context.fillStyle = 'brown';
    for (const platform of this.objects.platforms) {
      this.context.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw coins
    this.context.fillStyle = 'yellow';
    for (const coin of this.objects.coins) {
      if (!coin.collected) {
        this.context.beginPath();
        this.context.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        this.context.fill();
      }
    }
    
    // Draw enemies
    this.context.fillStyle = 'red';
    for (const enemy of this.objects.enemies) {
      this.context.fillRect(enemy.x - enemy.width/2, enemy.y - enemy.height/2, enemy.width, enemy.height);
    }
    
    // Draw flag
    this.context.fillStyle = 'lime';
    this.context.fillRect(this.objects.goalFlag.x - 5, this.objects.goalFlag.y - 30, 10, 30);
    this.context.fillRect(this.objects.goalFlag.x - 5, this.objects.goalFlag.y - 30, 20, 15);
    
    // Draw player
    this.context.fillStyle = 'blue';
    this.context.fillRect(
      this.player.x - this.player.width/2, 
      this.player.y - this.player.height/2, 
      this.player.width, 
      this.player.height
    );
    
    // Draw UI
    this.context.fillStyle = 'white';
    this.context.font = '24px Arial';
    this.context.textAlign = 'left';
    this.context.fillText(`Level: ${this.stats.level}`, 20, 30);
    this.context.fillText(`Score: ${this.stats.score}`, 20, 60);
  },
  
  // Clean up function
  destroy: function() {
    console.log("Destroying platformer game and removing event listeners");
    this.isRunning = false;
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
};

// Export the game
window.platformerGame = {
  init: function(container, soundOptions) {
    PlatformerGame.init(container, soundOptions);
    return PlatformerGame;
  },
  destroy: function() {
    PlatformerGame.destroy();
  }
};