import type { Variants } from "framer-motion";

/**
 * Slide-down exit: the outgoing page translates downward out of the viewport.
 * The incoming page sits stationary behind it — no enter animation.
 * Reference: betteroff.studio Overview → Work transition.
 */
export const slideDown: Variants = {
  initial: { y: 0 },
  animate: { y: 0 },
  exit: {
    y: "100%",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

/**
 * Fade only: simple opacity fade for the outgoing page.
 * Swap this in PageTransitionWrapper to change the global transition style.
 */
export const fadeOnly: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};
