import { levels } from "./levels";
import { useAudio } from "../stores/useAudio";

// Define game objects
interface GameObject {
  type: string;
  // common properties
  [key: string]: any;
}

interface KaboomInstance {
  // Kaboom methods we'll use
  scene: (name: string, callback: () => void) => void;
  go: (scene: string, ...args: any[]) => void;
  add: (components: any[]) => any;
  pos: (x: number, y: number) => any;
  sprite: (name: string) => any;
  outline: (width: number, color: any) => any;
  area: () => any;
  body: (options?: any) => any;
  scale: (x: number, y?: number) => any;
  rotate: (angle: number) => any;
  color: (color: number[]) => any;
  rect: (width: number, height: number) => any;
  text: (txt: string, options?: any) => any;
  anchor: (anchor: string) => any;
  z: (z: number) => any;
  onKeyDown: (key: string, callback: () => void) => void;
  onKeyPress: (key: string, callback: () => void) => void;
  onCollide: (tag1: string, tag2: string, callback: (a: any, b: any) => void) => void;
  shake: (intensity?: number) => void;
  play: (sound: string, options?: any) => void;
  layers: (layers: string[], def?: string) => void;
  loadSprite: (name: string, data: any) => void;
  loadSound: (name: string, data: any) => void;
  gravity: (gravity: number) => void;
  onUpdate: (callback: (obj: any) => void) => void;
  destroy: (obj: any) => void;
  wait: (seconds: number, callback: () => void) => void;
  [key: string]: any;
}

interface GameOptions {
  container: HTMLElement;
  soundEffects: {
    playHit: () => void;
    playSuccess: () => void;
    isMuted: () => boolean;
  };
}

// Game state
let currentLevel = 0;
let score = 0;
let k: KaboomInstance;

export function initGame(options: GameOptions) {
  // Initialize kaboom
  k = (window as any).kaboom({
    global: false,
    canvas: document.createElement("canvas"),
    background: [0, 0, 0],
    width: 1280,
    height: 720,
    scale: 1,
    debug: false,
  });

  // Add the canvas to the container
  options.container.appendChild(k.canvas);

  // Load assets
  loadGameAssets();

  // Define game components and behavior
  setupGameComponents();

  // Set up game scenes
  setupGameScenes();

  // Start with the main menu
  k.go("menu");

  // Return cleanup function
  return () => {
    k.destroy();
  };

  function loadGameAssets() {
    // Load sprites
    // Using simple colored rectangles as we're keeping it basic
    defineSimpleSprites();
    
    // Load sounds from the provided assets
    k.loadSound("jump", "/sounds/success.mp3");
    k.loadSound("hit", "/sounds/hit.mp3");
    k.loadSound("complete", "/sounds/success.mp3");
  }

  function defineSimpleSprites() {
    // Player sprite - blue rectangle
    k.loadSprite("player", generateRectSpriteData([0, 0, 255]));
    
    // Platform sprite - brown rectangle
    k.loadSprite("platform", generateRectSpriteData([139, 69, 19]));
    
    // Enemy sprite - red rectangle
    k.loadSprite("enemy", generateRectSpriteData([255, 0, 0]));
    
    // Coin sprite - yellow circle
    k.loadSprite("coin", generateCircleSpriteData([255, 255, 0]));
    
    // Flag sprite - green rectangle
    k.loadSprite("flag", generateRectSpriteData([0, 255, 0]));
  }

  function generateRectSpriteData(color: number[]) {
    // Create a simple colored rectangle as a sprite
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(0, 0, 32, 32);
    return canvas;
  }

  function generateCircleSpriteData(color: number[]) {
    // Create a simple colored circle as a sprite
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }

  function setupGameComponents() {
    // Set up gravity
    k.gravity(2000);

    // Define player movement
    k.onKeyDown("left", () => {
      const player = k.get("player")[0];
      if (player) {
        player.move(-300, 0);
      }
    });

    k.onKeyDown("right", () => {
      const player = k.get("player")[0];
      if (player) {
        player.move(300, 0);
      }
    });

    k.onKeyPress("space", () => {
      const player = k.get("player")[0];
      if (player && player.isGrounded()) {
        player.jump(650);
        if (!options.soundEffects.isMuted()) {
          k.play("jump", {
            volume: 0.5,
          });
        }
      }
    });

    // Define collisions
    k.onCollide("player", "enemy", () => {
      const player = k.get("player")[0];
      if (player) {
        player.hurt();
        k.shake(10);
        
        if (!options.soundEffects.isMuted()) {
          options.soundEffects.playHit();
        }
      }
    });

    k.onCollide("player", "coin", (p, c) => {
      if (!options.soundEffects.isMuted()) {
        k.play("jump", {
          volume: 0.2,
        });
      }
      k.destroy(c);
      score += 10;
      updateScore();
    });

    k.onCollide("player", "flag", () => {
      if (!options.soundEffects.isMuted()) {
        options.soundEffects.playSuccess();
      }
      
      if (currentLevel < levels.length - 1) {
        currentLevel++;
        k.go("game");
      } else {
        k.go("win");
      }
    });
  }

  function setupGameScenes() {
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
      const scoreText = k.add([
        k.text(`Score: ${score}`, { size: 24 }),
        k.pos(20, 50),
      ]);

      // Function to update score display
      window.updateScore = () => {
        scoreText.text = `Score: ${score}`;
      };

      // Build level
      const levelData = levels[currentLevel];
      buildLevel(levelData);
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
  }

  function buildLevel(levelData: any) {
    // Create player
    const player = k.add([
      k.sprite("player"),
      k.pos(levelData.player.x, levelData.player.y),
      k.area(),
      k.body(),
      k.health(3),
      k.anchor("center"),
      "player",
    ]);

    // Player hurt handler
    player.onHurt(() => {
      k.shake(10);
      if (player.hp() <= 0) {
        k.go("gameover");
      }
    });

    // Add platforms
    levelData.platforms.forEach((platform: any) => {
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
    levelData.enemies.forEach((enemy: any) => {
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
    levelData.coins.forEach((coin: any) => {
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
}
