"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { slideDown } from "@/lib/transitions";

export function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={pathname}
        variants={slideDown}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          // Ensure this layer never stacks above the fixed header (z-50 = 50)
          zIndex: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
