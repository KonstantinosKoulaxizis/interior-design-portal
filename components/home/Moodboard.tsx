"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { MATERIALS } from "@/lib/content";

/**
 * Material library: hovering a material name floats a close-up of its texture next to
 * the cursor. On touch screens the textures show inline instead.
 */
export default function Moodboard() {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 20 });
  const sy = useSpring(y, { stiffness: 140, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-[16vh] md:px-10">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-6">Βιβλιοθήκη υλικών</p>
          <h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-none font-extralight">
            Η ύλη <span className="italic text-blue">μιλά.</span>
          </h2>
        </div>
        <p className="max-w-sm text-mist/75">
          Επιλέγουμε φυσικά υλικά που γερνούν όμορφα. Περάστε τον δείκτη πάνω από κάθε υλικό.
        </p>
      </div>

      <div ref={box} onPointerMove={onMove} onPointerLeave={() => setActive(null)} className="relative">
        <ul>
          {MATERIALS.map((m, i) => (
            <li
              key={m.name}
              onPointerEnter={() => setActive(i)}
              data-cursor="link"
              className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-slate py-7 last:border-b md:grid-cols-[6rem_1fr_auto] md:py-9"
            >
              <span className="font-sans text-xs tracking-[0.3em] text-mist/50">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`font-display text-[clamp(1.8rem,4.2vw,4.2rem)] leading-none font-light transition-all duration-700 ease-luxe ${
                  active === null || active === i ? "text-ivory" : "text-ivory/25"
                } group-hover:translate-x-4 group-hover:italic`}
              >
                {m.name}
              </span>
              <span className="col-start-2 text-sm text-mist/70 md:col-start-3">{m.note}</span>
              <div className="relative col-span-2 mt-4 aspect-[4/3] overflow-hidden md:hidden">
                <Image src={m.image} alt={m.name} fill sizes="100vw" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>

        <motion.div
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
        >
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: "inset(50% 50% 50% 50%)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative -mt-[180px] ml-10 h-[340px] w-[270px] overflow-hidden shadow-2xl shadow-black/60"
              >
                <Image src={MATERIALS[active].image} alt="" fill sizes="270px" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
