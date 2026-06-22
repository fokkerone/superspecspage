export function HowItWorks() {
  const phases = [
    {
      number: "00",
      label: "Setup",
      command: "/superspecs:techstack",
      description:
        "Define the stack once. Get skill recommendations, library choices, and a production checklist. Every session that follows is grounded in this profile.",
    },
    {
      number: "01",
      label: "Plan",
      command: "/superspecs:discuss → :spec → :grill",
      description:
        "Intent before implementation. Requirements expressed as testable SHALL statements with GIVEN/WHEN/THEN scenarios. The spec fits a fresh 200k context window. A grilling session blocks execution until the spec is READY.",
    },
    {
      number: "02",
      label: "Execute",
      command: "/superspecs:subagent",
      description:
        "One branch per spec. One subagent per task. Each gets a clean context — the spec and nothing else. RED before GREEN, always. Critical review findings block all progress.",
    },
    {
      number: "03",
      label: "Verify",
      command: "/superspecs:check-tests → :wiki",
      description:
        "Full suite. Every spec scenario has a passing test. Then distill everything learned into the wiki — so the next session inherits the knowledge.",
    },
    {
      number: "04",
      label: "Ship",
      command: "/superspecs:ship",
      description:
        "PR. Changelog. Archive the phase. Mark the spec complete. Start the next cycle. The wiki grows. The codebase remembers.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-4">
          How It Works
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Five phases. One discipline.
        </h2>

        <div className="space-y-px bg-white/[0.04] rounded-xl overflow-hidden">
          {phases.map((phase, i) => (
            <div
              key={phase.number}
              className="bg-[#080808] p-8 grid md:grid-cols-[120px_1fr] gap-8 items-start group hover:bg-white/[0.015] transition-colors"
            >
              <div>
                <span className="font-mono text-4xl font-bold text-white/[0.08] group-hover:text-emerald-400/20 transition-colors">
                  {phase.number}
                </span>
                <div className="mt-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  {phase.label}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-white/30 mb-3 bg-white/[0.04] inline-block px-3 py-1 rounded">
                  {phase.command}
                </div>
                <p className="text-white/50 leading-relaxed">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
