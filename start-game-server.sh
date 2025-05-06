#!/bin/bash

# Check if the platformer-game.html file exists
if [ ! -f platformer-game.html ]; then
  echo "Error: platformer-game.html not found!"
  exit 1
fi

# Run the standalone game server using the project's node setup
echo "Starting standalone game server..."
NODE_OPTIONS="--experimental-modules" tsx simple-server.js