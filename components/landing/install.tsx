"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useScrollContainer } from "@/components/scroll-container";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

export function Install() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainer = useScrollContainer();
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ["start start", "end start"],
  });

  const sectionY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0vh", "0vh"] : ["0vh", "-10vh"],
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY, willChange: "transform" }}
      className="bg-signalgray-800 py-24 md:py-40 px-5 md:px-10"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
        >
          <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
            Get Started
          </p>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className="font-light text-white mb-4"
          >
            Stop starting from zero.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_ENTER_TUPLE }}
          className="text-white/60 text-[1.0625rem] leading-[1.65] mb-10 max-w-lg"
        >
          Install SuperSpecs once. Every AI session that follows starts informed, not blind.
          Knowledge compounds. Problems stay solved.
        </motion.p>

        {/* Terminal mockup */}
        <div className="rounded-lg border border-white/10 bg-signalgray-900 overflow-hidden mb-8">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="ml-2 text-[0.75rem] text-white/40 font-mono">terminal</span>
          </div>
          {/* Content */}
          <div className="p-6 font-mono text-sm leading-[1.7] space-y-3">
            <div className="flex gap-3">
              <span className="text-white/70 select-none">$</span>
              <span className="text-white">npm install -g superspecs</span>
            </div>
            <div className="flex gap-3">
              <span className="text-white/70 select-none">$</span>
              <span className="text-white">cd your-project && superspecs install</span>
            </div>
            <div className="text-white/40 pl-6 text-xs">✓ Skills linked to all your AI agents</div>
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_ENTER_TUPLE }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <Link
            href="https://github.com/fokkerone/superspecs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white/15 px-6 py-3 text-sm font-medium text-white hover:border-white/25 transition-colors duration-200 rounded-sm"
          >
            View on GitHub
          </Link>
          <Link href="/docs" className="link-underline font-medium text-white/70 text-sm py-3">
            Read the docs →
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
