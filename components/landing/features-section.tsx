"use client";

import { Zap, Target, BarChart3, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      name: "Automated Replies",
      description: "Instantly respond to common queries, 24/7. Never miss a potential lead because you were asleep.",
      icon: Clock,
    },
    {
      name: "Lead Capture",
      description: "Automatically collect names, emails, and phone numbers directly in the chat flow.",
      icon: Target,
    },
    {
      name: "Smart Routing",
      description: "Use NLP to understand customer intent and route complex queries to human agents.",
      icon: Zap,
    },
    {
      name: "Analytics",
      description: "Track conversation volume, conversion rates, and response times from your dashboard.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-24 bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Powerful features to scale
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to manage thousands of WhatsApp conversations without losing the personal touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors backdrop-blur-sm group">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
