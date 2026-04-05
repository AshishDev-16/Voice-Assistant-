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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use a ref for cleanup to handle the async init closure correctly
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
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

        const handleResize = () => {
          if (app?.resize) app.resize();
        };

        window.addEventListener('resize', handleResize);
        
        cleanupRef.current = () => {
          window.removeEventListener('resize', handleResize);
          if (app?.destroy) app.destroy();
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  // Performance Optimization: Pause/Resume based on visibility
  useEffect(() => {
    if (!tubesRef.current) return;

    const onVisibilityChange = () => {
      const isHidden = document.hidden;
      if (tubesRef.current) {
          // Some versions of threejs-components use stop/start or pause/play
          if (isHidden) {
              tubesRef.current?.pause?.();
              tubesRef.current?.stop?.();
          } else {
              tubesRef.current?.play?.();
              tubesRef.current?.start?.();
          }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!tubesRef.current) return;
        if (!entry.isIntersecting) {
            tubesRef.current?.pause?.();
            tubesRef.current?.stop?.();
        } else {
            tubesRef.current?.play?.();
            tubesRef.current?.start?.();
        }
      },
      { threshold: 0 }
    );

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [isLoaded]); // Depend on isLoaded to ensure tubesRef is populated

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current || !tubesRef.current.tubes) return;
    
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
      ref={containerRef}
      className={cn("relative w-full h-full min-h-[90vh] overflow-hidden bg-[#030712] flex items-center justify-center", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className={cn("absolute inset-0 w-full h-full block transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
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
