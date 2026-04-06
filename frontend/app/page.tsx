import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30 font-sans transition-colors duration-500">
      <Navbar />
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
