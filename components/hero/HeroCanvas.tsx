"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { MountainScene } from "./MountainScene";

/**
 * The WebGL hero. Loaded with next/dynamic only on capable devices, and only
 * renders frames while the hero is on screen.
 */
export default function HeroCanvas({ onReady }: { onReady: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 7, 40], fov: mobile ? 55 : 40, near: 0.5, far: 1000 }}
        gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#050b18")}
      >
        <Suspense fallback={null}>
          <MountainScene particleCount={mobile ? 220 : 520} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
