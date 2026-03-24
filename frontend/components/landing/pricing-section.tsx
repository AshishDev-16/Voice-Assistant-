"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";

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
      openSignIn(); // Open Clerk modal, no broken /sign-up route
      return;
    }

    try {
      setLoading(planId);

      // Call Express backend (port 5000) — NOT Next.js API routes
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
        name: "AgentFlow SaaS",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
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
            // Reload the page to refresh Clerk session with new publicMetadata
            window.location.href = planId === "starter" ? "/starter-home" : "/dashboard";
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "",
        },
        theme: { color: "#800000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => alert(resp.error.description));
      rzp.open();

    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Failed to initialize payment gateway.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maroon-800/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pricing that scales with you</h2>
          <p className="text-lg text-slate-400">Choose the perfect plan to automate your customer engagement.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          {/* Starter Tier */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col relative z-10 transition-transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">₹999<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['100 Voice Calls/mo', '500 AI Responses/mo', '1 Phone Number', '5 Extraction Fields', 'Standard Support'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-maroon-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => handleCheckout("starter")}
              disabled={loading === "starter" || user?.publicMetadata?.plan === "starter" || user?.publicMetadata?.plan === "pro"}
              variant="outline" 
              className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-maroon-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "starter" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : user?.publicMetadata?.plan === "starter" ? "Current Plan" : "Get Started"}
            </Button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-maroon-800/10 to-transparent backdrop-blur-2xl shadow-[0_0_50px_rgba(128,0,0,0.2)] border border-maroon-500/40 flex flex-col relative scale-110 z-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-maroon-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              Most Popular
            </div>
            <h3 className="text-xl font-medium mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">₹2999<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['1,000 Voice Calls/mo', '5,000 AI Responses/mo', '3 Phone Numbers', '20 Extraction Fields', 'Full Analytics Dashboard', 'Priority Support'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-maroon-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => handleCheckout("pro")}
              disabled={loading === "pro" || user?.publicMetadata?.plan === "pro"}
              className="w-full rounded-full bg-maroon-700 hover:bg-maroon-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "pro" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : user?.publicMetadata?.plan === "pro" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col relative z-10 transition-transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited Voice Calls', 'Unlimited AI Responses', 'Unlimited Phone Numbers', 'Unlimited Extraction Fields', 'Dedicated Support', 'Custom AI Fine-tuning'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-maroon-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-maroon-900/40" onClick={() => window.location.href="mailto:sales@agentflow.com"}>Contact Sales</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
