"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

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

  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ([0, 0] as number[]) : ([40, -40] as number[]),
  );

  return (
    <motion.section
      ref={sectionRef}
      id="features"
      style={{ y: sectionY, willChange: "transform" }}
      className="bg-signalgray-100 py-24 md:py-40 px-5 md:px-10"
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-signalgray-800/50 mb-4">
          Features
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
          className="font-light text-signalgray-800 mb-16"
        >
          Everything a discipline layer needs.
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-signalgray-800/10 rounded-none">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_ENTER_TUPLE }}
              className="bg-signalgray-200 p-10 hover:bg-signalgray-300/20 transition-colors duration-200"
            >
              <div className="text-2xl text-signalgray-800/50 mb-4 font-mono">{feature.icon}</div>
              <h3 className="font-medium text-signalgray-800 mb-3">{feature.title}</h3>
              <p className="text-signalgray-800/70 text-[1.0625rem] leading-[1.65]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
