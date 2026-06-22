export function Install() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden p-12 text-center">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-4">
            Get Started
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop starting from zero.
          </h2>
          <p className="text-white/40 mb-10 max-w-lg mx-auto">
            Install SuperSpecs once. Every AI session that follows starts informed,
            not blind. Knowledge compounds. Problems stay solved.
          </p>

          <div className="bg-black/40 rounded-xl border border-white/[0.08] p-5 mb-8 text-left font-mono text-sm space-y-3">
            <div className="flex gap-3">
              <span className="text-emerald-400 select-none">$</span>
              <span className="text-white/80">npm install -g superspecs</span>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400 select-none">$</span>
              <span className="text-white/80">cd your-project && superspecs install</span>
            </div>
            <div className="text-white/30 pl-6 text-xs">
              ✓ Skills linked to all your AI agents
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/fokkerone/superspecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              View on GitHub
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
            >
              Read the docs →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
