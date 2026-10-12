"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TEXT =
  "Κάθε χώρος έχει μια ιστορία. Τη διαβάζουμε στο φως της ημέρας, στην υφή της πέτρας, στη ζεστασιά του ξύλου, και τη μετατρέπουμε σε ένα σπίτι που μοιάζει μόνο σε εσάς.";

/** A manifesto paragraph whose words light up one by one as it scrolls through the viewport. */
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-[1600px] px-6 py-[18vh] md:px-10">
      <p className="eyebrow mb-10">Η φιλοσοφία μας</p>
      <p className="max-w-[22ch] font-display text-[clamp(2rem,5.2vw,5.4rem)] leading-[1.08] font-light md:max-w-[26ch]">
        {TEXT.split(" ").map((w, i) => (
          <span key={i} data-word className="inline-block pr-[0.25em]">
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
