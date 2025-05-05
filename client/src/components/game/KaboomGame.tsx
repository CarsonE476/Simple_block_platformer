import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { initGame } from "@/lib/game";

const KaboomGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { playHit, playSuccess, isMuted } = useAudio();
  
  // Initialize the game
  useEffect(() => {
    if (!gameContainerRef.current) return;
    
    // Remove any existing canvas
    const existingCanvas = gameContainerRef.current.querySelector("canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }
    
    const cleanup = initGame({
      container: gameContainerRef.current,
      soundEffects: {
        playHit,
        playSuccess,
        isMuted: () => isMuted,
      },
    });
    
    return cleanup;
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
