"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Reveal from "../Reveal";

/** Drag the handle to compare a room before and after the redesign. */
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-[14vh] md:px-10">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-6">Πριν & Μετά</p>
          <h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-none font-extralight">
            Η μεταμόρφωση <span className="italic text-blue">ενός σαλονιού.</span>
          </h2>
        </div>
        <p className="max-w-sm text-mist/75">Σύρετε τη λαβή για να δείτε τον χώρο πριν και μετά την παρέμβασή μας.</p>
      </Reveal>

      <Reveal>
        <div
          ref={frame}
          data-cursor="drag"
          className="relative aspect-[16/10] touch-none overflow-hidden rounded-sm select-none"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            update(e.clientX);
          }}
          onPointerMove={(e) => dragging.current && update(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
        >
          <Image src="/media/after.jpg" alt="Μετά την ανακαίνιση" fill sizes="100vw" className="object-cover" draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Image src="/media/before.jpg" alt="Πριν την ανακαίνιση" fill sizes="100vw" className="object-cover grayscale-[40%]" draggable={false} />
          </div>
          <span className="eyebrow absolute top-6 left-6 rounded-full bg-ink/60 px-4 py-2 backdrop-blur">Πριν</span>
          <span className="eyebrow absolute top-6 right-6 rounded-full bg-ink/60 px-4 py-2 backdrop-blur">Μετά</span>

          <div className="absolute inset-y-0 w-px bg-ivory/80" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-ink/40 backdrop-blur-md">
              <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 1 1 6l5 5M20 1l5 5-5 5M1 6h24" />
              </svg>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Σύγκριση πριν και μετά"
            className="sr-only"
          />
        </div>
      </Reveal>
    </section>
  );
}
