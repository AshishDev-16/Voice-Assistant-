import { MessageSquare, Cpu, ShoppingCart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Connect WhatsApp",
      description: "Link your Business WhatsApp number via the official API.",
      icon: MessageSquare,
    },
    {
      title: "Train the AI",
      description: "Upload your product catalog and FAQs. Our AI learns instantly.",
      icon: Cpu,
    },
    {
      title: "Automate Sales",
      description: "Watch the AI talk to customers and close orders for you.",
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get set up in minutes. No coding required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
                <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-ping opacity-50" />
                <step.icon className="h-8 w-8 text-emerald-400 relative z-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
