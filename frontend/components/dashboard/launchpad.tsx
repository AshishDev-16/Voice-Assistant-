"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, MessageSquare, BookOpen, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Step {
  id: string;
  title: string;
  desc: string;
  icon: any;
  actionLabel: string;
  actionUrl: string;
  isCompleted: boolean;
}

export function Launchpad({ businessName, twilioNumber }: { businessName: string; twilioNumber: string }) {
  const steps: Step[] = [
    {
      id: "test_call",
      title: "Make your first Test Call",
      desc: "Call your AI assistant to verify the voice, logic, and response time.",
      icon: Phone,
      actionLabel: "Call Now",
      actionUrl: `tel:${twilioNumber}`,
      isCompleted: false,
    },
    {
      id: "whatsapp_sync",
      title: "Sync WhatsApp Assistant",
      desc: "Connect your business number to start automating customer chats.",
      icon: MessageSquare,
      actionLabel: "Setup Sync",
      actionUrl: "/dashboard/settings",
      isCompleted: false,
    },
    {
      id: "knowledge_check",
      title: "Perfect the 'Brain'",
      desc: "Add your pricing list and FAQs to ensure the AI speaks like a pro.",
      icon: BookOpen,
      actionLabel: "Edit Knowledge",
      actionUrl: "/dashboard/knowledge",
      isCompleted: true, // Marked as done because they did it in onboarding
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Launchpad <Sparkles className="w-8 h-8 text-maroon-500 animate-pulse" />
          </h2>
          <p className="text-zinc-500 font-medium mt-2">
            Welcome to the Hub, <span className="text-white font-bold">{businessName}</span>. Let's get your agent mission-ready.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon-500/10 border border-maroon-500/20 text-xs font-bold text-maroon-400 uppercase tracking-widest">
           Starter Plan Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative p-8 rounded-[32px] border transition-all duration-500 ${
              step.isCompleted 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : "bg-white/[0.03] border-white/5 hover:border-maroon-500/30 hover:bg-white/[0.05]"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
              step.isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-black/50 text-maroon-500 border border-white/5"
            }`}>
              <step.icon className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {step.title}
              {step.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
              {step.desc}
            </p>

            <Link href={step.actionUrl}>
              <Button 
                variant={step.isCompleted ? "secondary" : "default"}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  step.isCompleted 
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none" 
                    : "bg-maroon-600 hover:bg-maroon-500 text-white shadow-[0_0_30px_rgba(153,27,27,0.2)]"
                }`}
              >
                {step.isCompleted ? "Review Step" : step.actionLabel}
                {!step.isCompleted && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </Link>

            {/* Progress line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-white/5 z-0" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-[40px] bg-gradient-to-br from-maroon-900/20 to-black border border-maroon-500/20 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-maroon-500/10 flex items-center justify-center border border-maroon-500/20">
            <Zap className="w-10 h-10 text-maroon-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Unlock Infinite Intelligence</h4>
            <p className="text-sm text-zinc-500 mt-1 max-w-md">
              Upgrade to the <span className="text-maroon-400 font-bold italic">Pro Plan</span> today to unlock lead scoring, custom extraction schemas, and the full Intelligence Hub.
            </p>
          </div>
        </div>
        <Link href="/#pricing">
          <Button className="px-10 py-7 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs">
            Upgrade To Pro
          </Button>
        </Link>
      </div>
    </div>
  );
}
