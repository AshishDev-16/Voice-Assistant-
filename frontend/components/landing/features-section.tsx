"use client";

import { Brain, Cpu, Database, Globe, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      title: "Autonomous Voice Engine",
      description: "Proprietary AI architecture that processes intent and nuance with human-like precision.",
      icon: Brain,
      className: "md:col-span-2 md:row-span-2",
      delay: 0.1,
    },
    {
      title: "Rapid Response Time",
      description: "Optimized streaming protocols for seamless, real-time interactive dialogue.",
      icon: Zap,
      className: "md:col-span-1 md:row-span-1",
      delay: 0.2,
    },
    {
      title: "Global Reach",
      description: "Support for 50+ languages with localized accents and cultural context.",
      icon: Globe,
      className: "md:col-span-1 md:row-span-1",
      delay: 0.3,
    },
    {
      title: "Deep CRM Sync",
      description: "Automatic data extraction and synchronization with your existing tech stack.",
      icon: Database,
      className: "md:col-span-2 md:row-span-1",
      delay: 0.4,
    }
  ];

  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-[0.05] dark:opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-24"
        >
          <div className="text-primary font-black uppercase tracking-[.5em] text-[10px] mb-6">AI Architecture</div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-8">
            ENGINEERED FOR <br/><span className="text-primary italic">TOTAL DOMINANCE</span>
          </h2>
          <p className="text-lg text-muted-foreground font-bold italic max-w-2xl">
            We didn't just build an AI; we built a next-generation communication tier that handles complexity where traditional systems fail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              viewport={{ once: true }}
              className={`group relative p-10 rounded-[40px] glass-card overflow-hidden hover:border-primary/50 transition-all duration-500 ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground group-hover:text-foreground transition-all leading-relaxed font-bold italic text-sm">
                  {feature.description}
                </p>

                <div className="mt-auto pt-6 flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-primary/0 group-hover:text-primary transition-all">
                   <Layers className="w-4 h-4" />
                   <span>Operational Core 4.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
