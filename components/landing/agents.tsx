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
    <section className="py-24 md:py-40 px-5 md:px-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/40 mb-8">
          Works with every AI coding agent
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {agents.map((agent) => (
            <span
              key={agent}
              className="text-sm text-white/50 border border-white/10 rounded-sm px-4 py-2 hover:border-white/20 hover:text-white/70 transition-colors duration-200"
            >
              {agent}
            </span>
          ))}
        </div>
        <p className="mt-8 text-white/30 text-sm font-mono">
          One install. Skills symlinked automatically.
        </p>
      </div>
    </section>
  );
}
