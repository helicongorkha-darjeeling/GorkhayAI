"use client";

import { useEffect, useState } from "react";

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Decides whether this device should get the WebGL hero. Low-memory or
 * low-core devices, data-saver, slow networks, missing WebGL and
 * prefers-reduced-motion all fall back to the static poster.
 * `?3d=1` / `?3d=0` force it either way for testing.
 */
export function detect3DSupport(): boolean {
  const force = new URLSearchParams(window.location.search).get("3d");
  if (force === "1") return true;
  if (force === "0") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

/** Hydration-safe: false on the server and first client render, then the real value. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
