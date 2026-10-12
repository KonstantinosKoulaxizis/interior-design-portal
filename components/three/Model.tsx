"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import type { Mesh } from "three";
import { applyVariant } from "./variants";

type Props = ThreeElements["group"] & {
  url: string;
  variant?: string;
};

/** A glTF model with shadows on, optionally switched to one of its material variants. */
export default function Model({ url, variant, ...props }: Props) {
  const gltf = useGLTF(url);
  // Clone so the same model can appear in two places without sharing a scene graph.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (variant) applyVariant(gltf, scene, variant);
  }, [gltf, scene, variant]);

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}
