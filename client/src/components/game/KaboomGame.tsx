import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";

// Define the game implementations on the window object
declare global {
  interface Window {
    // Original Kaboom implementation
    platformerGame: {
      init: (container: HTMLElement, soundOptions: any) => any;
      destroy: () => void;
    };
  }
}

interface SoundOptions {
  playHit: () => void;
  playSuccess: () => void;
  isMuted: () => boolean;
}

const KaboomGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { playHit, playSuccess, isMuted } = useAudio();
  
  // Initialize the game
  useEffect(() => {
    // Ensure we have a reference to the container
    const container = gameContainerRef.current;
    if (!container) return;
    
    // Create sound options object
    const soundOptions: SoundOptions = {
      playHit,
      playSuccess,
      isMuted: () => isMuted,
    };
    
    // Add script tag to ensure our implementation is loaded
    const scriptElement = document.createElement('script');
    scriptElement.src = '/js/platformer.js';
    scriptElement.async = true;
    document.body.appendChild(scriptElement);
    
    console.log("Loading platformer game implementation...");
    
    // Wait for the game implementation to be available
    const initInterval = setInterval(() => {
      if (window.platformerGame) {
        clearInterval(initInterval);
        
        try {
          // Initialize the game
          window.platformerGame.init(container, soundOptions);
          console.log("Platformer game initialized successfully");
        } catch (error) {
          console.error("Error initializing game:", error);
        }
      }
    }, 100);
    
    // Clean up when component unmounts
    return () => {
      clearInterval(initInterval);
      
      // Clean up script tag
      if (scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      
      // Clean up game instance
      if (window.platformerGame) {
        try {
          window.platformerGame.destroy();
          console.log("Game destroyed successfully");
        } catch (error) {
          console.error("Error destroying game:", error);
        }
      }
    };
  }, [playHit, playSuccess, isMuted]);
  
  return (
    <div 
      ref={gameContainerRef} 
      className="rounded-lg overflow-hidden border border-border shadow-xl"
      style={{ 
        width: "100%", 
        height: "600px",
        backgroundColor: "#000"
      }}
    />
  );
};

export default KaboomGame;
