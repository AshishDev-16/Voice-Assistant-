"use client";

import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, Loader2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your business profile and voice agent preferences.</p>
        </div>
      </div>

      {feedback.type && (
        <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'} className="border-white/5">
          {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{feedback.type === 'success' ? 'Success' : 'Attention'}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Voice Integration */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">Voice Integration</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Twilio Phone Number</label>
              <input 
                type="text" 
                value={twilioNumber || "Not assigned yet"}
                readOnly
                className="h-10 w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-zinc-400 cursor-not-allowed shadow-inner"
              />
              <p className="text-xs text-zinc-600">Your Twilio number is assigned during setup. Contact support to change it.</p>
            </div>
          </div>
        </div>

        {/* Business Identity */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">Business Identity</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Business Name</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="h-10 w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Business Type</label>
              <select 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all font-medium"
              >
                <option value="">Select...</option>
                {INDUSTRY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {businessType === "Other" && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-zinc-300">Please Specify</label>
                <input 
                  type="text" 
                  value={otherBusinessType}
                  onChange={(e) => setOtherBusinessType(e.target.value)}
                  placeholder="e.g. Legal Services, Consulting"
                  className="h-10 w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all shadow-inner"
                />
              </div>
            )}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Business Hours</label>
              <input 
                type="text" 
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Mon-Fri 9AM-5PM"
                className="h-10 w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* AI Agent Configuration */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">AI Agent Configuration</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Primary Language</label>
              <select 
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 transition-all"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Hindi">Hindi</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Agent Goal</label>
              <select 
                value={agentGoal}
                onChange={(e) => setAgentGoal(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 transition-all"
              >
                <option value="lead_generation">Lead Generation</option>
                <option value="appointment">Book Appointments</option>
                <option value="support">Customer Support</option>
                <option value="sales">Outbound Sales</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Agent Tone</label>
              <select 
                value={agentTone}
                onChange={(e) => setAgentTone(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 transition-all"
              >
                <option value="professional">Professional</option>
                <option value="casual">Friendly & Casual</option>
                <option value="urgent">Urgent & Direct</option>
                <option value="empathetic">Empathetic</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-maroon-700 hover:bg-maroon-600 text-white shadow-[0_0_15px_rgba(128,0,0,0.3)] border-none font-bold"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save All Changes
          </Button>
        </div>

        {/* Integrations & Automations */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
             <Save className="h-24 w-24 scale-150 rotate-12" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 tracking-tight">
             Automations & Integrations
             <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-500/20 text-maroon-400 border border-maroon-500/40 uppercase font-black">Pro</span>
          </h3>
          <p className="text-xs text-zinc-500 mb-6">Actionable results delivered where you work.</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
             {/* SMS Summary */}
             <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between">
               <div>
                  <h4 className="text-sm font-bold text-white mb-1">SMS Post-Call Summary</h4>
                  <p className="text-[11px] text-zinc-500">Get an instant text summary after every lead interaction.</p>
               </div>
               <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Disabled</span>
                  <div className="w-10 h-5 bg-white/5 rounded-full border border-white/10 relative p-1 cursor-not-allowed">
                     <div className="h-full aspect-square bg-zinc-700 rounded-full" />
                  </div>
               </div>
            </div>

            {/* Calendar Sync */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between">
               <div>
                  <h4 className="text-sm font-bold text-white mb-1">Calendar Sync</h4>
                  <p className="text-[11px] text-zinc-500">Auto-sync extracted appointment dates to your calendar.</p>
               </div>
               <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Not Connected</span>
                  <button disabled className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 cursor-not-allowed capitalize">Connect Google</button>
               </div>
            </div>

             {/* Custom Domain */}
             <div className="p-4 rounded-xl bg-black/30 border border-white/5 col-span-full">
               <h4 className="text-sm font-bold text-white mb-1">Custom Dashboad Subdomain</h4>
               <p className="text-[11px] text-zinc-500 mb-3">Professional whitelabeling for your business dashboard.</p>
               <div className="flex gap-2 opacity-50 cursor-not-allowed">
                  <div className="flex-1 flex items-center px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-zinc-400 font-medium">
                     <span className="text-zinc-600">agentflow.ai/</span>
                     <span className="text-white">my-business</span>
                  </div>
                  <button disabled className="px-4 py-2 bg-maroon-800/20 border border-maroon-500/10 text-maroon-400/50 text-xs font-bold rounded-lg uppercase tracking-widest">Verify</button>
               </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 backdrop-blur-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full" />
          
          <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2 tracking-tight">
             <span className="p-1.5 bg-red-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></span>
             Danger Zone
          </h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-lg leading-relaxed">
            Performing a <span className="text-red-400 font-bold">Hard Reset</span> will permanently purge your business data and 
            <span className="text-red-400 font-bold underline decoration-red-500/30 underline-offset-4 ml-1">delete your Clerk account</span>. 
            You will be signed out and must sign up again to re-test the payment flow.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={deleting}
                className="h-12 px-8 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 font-black uppercase tracking-widest text-[10px] transition-all group"
              >
                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4 group-hover:animate-bounce" />}
                Purge All Data & Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border-red-900/50 backdrop-blur-3xl shadow-[0_0_100px_rgba(220,38,38,0.1)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-white tracking-tight uppercase italic">Confirm Hard Reset?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400 font-medium leading-relaxed">
                  This action is irreversible. We will delete your organization data from our servers and <span className="text-red-500 font-bold">permanently delete your Clerk user record</span>. 
                  You will be forcefully signed out and redirected to the landing page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Keep Project</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteOrganization}
                  className="bg-red-600 hover:bg-red-700 text-white border-none font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  Yes, Purge My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
