"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Sapphire & Indigo Palette
const THEME_COLORS = {
  dark: {
    tubes: ["#4f46e5", "#6366f1", "#818cf8"], // Indigo range
    lights: ["#4f46e5", "#818cf8", "#3b82f6", "#4f46e5"],
  },
  light: {
    tubes: ["#2563eb", "#3b82f6", "#60a5fa"], // Sapphire/Royal Blue range
    lights: ["#2563eb", "#60a5fa", "#93c5fd", "#2563eb"],
  }
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
  canvasOpacity?: number;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true,
  canvasOpacity = 0.8
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  
  // Use a ref for cleanup to handle the async init closure correctly
  const cleanupRef = useRef<(() => void) | null>(null);

  const currentTheme = (resolvedTheme || theme || 'dark') as 'dark' | 'light';
  const colors = THEME_COLORS[currentTheme];

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
            colors: colors.tubes,
            lights: {
              intensity: 600,
              colors: colors.lights
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

  // Sync colors when theme changes
  useEffect(() => {
    if (!tubesRef.current || !isLoaded) return;

    if (tubesRef.current.tubes?.setColors) {
      tubesRef.current.tubes.setColors(colors.tubes);
    }
    
    if (tubesRef.current.tubes?.setLightsColors) {
      tubesRef.current.tubes.setLightsColors(colors.lights);
    }
  }, [currentTheme, isLoaded]);

  // Performance Optimization: Pause/Resume based on visibility
  useEffect(() => {
    if (!tubesRef.current || !isLoaded) return;

    const onVisibilityChange = () => {
      const isHidden = document.hidden;
      if (tubesRef.current) {
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
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full min-h-[90vh] overflow-hidden bg-background flex items-center justify-center transition-colors duration-700", className)}
    >
      <canvas 
        ref={canvasRef} 
        className={cn("absolute inset-0 w-full h-full block transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
        style={{ 
            touchAction: 'none',
            opacity: isLoaded ? (currentTheme === 'light' ? canvasOpacity * 0.7 : canvasOpacity) : 0
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full pointer-events-none flex flex-col items-center justify-center">
        {children}
      </div>
      
      {/* Overlay gradient to fade out bottom - SOLID background in light mode to prevent "blur" */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none transition-colors duration-700" />
    </div>
  );
}
