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
    // New simple vanilla JS implementation
    simplePlatformerGame: {
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
    
    // Add script tag to ensure our simple implementation is loaded
    const scriptElement = document.createElement('script');
    scriptElement.src = '/js/simple-game.js';
    scriptElement.async = true;
    document.body.appendChild(scriptElement);
    
    console.log("Loading simple game implementation...");
    
    // Wait for the simple game implementation to be available
    const initInterval = setInterval(() => {
      if (window.simplePlatformerGame) {
        clearInterval(initInterval);
        
        try {
          // Initialize the game using our vanilla JS implementation
          window.simplePlatformerGame.init(container, soundOptions);
          console.log("Simple platformer game initialized successfully");
        } catch (error) {
          console.error("Error initializing simple game:", error);
          
          // Fallback to original implementation if available
          if (window.platformerGame) {
            try {
              window.platformerGame.init(container, soundOptions);
              console.log("Fallback to original game implementation");
            } catch (fallbackError) {
              console.error("Error initializing fallback game:", fallbackError);
            }
          }
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
      if (window.simplePlatformerGame) {
        try {
          window.simplePlatformerGame.destroy();
          console.log("Simple game destroyed successfully");
        } catch (error) {
          console.error("Error destroying simple game:", error);
        }
      } else if (window.platformerGame) {
        try {
          window.platformerGame.destroy();
          console.log("Original game destroyed successfully");
        } catch (error) {
          console.error("Error destroying original game:", error);
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
