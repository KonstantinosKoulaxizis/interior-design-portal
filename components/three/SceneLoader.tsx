"use client";

import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/** DOM overlay that tracks three.js asset loading; sits outside the Canvas. */
export default function SceneLoader({ label = "Φόρτωση χώρου" }: { label?: string }) {
  const { active, progress } = useProgress();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (active) return;
    // Loading finished (or everything was already cached): give the first frame a moment to paint.
    const t = setTimeout(() => setDone(true), progress === 100 ? 300 : 1500);
    return () => clearTimeout(t);
  }, [active, progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink"
        >
          <div className="flex w-56 flex-col items-center gap-4 text-center">
            <span className="eyebrow">{label}</span>
            <span className="h-px w-full bg-slate">
              <span className="block h-px bg-blue transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </span>
            <span className="font-display text-sm text-mist/60 tabular-nums">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
