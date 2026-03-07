"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TubesBackground } from "./tubes-background";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <TubesBackground>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md px-3 py-1 text-sm font-medium text-white mb-8 cursor-default pointer-events-auto"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            WhatsApp Cloud API V17 Supported
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl pointer-events-auto"
          >
            AI That Sells For You <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              On WhatsApp
            </span>
          </motion.h1>
{/* 
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-md pointer-events-auto"
          >
            Automate replies, capture leads, and close sales 24/7. Turn your WhatsApp business number into an automated revenue engine.
          </motion.p> */}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pointer-events-auto"
          >
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
              <MessageCircle className="mr-2 h-5 w-5" /> Book Demo
            </Button>
          </motion.div>
        </div>
      </TubesBackground>
    </section>
  );
}
