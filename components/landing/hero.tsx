"use client";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScrollContainer } from "@/components/scroll-container";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

const SprayBlob = dynamic(
  () => import("./spray-blob").then((m) => m.SprayBlob),
  { ssr: false },
);

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainer = useScrollContainer();
  const prefersReduced = useReducedMotion();

  const mouseRef = useRef<[number, number]>([0, 0]);
  const scrollSpeedRef = useRef<number>(0);
  const scrollProgressRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);

  // Ticker
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const positionsRef = useRef<number[]>([0, 0, 0]);
  const tickerRafRef = useRef<number>(0);

  useEffect(() => {
    const isInternalNav =
      Boolean(document.referrer) &&
      new URL(document.referrer).origin === window.location.origin;
    if (!isInternalNav) setShouldAnimate(true);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ];
    };
    const onScroll = () => {
      const container = scrollContainer?.current;
      const y = container ? container.scrollTop : window.scrollY;
      const delta = Math.abs(y - lastScrollY.current);
      scrollSpeedRef.current = Math.min(delta / 40, 1);
      lastScrollY.current = y;
      setTimeout(() => {
        scrollSpeedRef.current *= 0.85;
      }, 100);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    const container = scrollContainer?.current;
    if (container)
      container.addEventListener("scroll", onScroll, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      if (container) container.removeEventListener("scroll", onScroll);
      else window.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainer]);

  // Section-level parallax
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    return sectionScrollProgress.on("change", (v) => {
      scrollProgressRef.current = v;
    });
  }, [sectionScrollProgress]);

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

  // JS ticker: rAF loop — speed reads scrollProgressRef each frame, zero restart risk
  useEffect(() => {
    const spans = spanRefs.current;
    if (spans.some((s) => !s)) return;

    // Initial layout: three spans side by side starting at x=0
    const sw = spans[0]!.offsetWidth;
    positionsRef.current = [0, sw, sw * 2];
    spans.forEach((span, i) => {
      if (span)
        span.style.transform = `translateX(${positionsRef.current[i]}px)`;
    });

    const loop = () => {
      const vw = window.innerWidth;
      // Cross viewport in ~5s at rest, 2× faster at full scroll
      const speed = (vw / 2300) * (0.81 + scrollProgressRef.current * 0.42);
      // Recycle threshold: span must clear 20vw past left edge
      const threshold = -(vw * 0.2);

      const widths = spans.map((s) => (s ? s.offsetWidth : 0));
      const next = positionsRef.current.map((x) => x - speed);

      for (let i = 0; i < 3; i++) {
        if (next[i] + widths[i] < threshold) {
          // Jump to right of the furthest-right span
          const maxRight = Math.max(...next.map((x, j) => x + widths[j]));
          next[i] = maxRight;
        }
      }

      positionsRef.current = next;
      spans.forEach((span, i) => {
        if (span) span.style.transform = `translateX(${next[i]}px)`;
      });

      tickerRafRef.current = requestAnimationFrame(loop);
    };

    tickerRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(tickerRafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY }}
      className='relative bg-signalgray-100 min-h-svh flex flex-col justify-between overflow-hidden'
    >
      <SprayBlob mouseRef={mouseRef} scrollRef={scrollProgressRef} />

      {/* Eyebrow — oben, unter dem fixen Header, kein Ticker */}
      <div className='pt-20 md:pt-24 px-6 md:px-8'>
        <p className='font-mono text-[0.75rem] tracking-widest uppercase text-signalgray-800/50'>
          Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini
          CLI
        </p>
      </div>

      {/* Unterer Block — Mega-Headline + Sub-Text + CTA */}
      <div className='pb-16 md:pb-24'>
        {/* Sub-Text + CTA */}
        <div className='px-6 md:px-8 max-w-5xl'>
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_ENTER_TUPLE }}
            className='text-[1.0625rem] leading-[1.65] text-signalgray-800/70 max-w-2xl mb-10'
          >
            Spec-driven planning. Parallel TDD execution.{" "}
            <span className='text-signalgray-800/90'>
              A wiki that never forgets.
            </span>
          </motion.p>

          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_ENTER_TUPLE }}
            className='flex flex-col sm:flex-row items-start gap-4'
          >
            <Link
              href='https://github.com/fokkerone/superspecs'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block border border-signalgray-800/15 px-6 py-3 text-sm font-medium text-signalgray-800 hover:border-signalgray-800/30 transition-colors duration-200 rounded-sm'
            >
              npm install -g superspecs
            </Link>
            <Link
              href='/docs'
              className='link-underline font-medium text-signalgray-800/70 text-sm py-3'
            >
              Read the docs →
            </Link>
          </motion.div>
        </div>

        {/* Mega-Headline Ticker */}
        <div className='overflow-hidden mb-6' style={{ padding: "0.2em 0" }}>
          <motion.div
            initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.25, ease: EASE_ENTER_TUPLE }}
          >
            <motion.div
              style={{
                scale: headlineScale,
                fontSize: "clamp(6.5rem, 19.5vw, 28.4rem)",
                letterSpacing: "-0.023em",
                lineHeight: 2.4,
              }}
            >
              {/* No overflow:hidden here — outer .overflow-hidden clips horizontally.
                  height:1.1em sets layout height without cutting descenders. */}
              <div style={{ position: "relative", height: "1.1em" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      spanRefs.current[i] = el;
                    }}
                    className='font-extrabold text-signalgray-800 pr-7'
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                    }}
                  >
                    AI coding that compounds
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
