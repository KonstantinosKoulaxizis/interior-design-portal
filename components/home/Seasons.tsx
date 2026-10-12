"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { SEASONS, type Season } from "@/lib/seasons";

const EASE = [0.22, 1, 0.36, 1] as const;
// Each change of season takes this share of the pinned scroll.
const CHANGE = 0.16;

/** Scroll position (0..1) at which season `i` has fully taken over. */
const settledAt = (i: number) => (i / (SEASONS.length - 1)) * (1 - CHANGE * 0.5);

/**
 * One season's photograph. Every season after the first is revealed by a soft, slanted edge
 * of light sweeping across the room, so the change reads as time passing in the same place.
 */
function Plate({ season, index, progress }: { season: Season; index: number; progress: MotionValue<number> }) {
  const end = settledAt(index);
  const start = Math.max(0, end - CHANGE);
  const edge = useTransform(progress, [start, end], [-30, 130]);
  const mask = useMotionTemplate`linear-gradient(105deg, #000 ${edge}%, transparent calc(${edge}% + 28%))`;
  // a slow push-in while the season is on screen
  const scale = useTransform(progress, [start, Math.min(1, end + 0.3)], [1.08, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={index === 0 ? undefined : { maskImage: mask, WebkitMaskImage: mask }}
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={season.image}
          alt={season.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          quality={90}
          className="object-cover"
          style={{ objectPosition: season.focus }}
        />
      </motion.div>
    </motion.div>
  );
}

function Pin({ x, y, label, material, delay }: { x: number; y: number; label: string; material: string; delay: number }) {
  return (
    <motion.div
      className="group pointer-events-auto absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <button
        type="button"
        aria-label={`${label}, ${material}`}
        className="relative -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full"
      >
        <span className="absolute inset-0 rounded-full border border-ivory/50 transition-transform duration-500 group-hover:scale-125 group-focus-within:scale-125" />
        <span className="h-1.5 w-1.5 rounded-full bg-ivory" />
      </button>
      <span className="pointer-events-none absolute left-6 top-0 -translate-y-1/2 whitespace-nowrap bg-ink/70 px-4 py-2.5 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="block font-display text-base text-ivory">{label}</span>
        <span className="block text-[0.62rem] tracking-[0.24em] text-ivory/60 uppercase">{material}</span>
      </span>
    </motion.div>
  );
}

/**
 * Homepage hero: one Athens living room through the four seasons. The room never moves;
 * scrolling sweeps each season's light, furniture and textiles across the last.
 */
export default function Seasons() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // a season becomes "current" once its light has crossed the middle of the room
    let i = 0;
    SEASONS.forEach((_, k) => {
      if (k > 0 && v >= settledAt(k) - CHANGE * 0.45) i = k;
    });
    setActive(i);
  });
  const season = SEASONS[active];
  const cue = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={section} className="relative bg-ink" style={{ height: `${SEASONS.length * 110}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {SEASONS.map((s, i) => (
          <Plate key={s.id} season={s} index={i} progress={scrollYProgress} />
        ))}

        {/* legibility: a soft shade at the foot and the left where the type sits */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(13,15,18,0.82),rgba(13,15,18,0)_48%),linear-gradient(to_right,rgba(13,15,18,0.45),rgba(13,15,18,0)_45%)]" />

        {/* pieces in this season's room */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <AnimatePresence>
            {season.pieces.map((p, i) => (
              <Pin key={`${season.id}-${p.label}`} {...p} delay={0.5 + i * 0.12} />
            ))}
          </AnimatePresence>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-6 pb-10 md:px-12 md:pb-12">
          <div className="mb-10 grid items-end gap-10 md:mb-14 md:grid-cols-[1fr_auto]">
            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${season.id}-meta`}
                  className="mb-6 flex items-center gap-4 text-[0.68rem] tracking-[0.36em] text-ivory/75 uppercase"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <span className="h-px w-10 bg-ivory/50" />
                  {season.months}
                </motion.p>
              </AnimatePresence>
              <h1 className="font-display text-[clamp(3.4rem,10vw,11rem)] leading-[0.9] font-extralight tracking-[-0.02em] text-ivory">
                <span className="sr-only">Maria Michalakakou, σχεδιασμός εσωτερικών χώρων. </span>
                <span className="block overflow-hidden pb-[0.1em]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={season.id}
                      className="block"
                      initial={{ y: "100%", filter: "blur(8px)" }}
                      animate={{ y: "0%", filter: "blur(0px)" }}
                      exit={{ y: "-100%", filter: "blur(8px)" }}
                      transition={{ duration: 0.9, ease: EASE }}
                    >
                      {season.name}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${season.id}-line`}
                  className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-ivory/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  {season.line}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* the year, as an index of the four rooms */}
            <ol className="flex gap-6 text-[0.66rem] tracking-[0.3em] uppercase md:flex-col md:items-end md:gap-3">
              {SEASONS.map((s, i) => (
                <li key={s.id} className={`flex items-center gap-3 transition-colors duration-700 ${i === active ? "text-ivory" : "text-ivory/35"}`}>
                  <span className={`h-px bg-current transition-all duration-700 ${i === active ? "w-8" : "w-3"}`} />
                  {s.name}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 items-center gap-6 border-t border-ivory/15 pt-5 text-[0.66rem] tracking-[0.28em] text-ivory/60 uppercase md:grid-cols-3">
            <span>Ένα σαλόνι στην Αθήνα</span>
            <motion.span style={{ opacity: cue }} className="hidden justify-center md:flex">
              Κυλήστε μέσα στον χρόνο
            </motion.span>
            <span className="flex items-center justify-end gap-4 tabular-nums">
              {season.light}
              <span className="relative hidden h-px w-16 bg-ivory/20 sm:block">
                <motion.span className="absolute inset-0 origin-left bg-ivory" style={{ scaleX: bar }} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
