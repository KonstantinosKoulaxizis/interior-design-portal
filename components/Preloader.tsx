"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { markIntroDone } from "@/lib/intro";

const NAME = "Maria Michalakakou";
const SESSION_KEY = "mm-intro-seen";

// Decided once per page load, so React's dev double-invoked effects don't skip the intro.
let shouldPlay: boolean | null = null;
function decideIntro() {
  if (shouldPlay !== null) return shouldPlay;
  try {
    shouldPlay = sessionStorage.getItem(SESSION_KEY) !== "1";
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    shouldPlay = true;
  }
  return shouldPlay;
}

/**
 * First-visit intro: the wordmark is set letter by letter while a hairline draws
 * underneath and a counter runs to 100, then the curtain lifts.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!decideIntro()) {
      const skip = requestAnimationFrame(() => {
        setVisible(false);
        markIntroDone();
      });
      return () => cancelAnimationFrame(skip);
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const duration = 2400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setVisible(false);
          document.documentElement.style.overflow = "";
          markIntroDone();
        }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink"
        >
          <div className="flex flex-col items-center px-6 text-[clamp(1rem,3.4vw,2.6rem)]">
            <p className="font-display font-light uppercase tracking-[0.34em] whitespace-nowrap [margin-right:-0.34em]">
              {NAME.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.6em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </p>
            <motion.span
              className="my-[0.7em] h-px w-full origin-left bg-blue"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.span
              className="font-sans text-[0.32em] uppercase tracking-[0.5em] text-mist [margin-right:-0.5em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              Σχεδιασμός Εσωτερικών Χώρων
            </motion.span>
          </div>
          <span className="absolute right-6 bottom-6 font-display text-6xl font-extralight text-ivory/20 tabular-nums md:right-10 md:bottom-10 md:text-8xl">
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
