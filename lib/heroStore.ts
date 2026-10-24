/**
 * Shared, mutable state between the DOM hero (scroll + pointer listeners) and
 * the WebGL scene. Plain object, read every frame, so no React re-renders.
 */
export const heroStore = {
  /** 0 at the top of the hero, 1 when it has scrolled out of view. */
  scroll: 0,
  /** Pointer in normalised device coordinates, -1..1. */
  pointer: { x: 0, y: 0 },
};
