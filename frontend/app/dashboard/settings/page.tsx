"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SettingsPage() {
  const { user } = useUser();
  const [businessType, setBusinessType] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [twilioNumber, setTwilioNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/profile?clerkId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        setBusinessType(d.businessType || "");
        setBusinessHours(d.businessHours || "");
        setTwilioNumber(d.twilioPhoneNumber || "");
      })
      .catch(console.error);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id, businessType, businessHours }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your business profile and voice agent preferences.</p>
      </div>

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

        {/* Business Profile */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">Business Profile</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Business Type</label>
              <select 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all font-medium"
              >
                <option value="">Select...</option>
                <option value="dentist">Dentist Clinic</option>
                <option value="grocery">Grocery / Delivery</option>
                <option value="restaurant">Restaurant</option>
                <option value="salon">Salon / Spa</option>
                <option value="real_estate">Real Estate</option>
                <option value="clinic">Medical Clinic</option>
                <option value="auto">Auto Service</option>
                <option value="custom">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Business Hours</label>
              <input 
                type="text" 
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Mon-Fri 9AM-5PM"
                className="h-10 w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:bg-black/30 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all shadow-inner placeholder:text-zinc-600"
              />
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="mt-2 bg-maroon-700 hover:bg-maroon-600 text-white shadow-[0_0_15px_rgba(128,0,0,0.3)] border-none"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saved ? "Saved!" : "Update Profile"}
            </Button>
          </div>
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
                  <div className="w-10 h-5 bg-white/5 rounded-full border border-white/10 relative p-1 cursor-pointer">
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
                  <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition-colors capitalize">Connect Google</button>
               </div>
            </div>

             {/* Custom Domain */}
             <div className="p-4 rounded-xl bg-black/30 border border-white/5 col-span-full">
               <h4 className="text-sm font-bold text-white mb-1">Custom Dashboad Subdomain</h4>
               <p className="text-[11px] text-zinc-500 mb-3">Professional whitelabeling for your business dashboard.</p>
               <div className="flex gap-2">
                  <div className="flex-1 flex items-center px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-zinc-400 font-medium">
                     <span className="text-zinc-600">agentflow.ai/</span>
                     <span className="text-white">my-business</span>
                  </div>
                  <button className="px-4 py-2 bg-maroon-800/40 border border-maroon-500/30 text-maroon-400 text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-maroon-700/40 transition-all">Verify</button>
               </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 backdrop-blur-2xl p-6 shadow-xl">
          <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-zinc-400 mb-4">Once you delete your organization, there is no going back. Please be certain.</p>
          <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400">
            Delete Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
