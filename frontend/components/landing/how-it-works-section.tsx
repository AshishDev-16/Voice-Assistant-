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
    <section id="process" className="py-32 bg-black relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-display font-black uppercase tracking-[.4em] text-[10px] mb-4"
          >
            Protocol Initialization
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-6">
            THREE STAGES TO <br/><span className="text-emerald-500 italic">FULL AUTONOMY</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 relative">
          <div className="hidden md:block absolute top-[40px] left-0 w-full h-[1px] bg-white/10 z-0" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: step.delay }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:border-emerald-500 transition-all shadow-[0_0_40px_rgba(0,0,0,1)]">
                <div className="absolute inset-2 bg-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <step.icon className="h-8 w-8 text-emerald-500 transition-transform group-hover:scale-110" />
              </div>
              
              <div className="text-xs font-mono text-emerald-800 mb-2 font-black">0{i+1}.SEQUENCE</div>
              <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
