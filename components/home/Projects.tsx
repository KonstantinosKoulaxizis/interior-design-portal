"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Selected work as a pinned horizontal gallery: vertical scroll moves the strip sideways,
 * and each image drifts inside its frame for a layered parallax.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden md:h-screen">
      <div ref={track} className="flex h-full flex-col gap-16 px-6 py-24 md:w-max md:flex-row md:items-center md:gap-[6vw] md:px-10 md:py-0">
        <div className="shrink-0 md:w-[32vw]">
          <p className="eyebrow mb-6">Επιλεγμένα έργα</p>
          <h2 className="font-display text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.95] font-extralight">
            Ιστορίες
            <br />
            <span className="italic text-blue">σε υλικό.</span>
          </h2>
          <p className="mt-8 max-w-sm text-mist/75">
            Πέντε έργα, πέντε διαφορετικοί τρόποι ζωής. Κυλήστε για να περιηγηθείτε.
          </p>
        </div>

        {PROJECTS.map((p, i) => (
          <article
            key={p.slug}
            data-cursor="view"
            className={`group shrink-0 md:w-[44vw] ${i % 2 ? "md:mt-[14vh]" : "md:-mt-[10vh]"}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-graphite">
              <div data-parallax className="absolute -inset-x-[10%] inset-y-0">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-ink/25 transition-colors duration-700 group-hover:bg-transparent" />
            </div>
            <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-slate pt-5">
              <div className="flex items-baseline gap-5">
                <span className="font-sans text-xs tracking-[0.3em] text-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-2xl font-light md:text-3xl">{p.title}</h3>
              </div>
              <p className="text-right text-xs tracking-[0.2em] text-mist/70 uppercase">
                {p.category} · {p.place} · {p.year}
              </p>
            </div>
          </article>
        ))}
        <div className="hidden shrink-0 md:block md:w-[4vw]" />
      </div>
    </section>
  );
}
