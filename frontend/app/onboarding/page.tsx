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

  // Form State
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
      // Merge businessType if "Other" is selected
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
      setAllocatedNumber(data.user.twilioPhoneNumber);
      
      setTimeout(() => {
        setLoading(false);
      }, 4000);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setStep(2); 
    }
  };

  if (!isLoaded || !userId) return null;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-maroon-500/30">
      <div className="fixed inset-0 z-0">
        <TubesBackground />
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
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-500/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Building2 className="w-5 h-5 text-maroon-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black tracking-tight uppercase">Identity & Strategy</h2>
                    <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Phase 01: Core Provisioning</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Enterprise Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sterling Dental Clinic"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-maroon-500/50 transition-all font-medium text-base placeholder:text-white/10"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                    <p className="text-[10px] text-zinc-500 mt-2 italic">The name your AI agent will use to identify your business to callers.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Industry Cluster</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-maroon-500/50 appearance-none text-xs font-bold"
                          value={formData.businessType}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setFormData({...formData, businessType: newType});
                            fetchIndustryTemplate(newType);
                          }}
                        >
                          {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-zinc-900">{opt.toUpperCase()}</option>)}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 rotate-90" />
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Primary Dialect</label>
                      <div className="relative">
                        <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <select 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-5 py-4 outline-none focus:border-maroon-500/50 appearance-none text-xs font-bold"
                          value={formData.primaryLanguage}
                          onChange={(e) => setFormData({...formData, primaryLanguage: e.target.value})}
                        >
                          {LANGUAGE_OPTIONS.map(lang => <option key={lang} value={lang} className="bg-zinc-900">{lang.toUpperCase()}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Other Industry */}
                  {formData.businessType === "Other" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Specify Industry</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Space Tourism"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-maroon-500/50 transition-all font-medium text-sm placeholder:text-white/10"
                        value={formData.otherBusinessType}
                        onChange={(e) => setFormData({...formData, otherBusinessType: e.target.value})}
                      />
                    </motion.div>
                  )}

                  {/* Goal Selection */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-3">Primary Mission Goal</label>
                    <div className="grid grid-cols-3 gap-3">
                      {GOAL_OPTIONS.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setFormData({ ...formData, agentGoal: goal.id })}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group/btn ${
                            formData.agentGoal === goal.id 
                            ? "bg-maroon-500/10 border-maroon-500/50" 
                            : "bg-white/[0.02] border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="text-[10px] font-black uppercase mb-1">{goal.label}</div>
                          <div className="text-[8px] text-slate-500 leading-tight">{goal.desc}</div>
                          {formData.agentGoal === goal.id && (
                            <div className="absolute top-1 right-1">
                              <Target className="w-2 h-2 text-maroon-500" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 italic">This helps the AI prioritize its conversation flow based on your business needs.</p>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!formData.businessName || (formData.businessType === "Other" && !formData.otherBusinessType)}
                  className="w-full h-14 mt-10 rounded-xl bg-maroon-600 hover:bg-maroon-500 text-white font-black uppercase tracking-[.3em] text-[10px] transition-all shadow-[0_0_40px_rgba(153,27,27,0.2)] group"
                >
                  Neural Mapping <ChevronRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Mic2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black tracking-tight uppercase tracking-widest">Persona Logic</h2>
                    <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Phase 02: AI Brain Design</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Operations Log & Tone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Operations Log</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <select 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-5 py-4 outline-none focus:border-emerald-500/50 appearance-none text-xs font-bold"
                          value={formData.businessHours}
                          onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
                        >
                          <option value="Mon-Fri 9AM-5PM" className="bg-zinc-900">MON-FRI 9-5</option>
                          <option value="Mon-Sat 10AM-8PM" className="bg-zinc-900">MON-SAT 10-8</option>
                          <option value="24/7 Support" className="bg-zinc-900">24/7 SUPPORT</option>
                          <option value="Custom" className="bg-zinc-900">CUSTOM</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Agent Tone</label>
                      <div className="flex space-x-2">
                        {TONE_OPTIONS.map((tone) => (
                           <button
                             key={tone.id}
                             onClick={() => setFormData({...formData, agentTone: tone.id})}
                             className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                               formData.agentTone === tone.id ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white/[0.02] border-white/5"
                             }`}
                           >
                             <tone.icon className={`w-3 h-3 mb-1 ${formData.agentTone === tone.id ? "text-emerald-500" : "text-slate-500"}`} />
                             <span className="text-[8px] font-black uppercase tracking-tighter">{tone.label}</span>
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Knowledge with AI */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500">Enterprise Knowledge</label>
                      <button 
                        onClick={generateWithAi}
                        disabled={aiGenerating || !formData.businessName}
                        className="flex items-center space-x-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors disabled:opacity-30"
                      >
                        {aiGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        <span>Auto-Draft with AI</span>
                      </button>
                    </div>
                    <div className="relative">
                       <textarea 
                        placeholder="Define services, prices, and FAQs. This is the source of truth for the AI..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-emerald-500/50 transition-all font-medium h-48 resize-none text-[10px] leading-relaxed placeholder:text-white/10"
                        value={formData.knowledgeBase}
                        onChange={(e) => setFormData({...formData, knowledgeBase: e.target.value})}
                      />
                      {aiGenerating && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                          <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Synthesizing...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 italic">This acts as the "Brain" of your agent. Provide detailed info about your services.</p>
                  </div>
                </div>

                <div className="flex space-x-4 mt-10">
                  <Button 
                    variant="outline"
                    onClick={handlePrev}
                    className="h-14 rounded-xl px-8 border-white/10 bg-transparent text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]"
                  >
                    <ArrowLeft className="mr-2 w-3 h-3" /> REVISE
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.knowledgeBase || loading}
                    className="flex-1 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[.3em] text-[10px] transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] group"
                  >
                    Provision Node <Zap className="ml-2 w-3 h-3 animate-pulse" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl text-center relative overflow-hidden"
              >
                {loading ? (
                  <div className="py-20 flex flex-col items-center">
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-maroon-500/30 blur-[80px] animate-pulse rounded-full" />
                      <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center relative">
                        <Loader2 className="w-10 h-10 text-maroon-500 animate-spin relative z-10" />
                        <div className="absolute inset-0 border-2 border-maroon-500/30 rounded-full animate-ping" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-display font-black mb-3 tracking-[-.05em] uppercase italic">Provisioning Hub</h2>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] max-w-sm">Generating Satellite Credentials & Neural Mapping</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 relative"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <div className="absolute inset-0 bg-emerald-500/10 blur-[30px] rounded-full" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-display font-black mb-1 tracking-[-.07em]">NODE ONLINE</h2>
                    <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.5em] mb-10">Satellite Synchronization Active</p>
                    
                    <div className="bg-white/[0.05] border border-white/5 p-8 rounded-3xl mb-10 relative overflow-hidden group">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Allocated AI Phone Number</div>
                      <div className="text-4xl font-display font-black text-white tracking-[.15em] select-all">{allocatedNumber}</div>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <Button 
                        onClick={() => router.push("/dashboard")}
                        className="w-full h-16 rounded-xl bg-white text-black hover:bg-slate-200 font-black uppercase tracking-[.3em] text-[10px] transition-all"
                      >
                        Go To Dashboard
                      </Button>
                      <div className="flex items-center justify-center space-x-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>Security Handshake Complete</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-10 flex justify-center space-x-3">
              {[1, 2].map((s) => (
                <div 
                  key={s} 
                  className={`h-1 rounded-full transition-all duration-700 ease-in-out ${step === s ? "w-12 bg-maroon-600" : "w-3 bg-white/10"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
