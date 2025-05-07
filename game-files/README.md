# Platformer Game

A simple platformer game with 3 levels of increasing difficulty. The game features a player character that can move and jump, coins to collect for points, enemies to avoid, and a flag to reach at the end of each level.

## How to Run the Game

There are several ways to run the game:

### Option 1: Run using the bash script (for Mac/Linux users)

1. Open a terminal in the project directory
2. Run the following command:
   ```
   ./start-game-server.sh
   ```
3. Choose one of the options presented:
   - Run using a simple HTTP server
   - Open game launcher in browser
   - Open game directly in browser

### Option 2: Run using Node.js

1. Open a terminal in the project directory
2. Run the following command to start the server:
   ```
   node simple-server.js
   ```
3. Open your browser and navigate to `http://localhost:3000`

### Option 3: Open the HTML files directly

1. Simply open one of these files in your browser:
   - `game-launcher.html` - This will show a game launcher that can open the game
   - `platformer-game.html` - This opens the game directly

## Game Controls

- **Move Left**: Left Arrow or A key
- **Move Right**: Right Arrow or D key
- **Jump**: Up Arrow, W key, or Space bar

## Game Objectives

- Collect coins to increase your score
- Avoid enemies (red squares)
- Reach the flag at the end of each level
- Complete all 3 levels to win the game

## Features

- 3 levels with increasing difficulty
- Simple physics with gravity and collision detection
- Scorekeeping for collected coins
- Sound effects for jumping, collecting coins, and winning
- Responsive design that works on different screen sizes
- Animated win screen with confetti and statistics

## Development

This game was built with vanilla JavaScript without external libraries. It uses HTML5 Canvas for rendering.

The game can run:
1. As a standalone HTML file
2. Within a React application
3. Via a simple Express server