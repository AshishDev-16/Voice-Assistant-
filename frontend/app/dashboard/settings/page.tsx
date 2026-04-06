"use client";

import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, Loader2, Trash2, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const INDUSTRY_OPTIONS = ["Healthcare", "Real Estate", "Legal", "Retail", "Hospitality", "Education", "Finance", "SaaS / Tech", "E-commerce", "Fitness", "Other"];

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [otherBusinessType, setOtherBusinessType] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [twilioNumber, setTwilioNumber] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("English");
  const [agentGoal, setAgentGoal] = useState("lead_generation");
  const [agentTone, setAgentTone] = useState("professional");
  
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/profile?clerkId=${user.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const d = await res.json();
        setBusinessName(d.businessName || "");
        
        // Handle unified businessType mapping
        const rawType = d.businessType || "";
        if (INDUSTRY_OPTIONS.filter(o => o !== "Other").includes(rawType)) {
          setBusinessType(rawType);
          setOtherBusinessType("");
        } else if (rawType) {
          setBusinessType("Other");
          setOtherBusinessType(rawType);
        } else {
          setBusinessType("");
          setOtherBusinessType("");
        }

        setBusinessHours(d.businessHours || "");
        setTwilioNumber(d.twilioPhoneNumber || "");
        setPrimaryLanguage(d.primaryLanguage || "English");
        setAgentGoal(d.agentGoal || "lead_generation");
        setAgentTone(d.agentTone || "professional");
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [user, getToken]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setFeedback({ type: null, message: "" });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          clerkId: user.id, 
          businessName,
          businessType: businessType === "Other" ? otherBusinessType : businessType, 
          businessHours,
          primaryLanguage,
          agentGoal,
          agentTone
        }),
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: "Profile updated successfully." });
        setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
      } else {
        setFeedback({ type: 'error', message: "Failed to update profile." });
      }
    } catch (err) { 
      console.error(err);
      setFeedback({ type: 'error', message: "A network error occurred." });
    }
    finally { setSaving(false); }
  };

  const handleDeleteOrganization = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user?clerkId=${user.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        await signOut();
        router.push("/");
      } else {
        setFeedback({ type: 'error', message: "Failed to delete account. Please contact support." });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: "An error occurred during account deletion." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 p-4 md:p-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary/30 decoration-8 underline-offset-[12px] mb-6">
            Agent Configuration
          </h1>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-relaxed max-w-2xl">
            Fine-tune your satellite agent's operational logic, knowledge hierarchy, and data extraction protocols.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-inner mb-2">
           System Status: Online
        </div>
      </div>

      {feedback.type && (
        <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'} className="border-border glass-card shadow-xl animate-in zoom-in-95 duration-300">
          {feedback.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5" />}
          <AlertTitle className="font-black uppercase tracking-widest text-xs italic">{feedback.type === 'success' ? 'Success' : 'Attention'}</AlertTitle>
          <AlertDescription className="text-xs font-bold italic">{feedback.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {/* Voice Integration */}
        <div className="glass-card p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group border-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-lg font-black text-foreground mb-8 uppercase tracking-widest italic flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-xl border border-primary/20"><Phone className="w-4 h-4 text-primary" /></span>
            Satellite Uplink
          </h3>
          <div className="space-y-6">
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Assigned Business Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={twilioNumber || "SYSTEM_OFFLINE"}
                  readOnly
                  className="h-14 w-full rounded-2xl border-2 border-border bg-card/50 px-6 py-4 text-sm font-black text-muted-foreground/60 cursor-not-allowed shadow-inner tracking-widest"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest italic">Hardware ID for global satellite relay.</p>
            </div>
          </div>
        </div>

        {/* Business Identity */}
        <div className="glass-card p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group border-border">
          <h3 className="text-lg font-black text-foreground mb-8 uppercase tracking-widest italic flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-xl border border-primary/20"><Save className="w-4 h-4 text-primary" /></span>
            Enterprise Identity
          </h3>
          <div className="space-y-8">
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Business Name</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value.toUpperCase())}
                placeholder="e.g. STERLING DENTAL"
                className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-sm font-black text-foreground focus:border-primary focus:outline-none transition-all shadow-inner placeholder:text-muted-foreground/20 italic"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="grid gap-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Industry Cluster</label>
                  <select 
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-sm font-black text-foreground focus:border-primary focus:outline-none transition-all cursor-pointer shadow-inner uppercase tracking-widest"
                  >
                    <option value="" className="bg-card">SELECT...</option>
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-card">{opt.toUpperCase()}</option>
                    ))}
                  </select>
               </div>
               <div className="grid gap-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Operating Window</label>
                  <input 
                    type="text" 
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value.toUpperCase())}
                    placeholder="MON-FRI 9-5"
                    className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-sm font-black text-foreground focus:border-primary focus:outline-none transition-all shadow-inner placeholder:text-muted-foreground/20 italic"
                  />
               </div>
            </div>
            {businessType === "Other" && (
              <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Specify Sector</label>
                <input 
                  type="text" 
                  value={otherBusinessType}
                  onChange={(e) => setOtherBusinessType(e.target.value.toUpperCase())}
                  placeholder="e.g. SPACE TOURISM"
                  className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-sm font-black text-foreground focus:border-primary focus:outline-none transition-all shadow-inner placeholder:text-muted-foreground/20 italic"
                />
              </div>
            )}
          </div>
        </div>

        {/* AI Agent Configuration */}
        <div className="glass-card p-8 md:p-10 rounded-[48px] shadow-2xl relative overflow-hidden group border-border">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full translate-y-1/2 translate-x-1/2" />
          <h3 className="text-lg font-black text-foreground mb-8 uppercase tracking-widest italic flex items-center gap-3">
             <span className="p-2 bg-primary/10 rounded-xl border border-primary/20"><Loader2 className="w-4 h-4 text-primary" /></span>
             AI Personality
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Primary Dialect</label>
              <select 
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-xs font-black text-foreground focus:border-primary transition-all cursor-pointer shadow-inner uppercase tracking-widest"
              >
                {["English", "Spanish", "Hindi", "French", "German"].map(lang => <option key={lang} value={lang} className="bg-card">{lang.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mission Goal</label>
              <select 
                value={agentGoal}
                onChange={(e) => setAgentGoal(e.target.value)}
                className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-xs font-black text-foreground focus:border-primary transition-all cursor-pointer shadow-inner uppercase tracking-widest"
              >
                <option value="lead_generation" className="bg-card">LEAD GEN</option>
                <option value="appointment" className="bg-card">SCHEDULING</option>
                <option value="support" className="bg-card">SUPPORT</option>
                <option value="sales" className="bg-card">SALES</option>
              </select>
            </div>
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Voice Tone</label>
              <select 
                value={agentTone}
                onChange={(e) => setAgentTone(e.target.value)}
                className="h-16 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-xs font-black text-foreground focus:border-primary transition-all cursor-pointer shadow-inner uppercase tracking-widest"
              >
                <option value="professional" className="bg-card">PROFESSIONAL</option>
                <option value="casual" className="bg-card">FRIENDLY</option>
                <option value="urgent" className="bg-card">URGENT</option>
                <option value="empathetic" className="bg-card">EMPATHETIC</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto h-16 px-12 mt-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[.3em] text-[10px] shadow-2xl shadow-primary/20 transition-all rounded-2xl"
          >
            {saving ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Save className="mr-3 h-4 w-4" />}
            Sync All Protocols
          </Button>
        </div>

        {/* Automations (Pro Layout) */}
        <div className="glass-card p-10 rounded-[48px] border-2 border-border overflow-hidden group shadow-2xl relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-4 italic tracking-tighter uppercase">
             Automations Hub
             <span className="text-[9px] px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase font-black tracking-widest italic shadow-sm">Tactical Pro</span>
          </h3>
          <p className="text-[10px] font-black text-muted-foreground mb-10 uppercase tracking-[0.4em] italic opacity-60">Synchronize AI outputs across your business stack.</p>
          
          <div className="grid gap-6 md:grid-cols-2">
             <div className="p-8 rounded-3xl bg-background border-2 border-border flex flex-col justify-between group/card hover:border-primary/20 transition-colors shadow-inner">
                <div>
                  <h4 className="text-sm font-black text-foreground mb-2 uppercase italic tracking-widest">AI Summary Relay</h4>
                  <p className="text-[10px] text-muted-foreground font-bold italic leading-relaxed">Instant SMS briefing delivery to your mobile handset post-interaction.</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[8px] font-black text-muted-foreground/40 tracking-[0.3em] uppercase italic">Link Offline</span>
                  <div className="w-12 h-6 bg-muted rounded-full relative p-1 cursor-not-allowed border border-border">
                     <div className="h-full aspect-square bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
             </div>

             <div className="p-8 rounded-3xl bg-background border-2 border-border flex flex-col justify-between group/card hover:border-primary/20 transition-colors shadow-inner">
                <div>
                  <h4 className="text-sm font-black text-foreground mb-2 uppercase italic tracking-widest">Calendar Matrix Sync</h4>
                  <p className="text-[10px] text-muted-foreground font-bold italic leading-relaxed">Automate appointment insertion into global scheduling systems.</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[8px] font-black text-muted-foreground/40 tracking-[0.3em] uppercase italic">Unlinked</span>
                  <button disabled className="px-5 py-2 rounded-xl bg-muted border border-border text-[8px] font-black text-muted-foreground/50 cursor-not-allowed uppercase tracking-widest shadow-sm transition-all italic">Connect Google</button>
                </div>
             </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-10 rounded-[48px] border-2 border-rose-500/20 bg-rose-500/[0.02] shadow-2xl relative overflow-hidden transition-all duration-500 hover:bg-rose-500/[0.05]">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />
          
          <h3 className="text-xl font-black text-rose-500 mb-4 flex items-center gap-4 italic tracking-tighter uppercase">
             <span className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-inner"><Trash2 className="h-5 w-5" /></span>
             Purge Protocol
          </h3>
          <p className="text-xs text-muted-foreground mb-10 max-w-xl font-bold italic leading-relaxed">
            Executing a <span className="text-rose-500 font-black italic underline decoration-rose-500/30 underline-offset-4">Factory Reset</span> will permanently purge all business data and 
            <span className="text-rose-500 font-black italic ml-1">terminate your agent credentials</span>. System status: IRREVERSIBLE.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={deleting}
                className="h-16 px-10 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[0.4em] text-[10px] transition-all group shadow-xl shadow-rose-500/20 rounded-2xl border-none"
              >
                {deleting ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Trash2 className="mr-3 h-4 w-4 group-hover:animate-bounce" />}
                Purge All Satellite Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background border-destructivr/50 backdrop-blur-3xl shadow-2xl rounded-[40px] p-10 max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl font-black text-foreground tracking-tighter uppercase italic mb-4">Confirm Reset?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-bold italic leading-relaxed text-sm">
                  This action cannot be undone. We will terminate your organization node and purge the <span className="text-rose-500 font-black underline underline-offset-4 decoration-rose-500/30">entire data stream</span>. 
                  AI connection will be permanently severed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-10 gap-4">
                <AlertDialogCancel className="h-14 rounded-2xl bg-muted border-none text-foreground font-black uppercase tracking-widest text-[9px] hover:bg-muted/80">Abort Protocol</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteOrganization}
                  className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white border-none font-black uppercase tracking-widest text-[9px] shadow-xl shadow-rose-600/20"
                >
                  Confirm Purge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
