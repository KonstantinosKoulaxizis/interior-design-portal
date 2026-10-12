import type { GLTF } from "three-stdlib";
import type { Material, Mesh, Object3D } from "three";

type VariantMapping = { material: number; variants: number[] };
type GLTFWithParser = GLTF & {
  parser: {
    getDependency: (type: "material", index: number) => Promise<Material>;
    assignFinalMaterial: (mesh: Mesh) => void;
  };
};

/** Names of the KHR_materials_variants a loaded glTF ships with (empty when it has none). */
export function variantNames(gltf: GLTF): string[] {
  const ext = (gltf.userData?.gltfExtensions as Record<string, { variants?: { name: string }[] }> | undefined)?.[
    "KHR_materials_variants"
  ];
  return ext?.variants?.map((v) => v.name) ?? [];
}

/**
 * Switch every mesh in `root` to the material the glTF maps to `variant`.
 * GLTFLoader keeps unknown primitive extensions in userData, which carries the mappings.
 */
export async function applyVariant(gltf: GLTF, root: Object3D, variant: string) {
  const index = variantNames(gltf).indexOf(variant);
  if (index < 0) return;
  const { parser } = gltf as GLTFWithParser;
  const jobs: Promise<void>[] = [];
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    const ext = mesh.userData?.gltfExtensions?.["KHR_materials_variants"] as { mappings: VariantMapping[] } | undefined;
    if (!mesh.isMesh || !ext) return;
    if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
    const mapping = ext.mappings.find((m) => m.variants.includes(index));
    if (!mapping) {
      mesh.material = mesh.userData.originalMaterial;
      return;
    }
    jobs.push(
      parser.getDependency("material", mapping.material).then((material) => {
        mesh.material = material;
        parser.assignFinalMaterial(mesh);
      }),
    );
  });
  await Promise.all(jobs);
}
