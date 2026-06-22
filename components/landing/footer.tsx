import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 px-5 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-mono font-medium text-sm tracking-tight text-white">
                SUPER<span style={{ opacity: 0.4 }}>SPECS</span>
              </span>
            </Link>
            <p className="mt-3 text-white/40 text-sm leading-relaxed max-w-xs">
              Spec-driven planning. Parallel TDD execution. A wiki that never forgets.
            </p>
            <p className="mt-4 text-white/30 text-xs font-mono">MIT License</p>
          </div>

          <div>
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link
                  href="/docs"
                  className="link-underline hover:text-white/80 transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="link-underline hover:text-white/80 transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="link-underline hover:text-white/80 transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
              Community
            </p>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <a
                  href="https://github.com/fokkerone/superspecs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-white/80 transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/superspecs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-white/80 transition-colors duration-200"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-mono">© 2026 SuperSpecs. MIT License.</p>
          <div className="flex items-center gap-1 text-xs text-white/30 font-mono">
            <span>Works with</span>
            <span className="text-white/40 mx-1">Claude Code · Cursor · OpenCode · Copilot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
