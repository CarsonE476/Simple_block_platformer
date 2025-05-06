#!/bin/bash

# Check if the required files exist
if [ ! -f platformer-game.html ]; then
  echo "Error: platformer-game.html not found!"
  exit 1
fi

if [ ! -f game-launcher.html ]; then
  echo "Error: game-launcher.html not found!"
  exit 1
fi

# Display options menu
echo "╔════════════════════════════════════════╗"
echo "║      Platformer Game Launch Options     ║"
echo "╠════════════════════════════════════════╣"
echo "║ 1. Run using simple HTTP server         ║"
echo "║ 2. Open game launcher in browser        ║"
echo "║ 3. Open game directly in browser        ║"
echo "║ 4. Exit                                 ║"
echo "╚════════════════════════════════════════╝"

# Get user choice
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    # Run the standalone game server
    echo "Starting standalone game server..."
    node simple-server.js
    ;;
  2)
    # Open game launcher in browser
    echo "Opening game launcher in browser..."
    node run-standalone-game.js
    ;;
  3)
    # Open game directly in browser
    echo "Opening game directly in browser..."
    # Determine platform and open file
    platform=$(uname)
    if [[ "$platform" == "Darwin" ]]; then
      # macOS
      open platformer-game.html
    elif [[ "$platform" == "Linux" ]]; then
      # Linux
      xdg-open platformer-game.html
    else
      # Windows or others
      echo "Please open platformer-game.html manually in your browser"
    fi
    ;;
  4)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting..."
    exit 1
    ;;
esac