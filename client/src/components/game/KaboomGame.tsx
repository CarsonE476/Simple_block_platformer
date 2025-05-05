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
    if (!gameContainerRef.current || !window.platformerGame) return;
    
    // Initialize the game using the JavaScript implementation
    window.platformerGame.init(gameContainerRef.current, {
      playHit,
      playSuccess,
      isMuted: () => isMuted,
    });
    
    // Clean up when component unmounts
    return () => {
      if (window.platformerGame) {
        window.platformerGame.destroy();
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
