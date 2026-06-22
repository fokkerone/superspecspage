import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm tracking-tight text-white">
            SUPER<span className="text-emerald-400">SPECS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="https://github.com/fokkerone/superspecs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </Link>
        </nav>

        <Link
          href="https://github.com/fokkerone/superspecs"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-full transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
