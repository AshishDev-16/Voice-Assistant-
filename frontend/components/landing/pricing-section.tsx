"use client";

import { Check, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function PricingSection() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();

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
      const token = await getToken();
      
      const res = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ planId, clerkUserId: userId }),
      });

      if (!res.ok) throw new Error("Could not create Razorpay order");
      const order = await res.json();

      // Determine brand color for Razorpay (Sapphire for Light, Indigo for Dark)
      const brandColor = (resolvedTheme || theme) === 'light' ? "#2563eb" : "#6366f1";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aion AI",
        description: "AION ACCESS TOKEN",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyToken = await getToken();
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${verifyToken}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              clerkUserId: userId,
            }),
          });
          if (verifyRes.ok) {
            window.location.href = "/onboarding";
          } else {
            alert("Verification failed.");
          }
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "",
        },
        theme: { color: brandColor },
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
    <section id="pricing" className="py-32 bg-background relative transition-colors duration-700">
       <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[.6em] text-[10px] mb-6"
          >
            Tier Allocation
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-8 leading-[0.9]">
            SECURE YOUR <br/><span className="text-primary italic uppercase">OPERATING SLOTS</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[40px] glass-card flex flex-col group hover:border-primary/40 transition-all shadow-xl shadow-primary/5"
          >
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">AI Entry</div>
            <h3 className="text-2xl font-black text-foreground mb-2 italic tracking-tighter">Starter</h3>
            <div className="text-5xl font-black text-foreground mt-6 mb-10 tracking-tighter">
              ₹999<span className="text-sm text-muted-foreground font-bold italic mr-1">/cycle</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['100 Secure Voice Calls', '500 AI Responses', '1 Phone Number', 'Standard Priority'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-muted-foreground font-bold italic">
                  <Check className="h-4 w-4 text-primary mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleCheckout("starter")}
              disabled={loading === "starter" || user?.publicMetadata?.plan === "starter" || user?.publicMetadata?.plan === "pro"}
              className="w-full h-16 rounded-2xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
            >
              {loading === "starter" ? <Loader2 className="animate-spin" /> : "Initialize"}
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="p-10 rounded-[48px] border-2 border-primary/40 bg-primary/5 backdrop-blur-3xl flex flex-col relative scale-[1.03] z-20 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/30">
              Elite Tier
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-[.2em] mb-3">High Performance</div>
            <h3 className="text-2xl font-black text-foreground mb-2 italic underline decoration-primary/50 underline-offset-4 tracking-tighter">Tactical</h3>
            <div className="text-5xl font-black text-foreground mt-6 mb-10 tracking-tighter">
              ₹2,999<span className="text-sm text-primary font-black italic mr-1">/cycle</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['1,000 Secure Voice Calls', '5,000 AI Responses', '3 Phone Numbers', 'Full Analytics Hub', 'Priority Sync'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-foreground font-black italic">
                  <Check className="h-4 w-4 text-primary mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
               onClick={() => handleCheckout("pro")}
               disabled={loading === "pro" || user?.publicMetadata?.plan === "pro"}
               className="w-full h-16 rounded-2xl bg-primary hover:scale-[1.02] active:scale-[0.98] text-primary-foreground font-black uppercase tracking-[.2em] text-[10px] shadow-xl shadow-primary/30"
            >
              {loading === "pro" ? <Loader2 className="animate-spin" /> : "Deploy Now"}
            </Button>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[40px] glass-card flex flex-col group hover:border-primary/40 transition-all shadow-xl shadow-primary/5"
          >
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Mass Scale</div>
            <h3 className="text-2xl font-black text-foreground mb-2 italic tracking-tighter">Ultimate</h3>
            <div className="text-5xl font-black text-foreground mt-6 mb-10 tracking-tighter italic">
              Custom
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {['Unlimited Voice Slots', 'Dedicated AI Support', 'Global Presence', 'Direct Engineer Access'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-muted-foreground font-bold italic">
                  <Check className="h-4 w-4 text-primary mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <Button 
               variant="outline" 
               className="w-full h-16 rounded-2xl border-2 border-border bg-transparent text-foreground hover:bg-card transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
               onClick={() => window.location.href="mailto:ops@aion.ai"}
            >
              Contact Command
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-24 flex justify-center">
            <div className="flex items-center space-x-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] border border-border py-3 px-8 rounded-full bg-card/20 backdrop-blur-xl shadow-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span>All communication encrypted via AES-256</span>
            </div>
        </div>
      </div>
    </section>
  );
}
