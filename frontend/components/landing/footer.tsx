import Link from "next/link";
import { PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4">
              <PhoneCall className="h-6 w-6 text-maroon-500" />
              <span className="font-bold text-lg tracking-tight">AgentFlow</span>
            </Link>
            <p className="text-sm">
              The AI-powered Voice Call Assistant that sells for you while you sleep.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Customers</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-maroon-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} AgentFlow Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
