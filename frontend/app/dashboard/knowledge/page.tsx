"use client";

import { useState, useEffect } from "react";
import { Save, Brain, CheckCircle2, AlertCircle, Database, ClipboardList, Loader2 } from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function KnowledgeBasePage() {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();

  const [aiPersonality, setAiPersonality] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [extractionFields, setExtractionFields] = useState<{ field: string; type: string }[]>([]);
  const [businessHours, setBusinessHours] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/profile?clerkId=${user.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAiPersonality(data.aiPersonality || "");
          setKnowledgeBase(data.knowledgeBase || "");
          setExtractionFields(data.extractionSchema || []);
          setBusinessHours(data.businessHours || "");
        }
      } catch (err) {
        console.error("Failed to fetch AI profile settings", err);
      } finally {
        setInitialLoad(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setStatus("saving");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          aiPersonality,
          knowledgeBase,
          extractionSchema: extractionFields,
          businessHours,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    if (!newFieldName.trim()) return;
    setExtractionFields([...extractionFields, { field: newFieldName.trim(), type: "text" }]);
    setNewFieldName("");
  };

  const removeField = (index: number) => {
    setExtractionFields(extractionFields.filter((_, i) => i !== index));
  };

  if (initialLoad) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-maroon-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-maroon-400" />
          Agent Configuration
        </h1>
        <p className="text-slate-400 text-lg">
          Fine-tune your AI Voice Agent&apos;s behavior, knowledge, and data extraction rules.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Section 1: AI Persona */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-500/5 rounded-full blur-3xl -mx-20 -my-20 group-hover:bg-maroon-500/10 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-maroon-500/10 rounded-lg">
                <Brain className="w-5 h-5 text-maroon-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Persona</h2>
                <p className="text-sm text-slate-400">Define how your AI sounds and behaves on calls.</p>
              </div>
            </div>

            <textarea
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/50 focus:border-maroon-500/50 transition-all font-mono text-sm leading-relaxed min-h-[160px] resize-y"
              placeholder="e.g. You are a professional receptionist for a dental clinic. Greet callers warmly, help them book appointments, and collect their name and preferred time..."
              value={aiPersonality}
              onChange={(e) => setAiPersonality(e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Business Knowledge Base */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mx-20 -my-20 group-hover:bg-blue-500/10 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Business Knowledge</h2>
                <p className="text-sm text-slate-400">FAQs, services, prices, and policies the AI should know during calls.</p>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 text-sm text-blue-200/70 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              The AI will use this information to answer caller questions. If something isn&apos;t covered here, it will gracefully say it doesn&apos;t know.
            </div>

            <textarea
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono text-sm leading-relaxed min-h-[250px] resize-y"
              placeholder="Example:
---
SERVICE: Teeth Cleaning
PRICE: $150
DURATION: 30 minutes

SERVICE: Root Canal
PRICE: $800
DURATION: 90 minutes

OFFICE HOURS: Mon-Fri 9AM-5PM
LOCATION: 123 Main Street, Suite 100
---"
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Extraction Schema */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mx-20 -my-20 group-hover:bg-amber-500/10 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Call Extraction Fields</h2>
                <p className="text-sm text-slate-400">What data should the AI extract from each call?</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {Array.isArray(extractionFields) && extractionFields.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                  <ClipboardList className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-sm text-white flex-1">{f.field}</span>
                  <span className="text-xs text-zinc-600 bg-white/5 px-2 py-0.5 rounded">{f.type}</span>
                  <button onClick={() => removeField(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">✕</button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addField()}
                placeholder="Add custom field (e.g. 'Appointment Date')..."
                className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-maroon-500/50 placeholder:text-zinc-600"
              />
              <button onClick={addField} className="px-4 py-2.5 bg-maroon-800/50 hover:bg-maroon-700/50 text-maroon-400 rounded-lg text-sm font-medium border border-maroon-500/30 transition-all">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Business Hours */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Business Hours</h2>
              <p className="text-sm text-slate-400">When should the AI answer calls? Outside these hours, it can leave a voicemail message.</p>
            </div>
          </div>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            placeholder="e.g. Mon-Fri 9AM-5PM, Sat 10AM-2PM"
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-maroon-500/50 focus:border-maroon-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>

        {/* Action Bar */}
        <div className="flex justify-end items-center pt-4">
          <div className="flex items-center gap-4">
            {status === "success" && (
              <span className="text-green-400 text-sm font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="w-4 h-4" />
                Configuration saved
              </span>
            )}
            {status === "error" && (
              <span className="text-rose-400 text-sm font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
                <AlertCircle className="w-4 h-4" />
                Save failed
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(128,0,0,0.3)] hover:shadow-[0_0_30px_rgba(128,0,0,0.5)]"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
