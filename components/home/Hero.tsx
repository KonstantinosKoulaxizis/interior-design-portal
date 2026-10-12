"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LineReveal } from "../Reveal";
import { useIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Cinematic hero: a full-bleed interior that slowly settles in, then zooms and drifts
 * as you scroll while the headline parallaxes at a different speed.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useIntroDone();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to("[data-hero-image]", { scale: 1.25, yPercent: 12, ease: "none" }, 0)
        .to("[data-hero-frame]", { clipPath: "inset(6% 4% 6% 4% round 18px)", ease: "none" }, 0)
        .to("[data-hero-title]", { yPercent: -60, opacity: 0, ease: "none" }, 0)
        .to("[data-hero-meta]", { opacity: 0, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[115svh] overflow-hidden">
      <div data-hero-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}>
        <motion.div
          data-hero-image
          className="absolute inset-0"
          initial={{ scale: 1.18, opacity: 0 }}
          animate={ready ? { scale: 1.05, opacity: 1 } : {}}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/media/hero.jpg" alt="Σαλόνι με ανάγλυφη πέτρα και ξύλινο δάπεδο" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(13,15,18,0.7)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-[100svh] max-w-[1600px] flex-col justify-end px-6 pb-[12vh] md:px-10">
        <motion.p
          data-hero-meta
          className="eyebrow mb-6"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 1.2 }}
        >
          Αρχιτεκτονική εσωτερικών · Αθήνα
        </motion.p>
        <h1 data-hero-title className="font-display text-[clamp(3rem,10vw,10.5rem)] leading-[0.92] font-extralight tracking-[-0.01em]">
          {ready && (
            <LineReveal
              immediate
              delay={0.2}
              lines={[
                "Χώροι που",
                <span key="b" className="italic text-mist">
                  σας μοιάζουν.
                </span>,
              ]}
            />
          )}
        </h1>
        <motion.div
          data-hero-meta
          className="mt-10 flex items-end justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-md text-sm leading-relaxed text-mist/80 md:text-base">
            Σχεδιάζουμε κατοικίες και χώρους φιλοξενίας με σεβασμό στο φως, στην ύλη και στον τρόπο που ζείτε.
          </p>
          <span className="hidden items-center gap-3 text-[0.7rem] tracking-[0.3em] text-mist uppercase md:flex">
            Κύλιση
            <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-ivory"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
