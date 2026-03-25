"use client";

import { Check, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function PricingSection() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleCheckout = async (planId: string) => {
    if (!isSignedIn || !userId) {
      openSignIn();
      return;
    }

    try {
      setLoading(planId);
      const res = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, clerkUserId: userId }),
      });

      if (!res.ok) throw new Error("Could not create Razorpay order");
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aion AI",
        description: "AION ACCESS TOKEN",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              clerkUserId: userId,
            }),
          });
          if (verifyRes.ok) {
            window.location.href = planId === "starter" ? "/starter-home" : "/dashboard";
          } else {
            alert("Verification failed.");
          }
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "",
        },
        theme: { color: "#10b981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-32 bg-black relative">
       <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gold-400 font-display font-black uppercase tracking-[.4em] text-[10px] mb-4"
          >
            Tier Allocation
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter mb-6">
            SECURE YOUR <br/><span className="text-gold-400 italic">OPEREATING SLOTS</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col group hover:border-white/20 transition-all"
          >
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Basic Entry</div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">Starter</h3>
            <div className="text-4xl font-display font-black text-white mt-4 mb-8 tracking-tighter">
              ₹999<span className="text-sm text-slate-500 font-medium">/cycle</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['100 Secure Voice Calls', '500 Neural Responses', '1 Phone Node', 'Standard Priority'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-400 font-medium">
                  <Check className="h-4 w-4 text-emerald-500 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleCheckout("starter")}
              disabled={loading === "starter" || user?.publicMetadata?.plan === "starter" || user?.publicMetadata?.plan === "pro"}
              className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs"
            >
              {loading === "starter" ? <Loader2 className="animate-spin" /> : "Initialize"}
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="p-10 rounded-[40px] border-2 border-emerald-500/30 bg-emerald-500/[0.02] backdrop-blur-3xl flex flex-col relative scale-105 z-20 shadow-[0_0_60px_rgba(16,185,129,0.1)]"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              Elite Tier
            </div>
            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">High Volume</div>
            <h3 className="text-2xl font-display font-bold text-white mb-1 italic underline decoration-emerald-500/50">Tactical</h3>
            <div className="text-4xl font-display font-black text-white mt-4 mb-8 tracking-tighter">
              ₹2,999<span className="text-sm text-slate-500 font-medium">/cycle</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['1,000 Secure Voice Calls', '5,000 Neural Responses', '3 Phone Nodes', 'Full Analytics HUD', 'Priority Sync'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-100 font-bold">
                  <Check className="h-4 w-4 text-emerald-500 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
               onClick={() => handleCheckout("pro")}
               disabled={loading === "pro" || user?.publicMetadata?.plan === "pro"}
               className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[.2em] text-xs shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              {loading === "pro" ? <Loader2 className="animate-spin" /> : "Deploy Now"}
            </Button>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col group hover:border-white/20 transition-all text-left"
          >
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Mass Scale</div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">Ultimate</h3>
            <div className="text-4xl font-display font-black text-white mt-4 mb-8 tracking-tighter italic">
              Custom
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['Unlimited Voice Slots', 'Dedicated Neural Node', 'Global Node Presence', 'Direct Engineer Access'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-400 font-medium">
                  <Check className="h-4 w-4 text-emerald-500 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
               variant="outline" 
               className="w-full h-14 rounded-2xl border border-white/10 bg-transparent text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs"
               onClick={() => window.location.href="mailto:ops@aion.ai"}
            >
              Contact Command
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-20 flex justify-center">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] border border-white/5 py-2 px-6 rounded-full">
                <Shield className="w-3 h-3" />
                <span>All communication encrypted via AES-256</span>
            </div>
        </div>
      </div>
    </section>
  );
}
