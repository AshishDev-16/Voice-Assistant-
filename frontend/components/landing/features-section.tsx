"use client";

import { Brain, Cpu, Database, Globe, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      title: "Autonomous Voice Engine",
      description: "Proprietary neural architecture that processes intent and nuance with human-like precision.",
      icon: Brain,
      className: "md:col-span-2 md:row-span-2",
      delay: 0.1,
    },
    {
      title: "Sub-100ms Latency",
      description: "Optimized streaming protocols for seamless, real-time interactive dialogue.",
      icon: Zap,
      className: "md:col-span-1 md:row-span-1 text-emerald-400",
      delay: 0.2,
    },
    {
      title: "Global Reach",
      description: "Support for 50+ languages with localized accents and cultural context.",
      icon: Globe,
      className: "md:col-span-1 md:row-span-1 text-gold-400",
      delay: 0.3,
    },
    {
      title: "Deep CRM Integration",
      description: "Automatic data extraction and synchronization with your existing tech stack.",
      icon: Database,
      className: "md:col-span-2 md:row-span-1",
      delay: 0.4,
    }
  ];

  return (
    <section id="features" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20"
        >
          <div className="text-emerald-500 font-display font-black uppercase tracking-[.4em] text-[10px] mb-4">Core Architecture</div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-none mb-6">
            ENGINEERED FOR <br/><span className="text-emerald-500 italic">TOTAL DOMINANCE</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium">
            We didn't just build an AI; we built a next-generation communication tier that handles complexity where others fail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              viewport={{ once: true }}
              className={`group relative p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed font-medium">
                  {feature.description}
                </p>

                <div className="mt-auto pt-4 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/0 group-hover:text-emerald-500 transition-all">
                   <Layers className="w-3 h-3" />
                   <span>Operational System 4.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
