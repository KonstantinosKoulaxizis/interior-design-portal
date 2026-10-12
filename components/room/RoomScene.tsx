"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Model from "../three/Model";
import { marbleTexture, plankTexture } from "../three/textures";

export type Mood = "morning" | "dusk" | "night";
export type Wall = "graphite" | "mist" | "lime";
export type Floor = "oak" | "walnut" | "marble";

export type RoomState = {
  sofa: string;
  chair: string;
  wall: Wall;
  floor: Floor;
  mood: Mood;
};

export type Hotspot = {
  id: string;
  position: [number, number, number];
  title: string;
  text: string;
  href?: string;
};

export const WALLS: Record<Wall, { label: string; color: string }> = {
  graphite: { label: "Γραφίτης", color: "#2b2f34" },
  mist: { label: "Μπλε ομίχλης", color: "#5b6c79" },
  lime: { label: "Ασβέστης", color: "#d8d1c4" },
};

export const FLOORS: Record<Floor, { label: string; swatch: string }> = {
  oak: { label: "Δρυς", swatch: "#a77a4f" },
  walnut: { label: "Καρυδιά", swatch: "#5a3d2b" },
  marble: { label: "Μάρμαρο", swatch: "#d9d6cf" },
};

export const MOODS: Record<Mood, { label: string }> = {
  morning: { label: "Πρωί" },
  dusk: { label: "Δείλι" },
  night: { label: "Βράδυ" },
};

const LIGHTING: Record<
  Mood,
  { env: number; sun: string; sunIntensity: number; sunPos: [number, number, number]; lamps: number; window: string; bg: string }
> = {
  morning: { env: 0.9, sun: "#fff4e2", sunIntensity: 3.2, sunPos: [-6, 5, 2], lamps: 0, window: "#f4efe6", bg: "#15181c" },
  dusk: { env: 0.7, sun: "#ff9a52", sunIntensity: 3.6, sunPos: [-6, 1.6, 1.5], lamps: 1.2, window: "#f1a467", bg: "#120f0e" },
  night: { env: 0.12, sun: "#6d86b5", sunIntensity: 0.4, sunPos: [-6, 4, 2], lamps: 6, window: "#1d2a40", bg: "#07080a" },
};

function Room({ wall, floor }: { wall: Wall; floor: Floor }) {
  const floorMap = useMemo(() => {
    if (floor === "marble") return marbleTexture("#dcd8cf", "#6c6a66", 3, 3);
    return floor === "oak" ? plankTexture([170, 122, 78]) : plankTexture([92, 62, 44], 11);
  }, [floor]);
  const tableTop = useMemo(() => marbleTexture("#1b1c1e", "#c9c3b8", 9), []);
  const wallColor = WALLS[wall].color;

  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial map={floorMap} roughness={floor === "marble" ? 0.25 : 0.55} />
      </mesh>
      {/* back wall with fluted panelling behind the sofa */}
      <mesh position={[0, 1.6, -2.25]} receiveShadow>
        <boxGeometry args={[9, 3.2, 0.1]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <group position={[0, 1.6, -2.17]}>
        {Array.from({ length: 34 }).map((_, i) => (
          <mesh key={i} position={[-1.65 + i * 0.1, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.035, 0.035, 3.2, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={wallColor} roughness={0.85} />
          </mesh>
        ))}
      </group>
      {/* left wall with a tall window */}
      <group position={[-3.4, 1.6, 0]}>
        <mesh position={[0, 0, -1.6]} receiveShadow>
          <boxGeometry args={[0.1, 3.2, 1.4]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 2.6]} receiveShadow>
          <boxGeometry args={[0.1, 3.2, 3.4]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.35, 0.5]}>
          <boxGeometry args={[0.1, 0.5, 2.8]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, -1.45, 0.5]}>
          <boxGeometry args={[0.1, 0.3, 2.8]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        {[-0.9, 0.5, 1.9].map((z) => (
          <mesh key={z} position={[0.02, -0.1, z]}>
            <boxGeometry args={[0.06, 2.4, 0.04]} />
            <meshStandardMaterial color="#111" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>
      {/* rug */}
      <mesh position={[0, 0.006, -0.55]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#8c8273" roughness={1} />
      </mesh>
      {/* round coffee table: dark marble top on a fluted brass drum */}
      <group position={[0, 0, -0.45]}>
        <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 64]} />
          <meshStandardMaterial map={tableTop} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.185, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 0.37, 48]} />
          <meshStandardMaterial color="#a88b67" metalness={0.9} roughness={0.32} />
        </mesh>
      </group>
      {/* side table */}
      <mesh position={[1.55, 0.28, -1.75]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.56, 0.5]} />
        <meshStandardMaterial color="#1c1d20" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* framed artwork */}
      <group position={[2.6, 1.65, -2.18]}>
        <mesh>
          <boxGeometry args={[1.05, 1.35, 0.04]} />
          <meshStandardMaterial color="#0e0f11" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.9, 1.2]} />
          <meshStandardMaterial map={tableTop} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function Lights({ mood }: { mood: Mood }) {
  const cfg = LIGHTING[mood];
  const sun = useRef<THREE.DirectionalLight>(null);
  const targetColor = useMemo(() => new THREE.Color(cfg.sun), [cfg.sun]);
  const targetPos = useMemo(() => new THREE.Vector3(...cfg.sunPos), [cfg.sunPos]);

  // Ease lighting changes so switching mood feels like time passing rather than a cut.
  useFrame((_, dt) => {
    if (!sun.current) return;
    const k = 1 - Math.exp(-dt * 3);
    sun.current.intensity += (cfg.sunIntensity - sun.current.intensity) * k;
    sun.current.color.lerp(targetColor, k);
    sun.current.position.lerp(targetPos, k);
  });

  return (
    <>
      <directionalLight
        ref={sun}
        castShadow
        position={cfg.sunPos}
        intensity={cfg.sunIntensity}
        color={cfg.sun}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[1.55, 0.95, -1.75]} intensity={cfg.lamps} color="#ffb46b" distance={4} decay={2} />
      <pointLight position={[-1.6, 1.9, -1.95]} intensity={cfg.lamps * 0.8} color="#ffc583" distance={4} decay={2} />
      <pointLight position={[0, 2.6, 0]} intensity={cfg.lamps * 0.35} color="#ffd9a8" distance={6} decay={2} />
      {/* window glow */}
      <mesh position={[-3.47, 1.5, 0.5]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[2.8, 2.4]} />
        <meshBasicMaterial color={cfg.window} toneMapped={false} />
      </mesh>
    </>
  );
}

