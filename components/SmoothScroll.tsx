"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollSync() {
  const lenis = useLenis(() => ScrollTrigger.update());
  const pathname = usePathname();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, smoothWheel: true }}>
      <ScrollSync />
      {children}
    </ReactLenis>
  );
}
