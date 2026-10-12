import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function finish(canvas: HTMLCanvasElement, repeat: [number, number]) {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(...repeat);
  tex.anisotropy = 8;
  return tex;
}

/** Long wide-plank floorboards with per-board tone and grain variation. */
export function plankTexture(base: [number, number, number], seed = 7) {
  const rand = seeded(seed);
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  const rows = 8;
  const h = c.height / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand() * 600;
    while (x < c.width) {
      const len = 500 + rand() * 500;
      const k = 0.82 + rand() * 0.3;
      g.fillStyle = `rgb(${base[0] * k},${base[1] * k},${base[2] * k})`;
      g.fillRect(x, r * h, len, h);
      for (let i = 0; i < 26; i++) {
        const y = r * h + rand() * h;
        g.strokeStyle = `rgba(0,0,0,${0.03 + rand() * 0.07})`;
        g.lineWidth = 0.6 + rand() * 1.6;
        g.beginPath();
        g.moveTo(x, y);
        g.bezierCurveTo(x + len * 0.3, y + rand() * 6 - 3, x + len * 0.6, y + rand() * 6 - 3, x + len, y + rand() * 4 - 2);
        g.stroke();
      }
      g.fillStyle = "rgba(0,0,0,0.45)";
      g.fillRect(x, r * h, 2, h);
      x += len;
    }
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.fillRect(0, r * h, c.width, 2);
  }
  return finish(c, [6, 6]);
}

/** Soft veined marble slab. */
export function marbleTexture(base: string, vein: string, seed = 3, repeat = 1) {
  const rand = seeded(seed);
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 90; i++) {
    g.strokeStyle = vein;
    g.globalAlpha = 0.04 + rand() * 0.22;
    g.lineWidth = 0.5 + rand() * 3;
    g.beginPath();
    let x = rand() * c.width;
    let y = rand() * c.height;
    g.moveTo(x, y);
    for (let s = 0; s < 14; s++) {
      x += 30 + rand() * 70;
      y += rand() * 70 - 25;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  return finish(c, [repeat, repeat]);
}
