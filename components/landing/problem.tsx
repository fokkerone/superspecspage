export function Problem() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-4">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            Every AI session starts from zero.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            The agent hallucinates architecture it didn&apos;t build. Re-solves problems
            solved three sessions ago. Contradicts decisions made last week. The context
            window resets. The knowledge vanishes.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
          {[
            {
              symptom: "Hallucinated architecture",
              description:
                "The agent confidently describes code it never wrote, decisions it never made.",
            },
            {
              symptom: "Repeated problem-solving",
              description:
                "The same bug gets debugged. The same trade-off gets evaluated. Again and again.",
            },
            {
              symptom: "Contradictory decisions",
              description:
                "Tuesday's decision conflicts with Friday's. Nobody notices until production.",
            },
          ].map((item) => (
            <div
              key={item.symptom}
              className="bg-[#080808] p-8"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <span className="text-red-400 text-xs">✗</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{item.symptom}</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
