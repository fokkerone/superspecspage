export function Problem() {
  return (
    <section className="py-24 md:py-40 px-5 md:px-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
            The Problem
          </p>
          <h2
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            className="font-light text-white mb-6"
          >
            Every AI session starts from zero.
          </h2>
          <p className="text-white/60 text-[1.0625rem] leading-[1.65]">
            The agent hallucinates architecture it didn&apos;t build. Re-solves problems
            solved three sessions ago. Contradicts decisions made last week. The context
            window resets. The knowledge vanishes.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-white/10 rounded-none">
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
            <div key={item.symptom} className="bg-signalgray-800 p-8">
              <span className="font-mono text-white/30 text-lg mb-4 block">✗</span>
              <h3 className="font-medium text-white mb-2">{item.symptom}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
