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
    <section id="how-it-works" className="py-24 md:py-40 px-5 md:px-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
          How It Works
        </p>
        <h2
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="font-light text-white mb-16"
        >
          Five phases. One discipline.
        </h2>

        <div className="space-y-px bg-white/10 rounded-none">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className="bg-signalgray-800 p-8 grid md:grid-cols-[120px_1fr] gap-8 items-start hover:bg-signalgray-900 transition-colors duration-200"
            >
              <div>
                <span
                  className="font-mono font-light text-white/[0.05] leading-none block"
                  style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}
                >
                  {phase.number}
                </span>
                <div className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-white/50 mt-1">
                  {phase.label}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-white/30 mb-3 bg-white/[0.04] inline-block px-3 py-1 rounded-sm">
                  {phase.command}
                </div>
                <p className="text-white/60 leading-relaxed text-[1.0625rem]">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
