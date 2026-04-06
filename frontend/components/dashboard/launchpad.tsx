"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, MessageSquare, BookOpen, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
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
      title: "Start Test Call",
      desc: "Call your AI agent to test its responses and business knowledge.",
      icon: Phone,
      actionLabel: "TEST NOW",
      actionUrl: `tel:${twilioNumber}`,
      isCompleted: false,
    },
    {
      id: "whatsapp_sync",
      title: "Connect WhatsApp",
      desc: "Link your WhatsApp account to automate customer chats globally.",
      icon: MessageSquare,
      actionLabel: "CONNECT NOW",
      actionUrl: "/dashboard/settings",
      isCompleted: false,
    },
    {
      id: "knowledge_check",
      title: "Fine-tune Agent",
      desc: "Add your business pricing and FAQs to ensure accurate AI responses.",
      icon: BookOpen,
      actionLabel: "EDIT INFO",
      actionUrl: "/dashboard/knowledge",
      isCompleted: true,
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col h-full bg-background transition-colors duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b-2 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground italic uppercase underline decoration-primary/20 decoration-4 underline-offset-[8px]">
                Launchpad 
              </h2>
            </div>
            <p className="text-muted-foreground font-black text-[10px] mt-4 uppercase tracking-[0.5em] italic leading-relaxed max-w-2xl">
              Welcome to your Dashboard. STATUS: <span className="text-primary">AWAITING AGENT SETUP</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 rounded-2xl bg-card border-2 border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-105 active:scale-95 italic">
            <Zap className="w-4 h-4 animate-bounce" /> Starter Plan Active
          </div>
        </div>

      <div className="grid gap-6 md:grid-cols-3 flex-1 min-h-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className={`group relative p-8 rounded-[40px] border-2 transition-all duration-700 flex flex-col ${
              step.isCompleted 
                ? "bg-emerald-500/5 border-emerald-500/10 shadow-lg shadow-emerald-500/5" 
                : "glass-card border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner border-2 ${
              step.isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-card text-primary border-border"
            }`}>
              <step.icon className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-foreground mb-3 flex items-center gap-3 uppercase italic tracking-tighter">
              {step.title}
              {step.isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-8 font-bold italic line-clamp-2">
              {step.desc}
            </p>

            <div className="mt-auto">
              <Link href={step.actionUrl}>
                <Button 
                  className={`w-full h-16 rounded-[20px] font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 shadow-xl active:scale-95 ${
                    step.isCompleted 
                      ? "bg-emerald-500/5 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                  }`}
                >
                  {step.isCompleted ? "READY" : step.actionLabel}
                  {!step.isCompleted && <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </Link>
            </div>

            <div className="absolute top-6 right-8 text-[48px] font-black text-foreground/5 italic pointer-events-none select-none">
              0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 rounded-[48px] bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-8 py-12 relative overflow-hidden group shadow-xl transition-all hover:border-primary/10">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 shadow-inner group-hover:rotate-12 transition-transform duration-700">
            <Zap className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Scale Your AI</h4>
            <p className="text-[10px] text-muted-foreground mt-2 max-w-lg font-black uppercase tracking-[0.3em] italic leading-loose">
              Upgrade to the <span className="text-primary italic">Pro Plan</span> to unlock lead scoring, secure data extraction, and advanced analytics.
            </p>
          </div>
        </div>
        <Link href="/#pricing" className="relative z-10 shrink-0">
          <Button className="px-12 h-16 bg-foreground text-background hover:scale-105 active:scale-95 rounded-[20px] font-black uppercase tracking-[.4em] text-[10px] transition-all shadow-xl">
            Upgrade Plan
          </Button>
        </Link>
      </div>
    </div>
  );
}
