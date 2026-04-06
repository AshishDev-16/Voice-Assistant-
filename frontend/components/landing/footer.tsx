import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border text-muted-foreground py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 text-foreground mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                <Mic className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">Aion.AI</span>
            </Link>
            <p className="text-sm leading-relaxed font-bold italic max-w-xs">
              The world's most advanced autonomous AI voice engine built for mission-critical business operations.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-black text-xs uppercase tracking-[0.3em] mb-8">Network</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest italic">
              <li><Link href="#features" className="hover:text-primary transition-colors">Architecture</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Allocation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Uplink Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-black text-xs uppercase tracking-[0.3em] mb-8">Resources</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest italic">
              <li><Link href="#" className="hover:text-primary transition-colors">API Core</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">AI Logic</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-black text-xs uppercase tracking-[0.3em] mb-8">Command</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest italic">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em]">
          <div className="flex items-center space-x-2">
            <p>© {new Date().getFullYear()} AION AI SYSTEMS. ALL RIGHTS RESERVED.</p>
            <span className="text-border">|</span>
            <p className="text-primary">DEVELOPED BY ASHISH</p>
          </div>
          <div className="flex space-x-10 mt-8 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">AI Network</Link>
            <Link 
              href="https://github.com/AshishDev-16/Voice-Assistant-" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Public-Repo
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">Terminal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
