// Fragment shader for the homepage hero: late-afternoon sun falling through an arched
// window onto a lime-plaster wall and stone floor, with soft olive-leaf shadows, a dusty
// light shaft and a slow day-to-night shift driven by scroll.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;   // 0 = day, 1 = night
  uniform float uOpen;     // 0..1 shutter opening on load
  uniform vec2 uMouse;     // -1..1, eased
  uniform sampler2D uLeaves; // r = crisp leaf mask, g = blurred leaf mask

  // ---------- noise ----------
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }

  // ---------- window ----------
  // Arched window in its own space: half-width 0.5, sill at y=-1, arch springs at y=0.35.
  float sdArch(vec2 q) {
    if (q.y > 0.35) return length(q - vec2(0.0, 0.35)) - 0.5;
    vec2 d = vec2(abs(q.x) - 0.5, -(q.y + 1.0));
    return max(d.x, d.y);
  }
  float mullions(vec2 q) {
    float t = 0.028;
    float v = abs(q.x) - t;
    float h1 = abs(q.y - 0.35) - t;
    float h2 = abs(q.y + 0.32) - t;
    // two radial glazing bars in the arch
    vec2 a = q - vec2(0.0, 0.35);
    float r = q.y > 0.35 ? min(abs(dot(a, normalize(vec2(0.7, -0.7)))), abs(dot(a, normalize(vec2(0.7, 0.7))))) - t * 0.8 : 1.0;
    return min(min(v, min(h1, h2)), r);
  }

  // Light reaching a point given in window space. pen = penumbra width.
  float windowLight(vec2 q, float pen, float open) {
    float body = smoothstep(pen, -pen, sdArch(q));
    float bars = smoothstep(-pen * 0.8, pen * 0.8, mullions(q));
    // shutters fold open from the centre outwards
    float shutter = smoothstep(open * 0.62 - 0.08, open * 0.62, abs(q.x)) ;
    return body * bars * (1.0 - shutter);
  }

  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    // gentle camera parallax
    p += uMouse * vec2(0.008, 0.005);

    float night = smoothstep(0.08, 0.75, uScroll);
    // the lamp is switched on once the sun has gone
    float lampOn = smoothstep(0.55, 0.72, uScroll);
    float floorY = -0.31;
    bool isFloor = p.y < floorY;

    // Patch placement drifts like the sun moving, and sinks as day turns to night.
    // on portrait screens the patch moves up and centre, above the headline
    float portrait = smoothstep(1.1, 0.7, aspect);
    vec2 c = mix(vec2(0.36, 0.0), vec2(0.06, 0.16), portrait);
    c += vec2(sin(uTime * 0.035) * 0.012, -night * 0.04);
    c += uMouse * vec2(0.012, 0.006);
    float shear = 0.30 + night * 0.18;
    vec2 scale = mix(vec2(0.25, 0.30), vec2(0.19, 0.25), portrait);

    // Project the point onto the "virtual wall": floor points fold up into the wall plane.
    vec2 pw = p;
    if (isFloor) {
      float d = floorY - p.y;
      pw = vec2(p.x - d * 1.1, floorY - d * 1.6);
    }
    vec2 q = pw - c;
    q.x -= q.y * shear;
    q /= scale;

    // Penumbra widens with distance from the opening (bottom of the patch and the floor).
    float pen = 0.025 + 0.05 * clamp((0.35 - q.y) / 1.4, 0.0, 1.0) + (isFloor ? 0.05 : 0.0);
    float light = windowLight(q, pen, uOpen);

    // Olive-leaf shadows: an olive tree outside, swaying in a soft breeze.
    vec2 luv = q * vec2(0.42, 0.26) + vec2(0.5, 0.42);
    float sway = sin(uTime * 0.55 + luv.y * 4.0) * 0.006 + sin(uTime * 0.23) * 0.01;
    luv += vec2(sway, sway * 0.4) + uMouse * 0.004;
    vec2 leaves = texture2D(uLeaves, luv).rg;
    float blurMix = clamp((0.35 - q.y) / 1.2, 0.0, 1.0);
    float leaf = mix(leaves.r, leaves.g, 0.35 + 0.65 * blurMix);
    light *= 1.0 - 0.82 * leaf;

    // Brighter towards the arch, a touch of falloff at the sill.
    light *= 0.85 + 0.25 * smoothstep(-1.0, 0.6, q.y);

    // ---------- materials ----------
    vec2 tp = isFloor ? vec2(p.x, (floorY - p.y) * 3.0) : p;
    // limewash: broad cloudy variation plus a fine trowelled relief
    float cloud = fbm(tp * 1.6 + 3.0);
    float h = fbm(tp * 9.0);
    float e = 0.004;
    float hx = fbm((tp + vec2(e, 0.0)) * 9.0);
    float hy = fbm((tp + vec2(0.0, e)) * 9.0);
    vec3 n = normalize(vec3(-(hx - h) / e * 0.010, -(hy - h) / e * 0.010, 1.0));
    vec3 L = normalize(vec3(-0.75, 0.55, 0.35));
    float grazing = clamp(0.80 + 0.9 * (dot(n, L) - L.z), 0.55, 1.3);

    vec3 plaster = mix(vec3(0.56, 0.50, 0.43), vec3(0.70, 0.64, 0.56), smoothstep(0.25, 0.75, cloud));
    plaster *= 0.94 + 0.10 * h;
    // dark microcement floor
    vec3 stone = mix(vec3(0.17, 0.155, 0.14), vec3(0.24, 0.22, 0.20), smoothstep(0.3, 0.7, fbm(tp * 2.2)));
    vec3 albedo = isFloor ? stone : plaster;

    // ---------- lighting ----------
    vec3 sunCol = mix(vec3(1.0, 0.80, 0.58), vec3(1.0, 0.62, 0.38), smoothstep(0.0, 0.35, uScroll));
    float sun = 1.75 * (1.0 - night) * uOpen;
    vec3 moonCol = vec3(0.50, 0.63, 0.76);
    float moon = 0.30 * night;

    float dc = length((p - c) * vec2(0.8, 1.0));
    vec3 bounce = sunCol * (0.16 * exp(-dc * dc * 5.0) + 0.03) * sun;
    vec3 ambient = mix(vec3(0.020, 0.019, 0.018), vec3(0.012, 0.015, 0.020), night);
    // at night a lamp with a drum shade, off to the left, throws its classic double cone
    vec2 lp = p - vec2(-0.5 * aspect + mix(0.16, 0.0, portrait), 0.16);
    float soft = 0.025 + 0.12 * abs(lp.y);
    float spread = abs(lp.x) - (abs(lp.y) * 0.42 + 0.055);
    float cone = smoothstep(soft, -soft, spread) * smoothstep(0.0, 0.035, abs(lp.y));
    float lampFall = exp(-(lp.x * lp.x * 3.0 + lp.y * lp.y * 10.0)) * (lp.y > 0.0 ? 1.0 : 0.6);
    vec3 lamp = vec3(1.0, 0.60, 0.32) * (0.55 * cone * lampFall + 0.06 * exp(-dot(lp, lp) * 3.0)) * lampOn;

    vec3 col = albedo * (ambient + bounce * (isFloor ? 1.6 : 1.0) + lamp * grazing);
    col += albedo * light * grazing * (sunCol * sun + moonCol * moon);

    // contact shadow in the corner where wall meets floor
    float corner = smoothstep(0.06, 0.0, abs(p.y - floorY));
    col *= 1.0 - 0.45 * corner;
    // polished stone picks up a soft reflection of the patch
    if (isFloor) {
      vec2 rq = vec2(p.x, 2.0 * floorY - p.y) - c;
      rq.x -= rq.y * shear; rq /= scale;
      float refl = windowLight(rq, 0.25, uOpen);
      col += refl * sunCol * sun * 0.05 * smoothstep(0.32, 0.0, floorY - p.y);
      col += refl * moonCol * moon * 0.05 * smoothstep(0.32, 0.0, floorY - p.y);
    }

    // ---------- light shaft and dust ----------
    vec2 S = c + vec2(-1.25, 1.05);
    vec2 sd = c - S;
    float t = clamp(dot(p - S, sd) / dot(sd, sd), 0.0, 1.2);
    float perp = length(p - (S + sd * t));
    float width = 0.05 + 0.13 * t;
    float shaft = exp(-perp * perp / (width * width)) * smoothstep(0.15, 0.6, t) * smoothstep(1.05, 0.85, t);
    float haze = 0.6 + 0.4 * fbm(p * 3.0 + vec2(uTime * 0.03, -uTime * 0.02));
    col += sunCol * shaft * haze * 0.07 * sun;

    // dust motes drifting through the shaft
    vec2 gp = p * 38.0 + vec2(uTime * 0.25, uTime * 0.12);
    vec2 cell = floor(gp);
    vec2 fp = fract(gp) - 0.5;
    float rnd = hash(cell);
    vec2 off = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
    off += 0.15 * vec2(sin(uTime * 0.7 + rnd * 6.28), cos(uTime * 0.5 + rnd * 6.28));
    float mote = smoothstep(0.09, 0.0, length(fp - off * 0.7)) * step(0.94, rnd) * (0.3 + 0.7 * hash(cell + 1.3));
    col += sunCol * mote * shaft * shaft * 0.3 * sun;

    // ---------- finish ----------
    col = aces(col * 1.15);
    col = pow(col, vec3(1.0 / 2.2));
    // vignette
    vec2 v = vUv - 0.5;
    col *= 1.0 - 0.55 * dot(v, v) * 1.6;
    // fine film grain
    float g = hash(vUv * uRes + fract(uTime * 13.0) * 100.0) - 0.5;
    col += g * 0.028;
    gl_FragColor = vec4(col, 1.0);
  }
`;