/** Widen the lens on portrait screens so the whole room still fits. */
function ResponsiveCamera() {
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = aspect < 1 ? 62 : 38;
    camera.updateProjectionMatrix();
  }, [get, aspect]);
  return null;
}

function Hotspots({ items, active, onSelect }: { items: Hotspot[]; active: string | null; onSelect: (id: string | null) => void }) {
  return (
    <>
      {items.map((h) => (
        <Html key={h.id} position={h.position} center zIndexRange={[20, 0]}>
          <button
            onClick={() => onSelect(active === h.id ? null : h.id)}
            aria-label={h.title}
            className="group relative flex h-9 w-9 items-center justify-center"
          >
            <span className="absolute inset-1 animate-ping rounded-full border border-ivory/50" />
            <span
              className={`relative h-3.5 w-3.5 rounded-full border border-ivory transition-all duration-300 ${
                active === h.id ? "scale-125 bg-blue" : "bg-ivory/90 group-hover:bg-blue"
              }`}
            />
          </button>
        </Html>
      ))}
    </>
  );
}

export default function RoomScene({
  state,
  hotspots,
  activeHotspot,
  onHotspot,
}: {
  state: RoomState;
  hotspots: Hotspot[];
  activeHotspot: string | null;
  onHotspot: (id: string | null) => void;
}) {
  const cfg = LIGHTING[state.mood];
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [3.4, 1.75, 3.4], fov: 38 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      onPointerMissed={() => onHotspot(null)}
    >
      <ResponsiveCamera />
      <color attach="background" args={[cfg.bg]} />
      <fog attach="fog" args={[cfg.bg, 9, 18]} />
      <Suspense fallback={null}>
        <Environment files="/hdr/apartment.hdr" environmentIntensity={cfg.env} />
        <Lights mood={state.mood} />
        <Room wall={state.wall} floor={state.floor} />
        <Model url="/models/GlamVelvetSofa.glb" variant={state.sofa} position={[0, 0, -1.55]} />
        <Model url="/models/SheenChair.glb" variant={state.chair} position={[1.75, 0, -0.25]} rotation-y={-1.05} />
        <Model url="/models/ChairDamaskPurplegold.glb" position={[-1.75, 0, -0.3]} rotation-y={1.05} />
        <Model url="/models/IridescenceLamp.glb" position={[1.55, 0.56, -1.78]} />
        <Model url="/models/GlassVaseFlowers.glb" position={[-0.05, 0.41, -0.45]} scale={1.6} />
        <Model url="/models/AnisotropyBarnLamp.glb" position={[-1.6, 2.05, -2.2]} scale={1.4} />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={9} blur={2.4} far={2.5} />
        <Hotspots items={hotspots} active={activeHotspot} onSelect={onHotspot} />
      </Suspense>
      <OrbitControls
        makeDefault
        target={[0, 0.65, -0.9]}
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={2.4}
        maxDistance={6.2}
        minPolarAngle={0.85}
        maxPolarAngle={1.48}
        minAzimuthAngle={-0.95}
        maxAzimuthAngle={0.95}
        autoRotate={!activeHotspot}
        autoRotateSpeed={0.25}
      />
    </Canvas>
  );
}
