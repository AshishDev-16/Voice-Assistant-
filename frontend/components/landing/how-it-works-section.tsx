"use client";

import { motion } from "framer-motion";
import { Cpu, Link2, Radio } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Uplink Connection",
      description: "Provision a dedicated secure line via our high-availability Twilio node.",
      icon: Link2,
      delay: 0.1,
    },
    {
      title: "Neural Sync",
      description: "Inject your business logic and context into our proprietary LLM architecture.",
      icon: Cpu,
      delay: 0.2,
    },
    {
      title: "Active Deployment",
      description: "Initialize the autonomous agent to handle high-stakes verbal interactions.",
      icon: Radio,
      delay: 0.3,
    },
  ];

  return (
    <section id="process" className="py-32 bg-background relative border-t border-border overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[.5em] text-[10px] mb-6"
          >
            Protocol Initialization
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-8 leading-[0.9]">
            THREE STAGES TO <br/><span className="text-primary italic uppercase">FULL AUTONOMY</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 relative">
          <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-border z-0 shadow-inner" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: step.delay }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-[28px] bg-background border-2 border-border flex items-center justify-center mb-10 group-hover:border-primary group-hover:scale-105 transition-all shadow-xl shadow-background/10">
                <div className="absolute inset-2 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <step.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
              </div>
              
              <div className="text-[10px] font-black text-primary/60 mb-3 uppercase tracking-widest italic group-hover:text-primary transition-colors">0{i+1}.SEQUENCE</div>
              <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-muted-foreground font-bold leading-relaxed italic text-sm group-hover:text-foreground transition-colors max-w-[250px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
