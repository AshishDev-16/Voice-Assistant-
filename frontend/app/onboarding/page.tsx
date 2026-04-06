"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Clock, 
  Mic2, 
  BookOpen, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Phone,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Sparkles,
  Globe2,
  Target,
  SmilePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TubesBackground } from "@/components/landing/tubes-background";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INDUSTRY_OPTIONS = [
  "Healthcare", "Real Estate", "Legal", "Retail", "Hospitality", 
  "Education", "Finance", "SaaS / Tech", "E-commerce", "Fitness", "Other"
];

const GOAL_OPTIONS = [
  { id: "lead_generation", label: "Gather Leads", desc: "Qualify callers & collect info" },
  { id: "appointment", label: "Book Meetings", desc: "Schedule calls or visits" },
  { id: "support", label: "Customer Support", desc: "Answer FAQs & resolve issues" },
];

const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Hindi", "Arabic", "Portuguese"];

const TONE_OPTIONS = [
  { id: "professional", label: "Professional", icon: ShieldCheck },
  { id: "friendly", label: "Friendly", icon: SmilePlus },
  { id: "urgent", label: "Direct/Urgent", icon: Zap },
];

export default function OnboardingPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [allocatedNumber, setAllocatedNumber] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Healthcare",
    otherBusinessType: "",
    businessHours: "Mon-Fri 9AM-5PM",
    primaryLanguage: "English",
    agentGoal: "lead_generation",
    agentTone: "professional",
    aiPersonality: "Professional, empathetic, and efficient.",
    knowledgeBase: ""
  });

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
      return;
    }
    if (isLoaded && user) {
      if (user.publicMetadata?.isOnboarded) {
        router.push("/dashboard");
        return;
      }
      if (!user.publicMetadata?.plan) {
        router.push("/#pricing");
      }
    }
  }, [isLoaded, userId, user, router]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const generateWithAi = async () => {
    if (!formData.businessName) return;
    setAiGenerating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user/generate-knowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessType: formData.businessType === "Other" ? formData.otherBusinessType : formData.businessType,
          agentGoal: formData.agentGoal
        })
      });
      const data = await res.json();
      if (data.draft) {
        setFormData(prev => ({ ...prev, knowledgeBase: data.draft }));
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  const fetchIndustryTemplate = async (industry: string) => {
    if (industry === "Other") return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user/templates?industry=${industry}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const template = await res.json();
        setFormData(prev => ({ 
          ...prev, 
          knowledgeBase: template.knowledgeBase,
          aiPersonality: template.personality 
        }));
      }
    } catch (err) {
      console.error("Failed to fetch template:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStep(3); 

    try {
      const token = await getToken();
      const finalBusinessType = formData.businessType === "Other" 
        ? formData.otherBusinessType 
        : formData.businessType;

      const res = await fetch(`${API_URL}/api/user/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          clerkId: userId,
          ...formData,
          businessType: finalBusinessType
        })
      });

      if (!res.ok) throw new Error("Onboarding failed");
      
      const data = await res.json();
      setAllocatedNumber(data.business.twilioPhoneNumber);
      
      setTimeout(() => {
        setLoading(false);
      }, 2500);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setStep(2); 
    }
  };

  if (!isLoaded || !userId) return null;

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/30 transition-colors duration-700">
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-100 pointer-events-none">
        <TubesBackground canvasOpacity={0.5} />
      </div>

      <div className="fixed top-8 right-8 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-xl">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-10 rounded-[32px] shadow-2xl relative overflow-hidden group border border-primary/10 dark:border-white/10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity" />
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-inner">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase italic">Business Info</h2>
                    <p className="text-[9px] text-muted-foreground font-black tracking-[0.4em] uppercase">Stage 01: Basic Details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-2.5">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. STERLING DENTAL"
                      className="w-full bg-background/40 backdrop-blur-sm border border-border rounded-xl px-5 py-4 outline-none focus:border-primary transition-all font-black text-lg placeholder:text-muted-foreground/20 shadow-inner"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-2.5">Industry</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-background/40 backdrop-blur-sm border border-border rounded-xl px-5 py-4 outline-none focus:border-primary appearance-none text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-inner"
                          value={formData.businessType}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setFormData({...formData, businessType: newType});
                            fetchIndustryTemplate(newType);
                          }}
                        >
                          {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-card text-foreground">{opt.toUpperCase()}</option>)}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-2.5">Language</label>
                      <div className="relative">
                        <Globe2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <select 
                          className="w-full bg-background/40 backdrop-blur-sm border border-border rounded-xl pl-12 pr-5 py-4 outline-none focus:border-primary appearance-none text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-inner"
                          value={formData.primaryLanguage}
                          onChange={(e) => setFormData({...formData, primaryLanguage: e.target.value})}
                        >
                          {LANGUAGE_OPTIONS.map(lang => <option key={lang} value={lang} className="bg-card text-foreground">{lang.toUpperCase()}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-3.5">Primary Objective</label>
                    <div className="grid grid-cols-3 gap-3">
                      {GOAL_OPTIONS.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setFormData({ ...formData, agentGoal: goal.id })}
                          className={`p-3.5 rounded-xl border transition-all relative overflow-hidden group/btn text-left ${
                            formData.agentGoal === goal.id 
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                            : "bg-background/40 border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="text-[9px] font-black uppercase mb-1 tracking-tighter">{goal.label}</div>
                          <div className="text-[8px] text-muted-foreground leading-tight font-bold italic line-clamp-1">{goal.desc}</div>
                          {formData.agentGoal === goal.id && (
                            <div className="absolute top-2 right-2">
                              <Target className="w-3 h-3 text-primary animate-pulse" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!formData.businessName}
                  className="w-full h-16 mt-10 rounded-2xl bg-primary hover:scale-[1.02] active:scale-[0.98] text-primary-foreground font-black uppercase tracking-[.4em] text-[10px] transition-all shadow-xl shadow-primary/20 group"
                >
                  Next Step <ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-10 rounded-[32px] shadow-2xl relative overflow-hidden group border border-primary/10 dark:border-white/10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-inner">
                    <Mic2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase italic">AI Personality</h2>
                    <p className="text-[9px] text-muted-foreground font-black tracking-[0.4em] uppercase">Stage 02: Agent Configuration</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-2.5">Availability</label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <select 
                          className="w-full bg-background/40 backdrop-blur-sm border border-border rounded-xl px-5 pl-12 py-4 outline-none focus:border-primary appearance-none text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-inner"
                          value={formData.businessHours}
                          onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
                        >
                          <option value="Mon-Fri 9AM-5PM" className="bg-card">MON-FRI 9-5</option>
                          <option value="Mon-Sat 10AM-8PM" className="bg-card">MON-SAT 10-8</option>
                          <option value="24/7 Support" className="bg-card">24/7 SUPPORT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground mb-2.5">Agent Tone</label>
                      <div className="flex space-x-2 h-[52px]">
                        {TONE_OPTIONS.map((tone) => (
                           <button
                             key={tone.id}
                             onClick={() => setFormData({...formData, agentTone: tone.id})}
                             className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                               formData.agentTone === tone.id ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" : "bg-background/40 border-border hover:border-primary/30"
                             }`}
                           >
                             <tone.icon className={`w-3 h-3 mb-1.5 ${formData.agentTone === tone.id ? "text-primary" : "text-muted-foreground"}`} />
                             <span className="text-[8px] font-black uppercase tracking-tighter">{tone.label}</span>
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <label className="block text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground">Business Knowledge</label>
                      <button 
                        onClick={generateWithAi}
                        disabled={aiGenerating || !formData.businessName}
                        className="flex items-center space-x-2 text-[9px] font-black text-primary uppercase tracking-widest hover:brightness-125 transition-all disabled:opacity-30"
                      >
                        {aiGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        <span>AI Suggestion</span>
                      </button>
                    </div>
                    <div className="relative">
                       <textarea 
                        placeholder="Define services, pricing, and operational logic..."
                        className="w-full bg-background/40 backdrop-blur-sm border border-border rounded-2xl px-5 py-5 outline-none focus:border-primary transition-all font-bold italic h-48 resize-none text-[11px] leading-relaxed placeholder:text-muted-foreground/20 shadow-inner"
                        value={formData.knowledgeBase}
                        onChange={(e) => setFormData({...formData, knowledgeBase: e.target.value})}
                      />
                      {aiGenerating && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                          <div className="flex flex-col items-center space-y-3">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <span className="text-[9px] uppercase font-black tracking-[0.4em] text-primary">Generating...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-10">
                  <Button 
                    variant="outline"
                    onClick={handlePrev}
                    className="h-16 rounded-xl px-8 border border-border bg-transparent text-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] shadow-sm"
                  >
                    <ArrowLeft className="mr-2.5 w-4 h-4" /> Revise
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.knowledgeBase || loading}
                    className="flex-1 h-16 rounded-xl bg-primary hover:scale-[1.02] active:scale-[0.98] text-primary-foreground font-black uppercase tracking-[.4em] text-[10px] transition-all shadow-xl shadow-primary/20 group"
                  >
                    Finish Setup <Zap className="ml-3 w-4 h-4 animate-pulse" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 rounded-[40px] shadow-2xl text-center relative overflow-hidden border border-primary/20"
              >
                {loading ? (
                  <div className="py-20 flex flex-col items-center">
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse rounded-full" />
                      <div className="w-28 h-28 rounded-full border-2 border-border flex items-center justify-center relative shadow-inner">
                        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                        <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic">Setting up</h2>
                    <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.5em] max-w-sm">Generating Agent Settings & Configuration</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-primary/40 relative shadow-inner shadow-primary/10"
                    >
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                      <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-black mb-1.5 tracking-tighter uppercase italic text-foreground">AGENT READY</h2>
                    <p className="text-primary text-[9px] font-black uppercase tracking-[0.6em] mb-12">AI Agent is now active</p>
                    
                    <div className="bg-background/60 backdrop-blur-sm border border-primary/10 p-8 rounded-3xl mb-12 relative overflow-hidden group shadow-inner">
                      <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] mb-5">Phone Number</div>
                      <div className="text-3xl font-mono font-black text-foreground tracking-[.1em] select-all decoration-primary/30 decoration-4 underline-offset-8 transition-colors hover:text-primary">{allocatedNumber}</div>
                    </div>

                    <div className="flex flex-col space-y-5">
                      <Button 
                        onClick={() => router.push("/dashboard/intelligence")}
                        className="w-full h-20 rounded-2xl bg-primary hover:scale-[1.02] active:scale-[0.98] text-primary-foreground font-black uppercase tracking-[.4em] text-[12px] transition-all shadow-2xl shadow-primary/30"
                      >
                        Go to Dashboard
                      </Button>
                      <div className="flex items-center justify-center space-x-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Security Handshake Complete</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-12 flex justify-center space-x-3">
              {[1, 2].map((s) => (
                <button
                  key={s}
                  disabled={s > step && !formData.businessName}
                  onClick={() => setStep(s)}
                  className={`h-1 rounded-full transition-all duration-1000 ease-in-out ${step === s ? "w-12 bg-primary" : "w-3 bg-border hover:bg-primary/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
