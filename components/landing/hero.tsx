"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScrollContainer } from "@/components/scroll-container";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainer = useScrollContainer();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const isInternalNav =
      Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
    if (!isInternalNav) setShouldAnimate(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["0%", "-25%"],
  );

  const headlineScale = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [1, 1.15]);

  const headlineX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["0%", "-8%"],
  );

  return (
    <section
      ref={sectionRef}
      className="bg-signalgray-100 min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* Eyebrow — oben, unter dem fixen Header */}
      <div className="px-6 md:px-8 pt-20 md:pt-24">
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-signalgray-800/50">
          Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini CLI
        </p>
      </div>

      {/* Unterer Block — Mega-Headline + Sub-Text + CTA */}
      <div className="pb-16 md:pb-24">
        {/* Mega-Headline */}
        <div className="overflow-hidden mb-6">
          <motion.div
            initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
          >
            <motion.h1
              style={{
                y: headlineY,
                scale: headlineScale,
                x: headlineX,
                fontSize: "clamp(5rem, 15vw, 18rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                willChange: "transform",
              }}
              className="font-extrabold text-signalgray-800 whitespace-nowrap px-6 md:px-8"
            >
              AI coding that compounds.
            </motion.h1>
          </motion.div>
        </div>

        {/* Sub-Text + CTA */}
        <div className="px-6 md:px-8 max-w-5xl">
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_ENTER_TUPLE }}
            className="text-[1.0625rem] leading-[1.65] text-signalgray-800/70 max-w-2xl mb-10"
          >
            Spec-driven planning. Parallel TDD execution.{" "}
            <span className="text-signalgray-800/90">A wiki that never forgets.</span>
          </motion.p>

          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_ENTER_TUPLE }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="https://github.com/fokkerone/superspecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-signalgray-800/15 px-6 py-3 text-sm font-medium text-signalgray-800 hover:border-signalgray-800/30 transition-colors duration-200 rounded-sm"
            >
              npm install -g superspecs
            </Link>
            <Link
              href="/docs"
              className="link-underline font-medium text-signalgray-800/70 text-sm py-3"
            >
              Read the docs →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
