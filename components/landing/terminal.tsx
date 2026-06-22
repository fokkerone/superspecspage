"use client";
import { motion } from "framer-motion";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

export function Terminal() {
  return (
    <section className="relative z-10 bg-signalgray-800 py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
        >
          <div className="rounded-lg border border-white/10 bg-signalgray-900 overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="ml-2 text-[0.75rem] text-white/40 font-mono">terminal</span>
            </div>
            {/* Content */}
            <div className="p-6 font-mono text-sm leading-[1.7] text-left space-y-2">
              <div className="flex gap-3">
                <span className="text-white/70">$</span>
                <span className="text-white">npx superspecs install</span>
              </div>
              <div className="text-white/40 pl-6">✓ Skills linked to Claude Code</div>
              <div className="text-white/40 pl-6">✓ Skills linked to Cursor</div>
              <div className="text-white/40 pl-6">✓ Skills linked to OpenCode</div>
              <div className="flex gap-3 mt-4">
                <span className="text-white/70">$</span>
                <span className="text-white">/superspecs:discuss</span>
              </div>
              <div className="text-white/40 pl-6">
                What are we building? Give me the 30-second version...
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
