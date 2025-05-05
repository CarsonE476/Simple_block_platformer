import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";

// Define the platformerGame type on the window object
declare global {
  interface Window {
    platformerGame: {
      init: (container: HTMLElement, soundOptions: any) => any;
      destroy: () => void;
    };
  }
}

const KaboomGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { playHit, playSuccess, isMuted } = useAudio();
  
  // Initialize the game
  useEffect(() => {
    if (!gameContainerRef.current) return;
    
    // Wait for platformerGame to be available
    const initInterval = setInterval(() => {
      if (window.platformerGame) {
        clearInterval(initInterval);
        
        try {
          // Initialize the game using the JavaScript implementation
          window.platformerGame.init(gameContainerRef.current, {
            playHit,
            playSuccess,
            isMuted: () => isMuted,
          });
        } catch (error) {
          console.error("Error initializing game:", error);
        }
      }
    }, 100);
    
    // Clean up when component unmounts
    return () => {
      clearInterval(initInterval);
      if (window.platformerGame) {
        try {
          window.platformerGame.destroy();
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
