"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { PhoneCall, ArrowRight, ArrowLeft, Building2, Brain, ClipboardList, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BUSINESS_TYPES = [
  { value: "dentist", label: "Dentist Clinic", emoji: "🦷" },
  { value: "grocery", label: "Grocery / Delivery", emoji: "🛒" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "salon", label: "Salon / Spa", emoji: "💇" },
  { value: "real_estate", label: "Real Estate", emoji: "🏠" },
  { value: "clinic", label: "Medical Clinic", emoji: "🏥" },
  { value: "auto", label: "Auto Service", emoji: "🚗" },
  { value: "custom", label: "Other Business", emoji: "🏢" },
];

const EXTRACTION_TEMPLATES: Record<string, { field: string; type: string }[]> = {
  dentist: [
    { field: "Patient Name", type: "text" },
    { field: "Procedure", type: "text" },
    { field: "Preferred Date", type: "date" },
    { field: "Preferred Time", type: "time" },
    { field: "Phone Number", type: "phone" },
  ],
  grocery: [
    { field: "Customer Name", type: "text" },
    { field: "Items Ordered", type: "list" },
    { field: "Delivery Address", type: "text" },
    { field: "Phone Number", type: "phone" },
  ],
  restaurant: [
    { field: "Guest Name", type: "text" },
    { field: "Party Size", type: "number" },
    { field: "Reservation Date", type: "date" },
    { field: "Reservation Time", type: "time" },
    { field: "Special Requests", type: "text" },
  ],
  salon: [
    { field: "Client Name", type: "text" },
    { field: "Service Requested", type: "text" },
    { field: "Preferred Date", type: "date" },
    { field: "Preferred Time", type: "time" },
  ],
  real_estate: [
    { field: "Client Name", type: "text" },
    { field: "Property Interest", type: "text" },
    { field: "Budget Range", type: "text" },
    { field: "Viewing Date", type: "date" },
  ],
  clinic: [
    { field: "Patient Name", type: "text" },
    { field: "Symptoms", type: "text" },
    { field: "Preferred Doctor", type: "text" },
    { field: "Appointment Date", type: "date" },
  ],
  auto: [
    { field: "Customer Name", type: "text" },
    { field: "Vehicle Make/Model", type: "text" },
    { field: "Service Needed", type: "text" },
    { field: "Preferred Date", type: "date" },
  ],
  custom: [
    { field: "Caller Name", type: "text" },
    { field: "Inquiry Type", type: "text" },
    { field: "Details", type: "text" },
  ],
};

const PERSONA_TEMPLATES: Record<string, string> = {
  dentist: "You are a warm, professional receptionist for a dental clinic. Greet callers politely, help them book or reschedule appointments, and collect their name, preferred procedure, and timing. If asked about emergency cases, advise them to come in immediately.",
  grocery: "You are a friendly order-taking assistant for a grocery delivery service. Help callers place orders by collecting item names, quantities, and delivery address. Suggest popular items if asked. Always confirm the order before ending the call.",
  restaurant: "You are a polished reservation assistant for a restaurant. Help callers book tables by collecting party size, date, time, and any special dietary requirements. Mention today's specials if asked. Be warm and upscale in tone.",
  salon: "You are a cheerful booking assistant for a salon & spa. Help clients schedule appointments for haircuts, facials, massages, etc. Collect their name, desired service, and preferred time slot.",
  real_estate: "You are a professional real estate inquiry handler. Collect the caller's property interests, budget range, and schedule viewings. Be knowledgeable about location advantages.",
  clinic: "You are a compassionate medical clinic receptionist. Help patients book appointments, note their symptoms briefly, and connect them with the right doctor. Always emphasize that this is not medical advice.",
  auto: "You are a helpful service advisor for an auto repair shop. Collect vehicle details, the service needed, and schedule drop-off times. Be knowledgeable about common services.",
  custom: "You are a professional AI voice assistant. Help callers with their inquiries, collect relevant information, and provide helpful responses based on the business knowledge provided.",
};

