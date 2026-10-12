"use client";

import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import Model from "../three/Model";
import SceneLoader from "../three/SceneLoader";

/** Studio-lit, rotatable 3D view of one catalogue piece. */
export default function ProductViewer({
  model,
  variant,
  transparent = false,
}: {
  model: string;
  variant?: string;
  /** Render on a transparent background (used to produce catalogue thumbnails) */
  transparent?: boolean;
}) {
  return (
    <div className="relative h-full w-full" data-cursor="drag">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.2, 1.3, 2.6], fov: 32 }}
        gl={{ antialias: true, alpha: transparent, preserveDrawingBuffer: transparent, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {!transparent && <color attach="background" args={["#14171b"]} />}
        <Suspense fallback={null}>
          <Environment files="/hdr/apartment.hdr" environmentIntensity={0.9} />
          <directionalLight
            position={[2, 6, 3]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-radius={8}
            shadow-bias={-0.0004}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
          />
          <spotLight position={[-4, 3, -2]} intensity={30} angle={0.5} penumbra={1} color="#9fb6c8" />
          <Bounds fit clip observe margin={transparent ? 1.3 : 1.6}>
            <Center top>
              <Model url={model} variant={variant} />
            </Center>
          </Bounds>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[12, 12]} />
            <shadowMaterial opacity={0.45} />
          </mesh>
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={!transparent}
          autoRotateSpeed={0.8}
          enablePan={false}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
      {!transparent && <SceneLoader label="Φόρτωση μοντέλου" />}
    </div>
  );
}
