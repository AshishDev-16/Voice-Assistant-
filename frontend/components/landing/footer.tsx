import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 text-slate-500 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-white mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                <Mic className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="font-display font-black text-xl tracking-tighter uppercase">Aion</span>
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              The world's most advanced autonomous voice engine built for mission-critical business operations.
            </p>
          </div>
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest mb-6">Network</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tighter">
              <li><Link href="#features" className="hover:text-emerald-500 transition-colors">Architecture</Link></li>
              <li><Link href="#pricing" className="hover:text-emerald-500 transition-colors">Allocation</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Uplink Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest mb-6">Documentation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tighter">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">API Core</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Neural Logic</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest mb-6">Command</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tighter">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center space-x-1">
            <p>© {new Date().getFullYear()} AION AI SYSTEMS. ALL RIGHTS RESERVED.</p>
            <span className="text-white/20">|</span>
            <p className="text-emerald-500">DEVELOPED BY ASHISH</p>
          </div>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="#" className="hover:text-emerald-500 transition-colors">Neural-Net</Link>
            <Link 
              href="https://github.com/AshishDev-16/Voice-Assistant-" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 transition-colors"
            >
              Public-Repo
            </Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors">Terminal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
