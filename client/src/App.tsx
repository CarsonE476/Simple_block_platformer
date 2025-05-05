import { useEffect, useState } from "react";
import "@fontsource/inter";
import "./index.css";
import KaboomGame from "./components/game/KaboomGame";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useAudio } from "./lib/stores/useAudio";

// Main App component
function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameRestart, setGameRestart] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  
  useEffect(() => {
    // Set up background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Set up sound effects
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Store audio elements in the global store
    useAudio.getState().setBackgroundMusic(bgMusic);
    useAudio.getState().setHitSound(hitSound);
    useAudio.getState().setSuccessSound(successSound);
    
    // Clean up
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {!gameStarted ? (
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <h1 className="text-3xl font-bold text-center mb-2">Platformer Adventure</h1>
            <p className="text-center text-muted-foreground mb-4">
              A simple 3-level platformer game. Use arrow keys to move and space to jump!
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setGameStarted(true)}>
                Start Game
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={toggleMute}
              >
                {isMuted ? "Unmute" : "Mute"} Sound
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => {
              setGameStarted(false);
              setGameRestart(prev => !prev);
            }}>
              Back to Menu
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleMute}
            >
              {isMuted ? "Unmute" : "Mute"} Sound
            </Button>
          </div>
          <KaboomGame key={gameRestart ? "restart" : "initial"} />
        </div>
      )}
    </div>
  );
}

export default App;
