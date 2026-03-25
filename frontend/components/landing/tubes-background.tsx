"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Helper for random colors
const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // We use the specific local package build for the exact effect.
        // Dynamic import inside useEffect ensures the module is only evaluated in the browser.
        // @ts-ignore
        const module = await import('threejs-components/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#10b981", "#059669", "#34d399"],
            lights: {
              intensity: 600,
              colors: ["#10b981", "#06b6d4", "#22d3ee", "#10b981"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        // Handle resize
        const handleResize = () => {
          if (app && app.resize) {
            app.resize();
          }
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (app && app.destroy) {
             app.destroy();
          }
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current || !tubesRef.current.tubes) return;
    
    // Check if the methods exist before calling them
    if (tubesRef.current.tubes.setColors) {
        const colors = randomColors(3);
        tubesRef.current.tubes.setColors(colors);
    }
    
    if (tubesRef.current.tubes.setLightsColors) {
        const lightsColors = randomColors(4);
        tubesRef.current.tubes.setLightsColors(lightsColors);
    }
  };

  return (
    <div 
      className={cn("relative w-full h-full min-h-[90vh] overflow-hidden bg-[#030712] flex items-center justify-center", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full pointer-events-none flex flex-col items-center justify-center">
        {children}
      </div>
      
      {/* Overlay gradient to fade out bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030712] pointer-events-none" />
    </div>
  );
}
