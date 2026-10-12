import { CanvasTexture, LinearFilter } from "three";

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** One olive sprig: a gently curving stem with narrow, alternating leaves. */
function branch(g: CanvasRenderingContext2D, rand: () => number, x: number, y: number, angle: number, length: number) {
  const steps = 26;
  const bend = (rand() - 0.5) * 0.9;
  let px = x;
  let py = y;
  let a = angle;
  g.lineCap = "round";
  for (let i = 0; i < steps; i++) {
    const seg = length / steps;
    a += bend / steps + (rand() - 0.5) * 0.06;
    const nx = px + Math.cos(a) * seg;
    const ny = py + Math.sin(a) * seg;
    g.lineWidth = 5 * (1 - i / steps) + 1.2;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(nx, ny);
    g.stroke();
    if (i > 1 && i % 2 === 0) {
      for (const side of [-1, 1]) {
        if (rand() < 0.1) continue;
        const la = a + side * (0.55 + rand() * 0.35);
        const len = 70 + rand() * 50;
        const w = 10 + rand() * 6;
        g.save();
        g.translate(nx, ny);
        g.rotate(la);
        g.beginPath();
        g.moveTo(0, 0);
        g.quadraticCurveTo(len * 0.45, -w, len, (rand() - 0.5) * 6);
        g.quadraticCurveTo(len * 0.45, w, 0, 0);
        g.fill();
        g.restore();
      }
    }
    px = nx;
    py = ny;
  }
}

/**
 * Olive-branch shadow mask. Red holds a crisp version and green a blurred one, so the
 * shader can soften shadows that fall further from the window, as real penumbrae do.
 */
export function createLeafTexture() {
  const size = 1024;
  const canvas = (w: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = w;
    return [c, c.getContext("2d", { willReadFrequently: true })!] as const;
  };

  const [crispCanvas, g] = canvas(size);
  g.fillStyle = "#000";
  g.fillRect(0, 0, size, size);
  g.fillStyle = g.strokeStyle = "#fff";
  const rand = rng(41);
  // a main bough reaching in from the upper left, sprigs from the right edge
  branch(g, rand, -40, 300, 0.32, 700);
  branch(g, rand, 120, 200, 0.75, 480);
  branch(g, rand, -20, 470, -0.12, 520);
  branch(g, rand, 200, 640, -0.5, 460);
  branch(g, rand, size + 30, 330, Math.PI - 0.35, 600);
  branch(g, rand, size + 10, 560, Math.PI + 0.2, 420);
  branch(g, rand, size + 20, 760, Math.PI - 0.1, 380);
  branch(g, rand, 640, -30, 1.85, 440);
  branch(g, rand, 380, -40, 1.25, 380);

  // Soft copy: scale down and back up a few times, a cheap blur that avoids canvas
  // filters (which fall back to very slow software paths on some browsers).
  let soft: HTMLCanvasElement = crispCanvas;
  for (const w of [256, 96, 256]) {
    const [c, cg] = canvas(w);
    cg.imageSmoothingQuality = "high";
    cg.drawImage(soft, 0, 0, w, w);
    soft = c;
  }
  const [softCanvas, sg] = canvas(size);
  sg.imageSmoothingQuality = "high";
  sg.drawImage(soft, 0, 0, size, size);

  const crisp = g.getImageData(0, 0, size, size).data;
  const blurred = sg.getImageData(0, 0, size, size).data;
  const out = g.createImageData(size, size);
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = crisp[i];
    out.data[i + 1] = blurred[i];
    out.data[i + 2] = 0;
    out.data[i + 3] = 255;
  }
  softCanvas.getContext("2d")!.putImageData(out, 0, 0);
  const tex = new CanvasTexture(softCanvas);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}
