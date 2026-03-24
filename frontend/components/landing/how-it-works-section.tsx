import { PhoneCall, Cpu, ShoppingCart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Connect Phone Number",
      description: "Link your Business Phone number via Twilio or Vapi.",
      icon: PhoneCall,
    },
    {
      title: "Train the AI",
      description: "Upload your product catalog and FAQs. Our AI learns instantly.",
      icon: Cpu,
    },
    {
      title: "Automate Calls",
      description: "Watch the AI talk to callers and close orders for you.",
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="py-24 bg-[#050505] text-white relative border-t border-white/5 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-maroon-600/10 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get set up in minutes. No coding required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-maroon-500/50 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-maroon-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,131,113,0.2)] relative transition-transform hover:scale-110">
                <div className="absolute inset-2 bg-maroon-500/10 rounded-full animate-ping opacity-50" />
                <step.icon className="h-8 w-8 text-maroon-400 relative z-10" />
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
