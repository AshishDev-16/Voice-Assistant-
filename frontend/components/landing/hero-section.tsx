"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TubesBackground } from "./tubes-background";
import { MoveRight, Phone, ShieldCheck, Zap, Mic } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 transition-colors duration-700 bg-background">
      <TubesBackground className="" canvasOpacity={0.4}>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            style={{ y: y1, opacity }} 
            className="flex flex-col items-start text-left pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md mb-6 flex items-center space-x-3 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Online</span>
            </motion.div>

            <div className="relative group/title">
              <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-1000" />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.1
                }}
                className="relative text-6xl md:text-8xl font-black leading-[0.85] text-foreground mb-8 tracking-tighter"
              >
                THE FUTURE<br/>
                OF <span className="text-primary italic">VOICE</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-primary/80">IS AION</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed font-bold italic"
            >
              The first autonomous AI voice engine that handles your business calls with surgical precision and uncanny human-like nuance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-[20px] bg-primary hover:scale-105 active:scale-95 text-primary-foreground font-black text-[11px] uppercase tracking-[0.2em] group transition-all shadow-2xl shadow-primary/40">
                  Access Console
                  <MoveRight className="ml-4 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 60,
              damping: 20,
              delay: 0.5
            }}
            className="hidden lg:block relative group perspective-1000"
          >
            {/* Visual Call Mockup Container - Sharp glassmorphism */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[440px] h-[540px] rounded-[32px] glass-card p-8 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 border border-primary/10 dark:border-white/10"
            >
              <div className="absolute inset-0 grid-pattern opacity-[0.03] dark:opacity-20" />
              
              <div className="relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3.5 rounded-[16px] bg-primary/10 border border-primary/20 shadow-inner">
                    <Phone className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-1">Encrypted Stream</div>
                    <div className="text-xs font-mono text-foreground font-bold tracking-tighter">NODE_742-VOX</div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center space-y-12">
                   <div className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
                      <div className="absolute inset-[-10px] rounded-full border-2 border-primary/20 animate-[ping_3s_infinite]" />
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
                         <Mic className="w-10 h-10 text-primary" />
                      </div>
                   </div>
                   <div className="text-center space-y-2">
                       <div className="text-[9px] uppercase font-black tracking-[0.4em] text-primary">AI Streaming</div>
                       <div className="text-3xl font-black text-foreground italic tracking-tighter transition-colors">"I'll confirm that time."</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="p-4 rounded-[16px] bg-background/60 backdrop-blur-md border border-border/60 space-y-2 shadow-sm transition-colors">
                        <Zap className="w-5 h-5 text-primary" />
                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Latency</div>
                        <div className="text-lg font-mono text-foreground font-black tracking-tighter">115ms</div>
                    </div>
                    <div className="p-4 rounded-[16px] bg-background/60 backdrop-blur-md border border-border/60 space-y-2 shadow-sm transition-colors">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Protocol</div>
                        <div className="text-lg font-mono text-foreground font-black tracking-tighter">v.4.0</div>
                    </div>
                </div>
                </div>
              </motion.div>

              {/* Decorative Glows */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] opacity-40 dark:opacity-50 transition-opacity" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] opacity-20 dark:opacity-30 transition-opacity" />
            </motion.div>
        </div>
      </TubesBackground>
    </section>
  );
}
