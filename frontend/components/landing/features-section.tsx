"use client";

import { Zap, Target, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      name: "Instant Setup",
      description: "Connect your phone number, pick your business type, and your AI agent goes live in minutes. No coding required.",
      icon: Clock,
    },
    {
      name: "Human-Like Voice",
      description: "Natural conversation with sub-500ms latency. Callers won't know they're talking to an AI.",
      icon: Zap,
    },
    {
      name: "Structured Outputs",
      description: "Every call produces structured data: names, dates, orders. Extracted automatically and saved to your dashboard.",
      icon: Target,
    },
    {
      name: "Industry Templates",
      description: "Pre-built AI personas for dentists, restaurants, grocers, salons, and more. Customize to match your brand.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient background blobs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-maroon-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-maroon-400 to-white">
            Powerful features to scale
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to manage thousands of voice calls without losing the personal touch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index} 
              className="relative p-8 rounded-3xl bg-white/5 border border-white/5 shadow-2xl hover:border-maroon-500/50 transition-colors backdrop-blur-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-maroon-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-maroon-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-maroon-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
