/**
 * Motion constants — single source of truth for easing curves and transition duration.
 *
 * CSS consumers: use var(--ease-enter) / var(--ease-exit) from globals.css
 * TS consumers: import from this file
 *
 * These values are duplicated once in app/globals.css @theme inline as CSS custom properties.
 * If you change a value here, update globals.css too.
 */

export const EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)" as const;
export const EASE_EXIT = "cubic-bezier(0.82, 1, 0.36, 1)" as const;
export const EASE_ENTER_TUPLE = [0.6, 0, 0.24, 1] as const;
export const EASE_EXIT_TUPLE = [0.82, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 1450;
