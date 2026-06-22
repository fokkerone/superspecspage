import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-mono font-bold text-sm tracking-tight text-white">
              SUPER<span className="text-emerald-400">SPECS</span>
            </Link>
            <p className="mt-3 text-white/30 text-sm leading-relaxed max-w-xs">
              Spec-driven planning. Parallel TDD execution. A wiki that never forgets.
            </p>
            <p className="mt-4 text-white/20 text-xs font-mono">MIT License</p>
          </div>

          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-4">
              Product
            </p>
            <ul className="space-y-2 text-sm text-white/40">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-4">
              Community
            </p>
            <ul className="space-y-2 text-sm text-white/40">
              <li>
                <a
                  href="https://github.com/fokkerone/superspecs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/superspecs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-mono">
            © 2026 SuperSpecs. MIT License.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/20 font-mono">
            <span>Works with</span>
            <span className="text-emerald-400/50 mx-1">Claude Code · Cursor · OpenCode · Copilot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
