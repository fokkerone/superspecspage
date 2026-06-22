export function Features() {
  const features = [
    {
      title: "Spec that fits a context window",
      description:
        "Every spec is written to fit a fresh 200k-token window. No executor needs prior chat history. If the plan is too big, it gets decomposed.",
      icon: "◈",
    },
    {
      title: "TDD without exceptions",
      description:
        "Code written before a failing test gets deleted. RED before GREEN. The test suite is the ground truth, not the agent's confidence.",
      icon: "◎",
    },
    {
      title: "Wiki as persistent memory",
      description:
        "After every shipped feature, knowledge is distilled into structured, interlinked pages. Future sessions open the wiki — not raw specs.",
      icon: "◻",
    },
    {
      title: "Parallel subagent execution",
      description:
        "Five agents running in parallel, each with a fresh context, each working from the same spec, each contributing to the same wiki.",
      icon: "⊞",
    },
    {
      title: "Grill before you build",
      description:
        "A relentless interview stress-tests every spec against the wiki and techstack. Nothing proceeds until verdict is READY.",
      icon: "◉",
    },
    {
      title: "Works with every agent",
      description:
        "Claude Code, Cursor, OpenCode, Copilot, Codex, Gemini CLI. One install. Skills symlinked to all your agents automatically.",
      icon: "⊙",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-4">
          Features
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Everything a discipline layer needs.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#080808] p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-2xl text-emerald-400/60 mb-4 font-mono">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