export default function StarterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Business Profile
  const [businessType, setBusinessType] = useState("");
  const [businessHours, setBusinessHours] = useState("Mon-Fri 9:00 AM - 6:00 PM");

  // Step 2: AI Persona
  const [aiPersonality, setAiPersonality] = useState("");

  // Step 3: Extraction Schema
  const [extractionFields, setExtractionFields] = useState<{ field: string; type: string }[]>([]);
  const [newFieldName, setNewFieldName] = useState("");

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata.plan) {
      router.push('/#pricing');
    }
  }, [isLoaded, user, router]);

  // Auto-fill persona and extraction when business type changes
  useEffect(() => {
    if (businessType) {
      setAiPersonality(PERSONA_TEMPLATES[businessType] || PERSONA_TEMPLATES.custom);
      setExtractionFields(EXTRACTION_TEMPLATES[businessType] || EXTRACTION_TEMPLATES.custom);
    }
  }, [businessType]);

  const addField = () => {
    if (!newFieldName.trim()) return;
    setExtractionFields([...extractionFields, { field: newFieldName.trim(), type: "text" }]);
    setNewFieldName("");
  };

  const removeField = (index: number) => {
    setExtractionFields(extractionFields.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          businessType,
          businessHours,
          aiPersonality,
          extractionSchema: extractionFields,
          isOnboarded: true,
        }),
      });

      if (res.ok) {
        // Redirect to the appropriate dashboard
        const plan = user.publicMetadata?.plan;
        router.push(plan === 'pro' ? '/dashboard' : '/dashboard');
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { num: 1, label: "Business Profile", icon: Building2 },
    { num: 2, label: "AI Persona", icon: Brain },
    { num: 3, label: "Call Schema", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white">
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-maroon-800/10 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-maroon-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full flex flex-col p-6 space-y-8 animate-in fade-in duration-700 relative z-10">
        <header className="flex justify-between items-center py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-maroon-400 to-white bg-clip-text text-transparent">
            Set Up Your AI Agent
          </h1>
          <UserButton />
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === s.num 
                  ? 'bg-maroon-800/40 border border-maroon-500/50 text-white' 
                  : step > s.num 
                    ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                    : 'bg-white/5 border border-white/10 text-zinc-500'
              }`}>
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-[1px] mx-1 ${step > s.num ? 'bg-green-500/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5">
                <h2 className="text-xl font-semibold mb-1">What type of business do you run?</h2>
                <p className="text-sm text-zinc-500 mb-6">This helps us pre-configure your AI agent with the right templates.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BUSINESS_TYPES.map((bt) => (
                    <button
                      key={bt.value}
                      onClick={() => setBusinessType(bt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                        businessType === bt.value
                          ? 'bg-maroon-900/30 border-maroon-500/50 text-white shadow-[0_0_15px_rgba(128,0,0,0.2)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{bt.emoji}</span>
                      <span>{bt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5">
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Business Hours</label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="e.g. Mon-Fri 9AM-5PM, Sat 10AM-2PM"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-maroon-500/50 focus:ring-1 focus:ring-maroon-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!businessType}
                  className="flex items-center gap-2 px-6 py-3 bg-maroon-700 hover:bg-maroon-600 text-white rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5">
                <h2 className="text-xl font-semibold mb-1">AI Agent Persona</h2>
                <p className="text-sm text-zinc-500 mb-4">We've pre-filled this based on your business type. Customize it to match your brand voice.</p>

                <textarea
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  rows={6}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 focus:border-maroon-500/50 transition-all font-mono text-sm leading-relaxed resize-y"
                  placeholder="Describe how your AI should behave on calls..."
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-3 bg-maroon-700 hover:bg-maroon-600 text-white rounded-xl font-medium transition-all">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5">
                <h2 className="text-xl font-semibold mb-1">Call Extraction Schema</h2>
                <p className="text-sm text-zinc-500 mb-4">What info should the AI collect from each call? Add or remove fields below.</p>

                <div className="space-y-2 mb-4">
                  {extractionFields.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                      <ClipboardList className="h-4 w-4 text-maroon-400 shrink-0" />
                      <span className="text-sm text-white flex-1">{f.field}</span>
                      <span className="text-xs text-zinc-600 bg-white/5 px-2 py-0.5 rounded">{f.type}</span>
                      <button onClick={() => removeField(i)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addField()}
                    placeholder="Add custom field..."
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-maroon-500/50 placeholder:text-zinc-600"
                  />
                  <button onClick={addField} className="px-4 py-2.5 bg-maroon-800/50 hover:bg-maroon-700/50 text-maroon-400 rounded-lg text-sm font-medium border border-maroon-500/30">
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-maroon-700 hover:bg-maroon-600 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(128,0,0,0.3)] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {saving ? "Setting up..." : "Launch My Agent"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
