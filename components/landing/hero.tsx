"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const isInternalNav =
      Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
    if (!isInternalNav) setShouldAnimate(true);
  }, []);

  return (
    <section className="relative pt-40 pb-32 md:pt-48 md:pb-40 px-5 md:px-10 overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
          Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini CLI
        </p>

        {/* Headline */}
        <motion.h1
          initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)", y: "80%" } : false}
          animate={{ clipPath: "inset(0% 0 0 0)", y: "0%" }}
          transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
          style={{
            fontSize: "clamp(3rem, 8vw, 8rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
          className="font-light text-white mb-6"
        >
          AI coding that compounds.
        </motion.h1>

        <p className="text-[1.0625rem] leading-[1.65] text-white/60 max-w-2xl mb-10">
          Spec-driven planning. Parallel TDD execution.{" "}
          <span className="text-white/80">A wiki that never forgets.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link
            href="https://github.com/fokkerone/superspecs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white/15 px-6 py-3 text-sm font-medium text-white hover:border-white/25 transition-colors duration-200 rounded-sm"
          >
            npm install -g superspecs
          </Link>
          <Link href="/docs" className="link-underline font-medium text-white/70 text-sm py-3">
            Read the docs →
          </Link>
        </div>
      </div>
    </section>
  );
}
