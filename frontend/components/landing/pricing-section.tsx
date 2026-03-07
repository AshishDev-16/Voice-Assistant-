import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden text-white">
      {/* Ambient background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pricing that scales with you</h2>
          <p className="text-lg text-slate-400">Start for free, upgrade when you need to.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col relative z-10 transition-transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">₹0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 500 messages', 'Basic AI responses', '1 Phone number'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-emerald-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/5">Get Started</Button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-500/40 flex flex-col relative scale-110 z-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              Most Popular
            </div>
            <h3 className="text-xl font-medium mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">₹49<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited messages', 'Advanced NLP training', 'Product Catalog sync', 'Analytics Dashboard'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-emerald-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">Start Free Trial</Button>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col relative z-10 transition-transform hover:scale-105">
            <h3 className="text-xl font-medium mb-2">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Custom integrations', 'Dedicated support', 'Multiple numbers', 'White-labeling'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <Check className="h-5 w-5 text-emerald-400 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/5">Contact Sales</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
