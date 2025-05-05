// Define the level layouts
export const levels = [
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
      // Moving platforms would be here in a more advanced implementation
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
