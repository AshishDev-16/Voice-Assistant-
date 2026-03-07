import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 relative selection:bg-emerald-500/30">
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-lg tracking-tight text-white">AgentFlow</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">Features</Link>
            <Link href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <Link href="/dashboard" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/10">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
