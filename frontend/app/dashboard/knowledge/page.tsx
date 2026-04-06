"use client";

import { useState, useEffect } from "react";
import { Save, Brain, CheckCircle2, AlertCircle, Database, ClipboardList, Loader2, X } from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-1 flex items-center gap-3 uppercase italic">
          <Brain className="w-7 h-7 text-primary" />
          Agent Configuration
        </h1>
        <p className="text-muted-foreground text-sm font-bold italic">
          Fine-tune behavior, knowledge, and extraction schemas.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Section 1: AI Persona */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground uppercase italic tracking-tight">AI Persona</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Voice Tone & Protocol</p>
              </div>
            </div>

            <textarea
              className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono text-sm leading-relaxed min-h-[120px] resize-y"
              placeholder="Define behavior..."
              value={aiPersonality}
              onChange={(e) => setAiPersonality(e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Business Knowledge Base */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground uppercase italic tracking-tight">Intelligence Base</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Static Knowledge Uplink</p>
              </div>
            </div>

            <textarea
              className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono text-sm leading-relaxed min-h-[180px] resize-y"
              placeholder="FAQs, Services, Pricing..."
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Extraction Schema */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground uppercase italic tracking-tight">Extraction Protocol</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Data Schema Definition</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              {Array.isArray(extractionFields) && extractionFields.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-background/40 rounded-xl border border-border group/field">
                  <ClipboardList className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-xs font-bold text-foreground flex-1 italic truncate">{f.field}</span>
                  <button onClick={() => removeField(i)} className="p-1 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addField()}
                placeholder="New schema field..."
                className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-xl text-foreground text-xs font-bold focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"
              />
              <button onClick={addField} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 transition-all">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-card/40 backdrop-blur-md border border-border rounded-2xl p-4 sticky bottom-6 z-20 shadow-2xl">
          <div className="flex items-center gap-4">
            {status === "success" && (
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Protocol Updated
              </span>
            )}
            {status === "error" && (
              <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="w-3.5 h-3.5" />
                Sync Failure
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:scale-105 active:scale-95 text-white font-black py-2.5 px-6 rounded-xl text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {loading ? "Syncing..." : "Sync Protocol"}
          </button>
        </div>
      </div>
    </div>
  );
}
