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
                className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-maroon-500/50 focus:outline-none focus:ring-1 focus:ring-maroon-500/50 transition-all"
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
              className="mt-2 bg-maroon-700 hover:bg-maroon-600 text-white shadow-[0_0_15px_rgba(128,0,0,0.3)]"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
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
