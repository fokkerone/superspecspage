import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs text-white/50 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini CLI
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          AI coding that{" "}
          <span className="text-emerald-400">compounds.</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
          Spec-driven planning. Parallel TDD execution.{" "}
          <span className="text-white/60">A wiki that never forgets.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="https://github.com/fokkerone/superspecs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-full transition-colors text-sm"
          >
            npm install -g superspecs
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
          >
            Read the docs →
          </Link>
        </div>

        {/* Terminal mockup */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-2 text-xs text-white/20 font-mono">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm text-left space-y-2">
              <div className="flex gap-3">
                <span className="text-emerald-400">$</span>
                <span className="text-white/70">npx superspecs install</span>
              </div>
              <div className="text-white/30 pl-6">✓ Skills linked to Claude Code</div>
              <div className="text-white/30 pl-6">✓ Skills linked to Cursor</div>
              <div className="text-white/30 pl-6">✓ Skills linked to OpenCode</div>
              <div className="flex gap-3 mt-4">
                <span className="text-emerald-400">$</span>
                <span className="text-white/70">/superspecs:discuss</span>
              </div>
              <div className="text-white/30 pl-6">
                What are we building? Give me the 30-second version...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
