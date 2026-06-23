"use client";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

  // Section-level parallax
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ["start start", "end start"],
  });

  const sectionY = useTransform(
    sectionScrollProgress,
    [0, 1],
    prefersReduced ? ["0vh", "0vh"] : ["0vh", "-8vh"],
  );

  // Scale: 1 → 2.4
  const headlineScale = useTransform(
    sectionScrollProgress,
    [0, 1],
    prefersReduced ? [1, 1] : [1, 2.4],
  );

  // Ticker speed: beim Scrollen minimal verlangsamen, ease-out damit Effekt am Ende stärker
  const tickerDuration = useTransform(
    sectionScrollProgress,
    [0, 1],
    prefersReduced ? [25, 25] : [25, 25.2],
    { ease: (t) => (t * t * t) * 0.5 },
  );
  const tickerDurationCss = useMotionTemplate`${tickerDuration}s`;

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY, willChange: "transform" }}
      className="bg-signalgray-100 min-h-[100svh] flex flex-col justify-between overflow-hidden"
    >
      {/* Eyebrow — oben, unter dem fixen Header, kein Ticker */}
      <div className="pt-20 md:pt-24 px-6 md:px-8">
        <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-signalgray-800/50">
          Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini CLI
        </p>
      </div>

      {/* Unterer Block — Mega-Headline + Sub-Text + CTA */}
      <div className="pb-16 md:pb-24">
        {/* Mega-Headline Ticker */}
        <div className="overflow-hidden mb-6" style={{ padding: "0.2em 0" }}>
          <motion.div
            initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
          >
            <motion.div
              style={{
                scale: headlineScale,
                fontSize: "clamp(6.5rem, 19.5vw, 23.4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.4,
                willChange: "transform",
              }}
            >
              <motion.div
                style={{ animationDuration: tickerDurationCss }}
                className="ticker-track"
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="font-extrabold text-signalgray-800">
                    AI coding that compounds.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                ))}
              </motion.div>
            </motion.div>
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
    </motion.section>
  );
}
