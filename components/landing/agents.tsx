export function Agents() {
  const agents = [
    "Claude Code",
    "Cursor",
    "OpenCode",
    "GitHub Copilot",
    "Codex",
    "Gemini CLI",
    "Aider",
    "Windsurf",
  ];

  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-8">
          Works with every AI coding agent
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {agents.map((agent) => (
            <span
              key={agent}
              className="text-sm text-white/40 border border-white/[0.08] rounded-full px-4 py-2 hover:border-white/20 hover:text-white/60 transition-colors"
            >
              {agent}
            </span>
          ))}
        </div>
        <p className="mt-8 text-white/20 text-sm">
          One install. Skills symlinked automatically.
        </p>
      </div>
    </section>
  );
}
