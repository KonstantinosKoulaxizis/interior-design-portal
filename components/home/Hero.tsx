"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./lightShader";
import { createLeafTexture } from "./leafTexture";

const EASE = [0.22, 1, 0.36, 1] as const;

function LightPlane({ scroll }: { scroll: React.RefObject<number> }) {
  const size = useThree((s) => s.size);
  const leaves = useMemo(() => createLeafTexture(), []);
  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uOpen: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uLeaves: { value: leaves },
    }),
    [leaves],
  );
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2());
  const start = useRef<number | null>(null);
  const still = useRef(false);

  useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => mouse.current.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, dt) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    // with reduced motion the light holds still: no breeze, no drifting dust, no shutter reveal
    u.uTime.value = still.current ? 10 : state.clock.elapsedTime;
    u.uRes.value.set(size.width, size.height);
    // the shutters open over ~2.6s after a short beat of darkness
    const o = Math.min(1, Math.max(0, (t - 0.5) / 2.6));
    u.uOpen.value = still.current ? 1 : 1 - Math.pow(1 - o, 3);
    const k = 1 - Math.exp(-dt * 2.5);
    u.uScroll.value += ((scroll.current ?? 0) - u.uScroll.value) * k;
    u.uMouse.value.lerp(mouse.current, 1 - Math.exp(-dt * 1.5));
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 1000 * 15);
  return () => clearInterval(id);
}
function athensTime() {
  return new Intl.DateTimeFormat("el-GR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Athens" }).format(new Date());
}

/** Lines that rise from behind a mask and settle from a soft blur. */
function Headline({ lines, delay, className }: { lines: React.ReactNode[]; delay: number; className?: string }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: "105%", filter: "blur(10px)", opacity: 0 }}
            animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.8, delay: delay + i * 0.14, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Phase({ progress, range, children, className }: { progress: MotionValue<number>; range: [number, number, number, number]; children: React.ReactNode; className?: string }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[3]], [30, -30]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  return (
    <motion.div style={{ opacity, y, filter: blur }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Homepage hero. A pinned, full-screen light study rendered in a single shader: the sun
 * crosses an arched window onto lime plaster, and scrolling turns afternoon into night.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const scrollValue = useRef(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [isNight, setIsNight] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollValue.current = v;
    setIsNight(v > 0.45);
  });
  const time = useSyncExternalStore(subscribeClock, athensTime, () => "");

  const firstOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const firstY = useTransform(scrollYProgress, [0, 0.28], [0, -60]);
  const firstBlur = useTransform(scrollYProgress, [0, 0.28], ["blur(0px)", "blur(10px)"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={section} className="relative h-[280svh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Canvas
            flat
            dpr={[1, 1.25]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            orthographic
            camera={{ position: [0, 0, 1] }}
          >
            <LightPlane scroll={scrollValue} />
          </Canvas>
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-6 pb-10 md:px-12 md:pb-12">
          {/* phase one: afternoon */}
          <motion.div style={{ opacity: firstOpacity, y: firstY, filter: firstBlur }} className="mb-[13vh] md:mb-[16vh]">
            <motion.p
              className="mb-7 flex items-center gap-4 text-[0.68rem] tracking-[0.38em] text-ivory/70 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.6 }}
            >
              <span className="h-px w-10 bg-ivory/50" />
              Σχεδιασμός εσωτερικών χώρων
            </motion.p>
            <h1 className="font-display text-[clamp(3.1rem,8.6vw,9.6rem)] leading-[0.94] font-extralight tracking-[-0.02em] text-ivory">
              <Headline
                delay={1.5}
                lines={[
                  "Το φως είναι",
                  <span key="2">
                    το πρώτο <em className="font-light text-[#e9d3b4]">υλικό</em>.
                  </span>,
                ]}
              />
            </h1>
          </motion.div>

          {/* phase two: night */}
          <Phase progress={scrollYProgress} range={[0.42, 0.56, 0.86, 0.98]} className="pointer-events-none absolute inset-x-6 bottom-[calc(13vh+2.5rem)] md:inset-x-12 md:bottom-[calc(16vh+3rem)]">
            <p className="mb-7 flex items-center gap-4 text-[0.68rem] tracking-[0.38em] text-mist/70 uppercase">
              <span className="h-px w-10 bg-mist/50" />
              Η φιλοσοφία μας
            </p>
            <p className="max-w-[16ch] font-display text-[clamp(2.8rem,7.4vw,8.4rem)] leading-[0.96] font-extralight tracking-[-0.02em] text-ivory">
              Η σκιά, <em className="font-light text-blue">το δεύτερο.</em>
            </p>
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-mist/75">
              Σχεδιάζουμε χώρους που αλλάζουν με τις ώρες της ημέρας: πώς πέφτει το πρωινό φως, πού ξεκουράζεται το βλέμμα το βράδυ.
            </p>
          </Phase>

          {/* meta row */}
          <motion.div
            className="grid grid-cols-2 items-end gap-6 border-t border-ivory/15 pt-5 text-[0.66rem] tracking-[0.28em] text-ivory/60 uppercase md:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1.4, ease: EASE }}
          >
            <span>
              Αθήνα<span className="hidden sm:inline"> · 37°58′Β 23°43′Α</span>
            </span>
            <motion.span style={{ opacity: cueOpacity }} className="hidden items-center justify-center gap-3 md:flex">
              Κύλιση
              <span className="relative h-px w-14 overflow-hidden bg-ivory/20">
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/2 bg-ivory"
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.span>
            <span className="text-right whitespace-nowrap tabular-nums">
              {isNight ? "Νύχτα" : "Απόγευμα"}
              {time && <> · {time}</>}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
