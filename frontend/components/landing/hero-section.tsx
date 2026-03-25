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

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <TubesBackground className="opacity-80">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            style={{ y: y1, opacity }} 
            className="flex flex-col items-start text-left pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-6 flex items-center space-x-2"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Active Uplink</span>
            </motion.div>

            <div className="relative group/title">
              <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-1000" />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.1
                }}
                className="relative text-6xl md:text-8xl font-display font-black leading-[0.9] text-white mb-8 tracking-tighter"
              >
                THE FUTURE<br/>
                OF <span className="text-emerald-500 italic">VOICE</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-600">IS AION</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-medium"
            >
              The first autonomous voice engine that handles your business calls with surgical precision and uncanny human-like nuance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg group transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  Access Console
                  <MoveRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
            className="hidden lg:block relative group"
          >
            {/* Visual Call Mockup Container */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[500px] h-[600px] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-3xl p-8 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute inset-0 grid-pattern opacity-20" />
              
              <div className="relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Phone className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Encrypted Line</div>
                    <div className="text-sm font-mono text-white">+1 (234) AION-VOX</div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center space-y-12">
                   <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
                      <div className="absolute inset-[-10px] rounded-full border border-emerald-500/20 animate-ping" />
                      <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
                         <Mic className="w-10 h-10 text-emerald-500" />
                      </div>
                   </div>
                   <div className="text-center space-y-2">
                      <div className="text-xs uppercase font-black tracking-[0.3em] text-emerald-500">Transcribing Live</div>
                      <div className="text-2xl font-display font-medium text-white italic">"Yes, I can schedule that..."</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <Zap className="w-5 h-5 text-gold-400" />
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Latency</div>
                        <div className="text-lg font-mono text-white">120ms</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Security</div>
                        <div className="text-lg font-mono text-white">TLS 1.3</div>
                    </div>
                </div>
                </div>
              </motion.div>

              {/* Decorative Glows */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-400/5 rounded-full blur-[100px]" />
            </motion.div>

        </div>
      </TubesBackground>
    </section>
  );
}
