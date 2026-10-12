"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "link" | "view" | "drag";

const LABELS: Partial<Record<Mode, string>> = { view: "Δείτε", drag: "Σύρετε" };

/** A soft trailing cursor that grows over interactive elements. Hidden on touch devices. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setMode((el?.dataset.cursor as Mode) ?? "default");
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const size = mode === "view" || mode === "drag" ? 92 : mode === "link" ? 46 : 12;

  return (
    <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[70] hidden mix-blend-difference [@media(pointer:fine)]:block">
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory text-[0.62rem] tracking-[0.2em] text-ivory uppercase transition-[width,height,background-color] duration-500 ease-luxe"
        style={{
          width: size,
          height: size,
          backgroundColor: mode === "default" ? "var(--ivory)" : "transparent",
        }}
      >
        {LABELS[mode]}
      </div>
    </div>
  );
}
