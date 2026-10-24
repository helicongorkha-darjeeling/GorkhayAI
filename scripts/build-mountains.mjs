// Generates the low-poly Kanchenjunga range used in the hero and writes it as a
// Draco-compressed GLB to public/models/kanchenjunga.glb.
//
//   npm run build:model
//
// The range is procedural (no external assets), so it can be re-tuned here and
// regenerated. Geometry is non-indexed with one colour per face so it renders as
// crisp flat-shaded facets; normals are left out and computed in the material.
import { Document, NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/models/kanchenjunga.glb");

// Seeded PRNG so the range is identical on every build.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(seed) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const vals = Float32Array.from({ length: 256 }, () => rand() * 2 - 1);
  const fade = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const v = (x, y) => vals[perm[(x & 255) + perm[y & 255]]];
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = fade(x - xi), yf = fade(y - yi);
    return lerp(lerp(v(xi, yi), v(xi + 1, yi), xf), lerp(v(xi, yi + 1), v(xi + 1, yi + 1), xf), yf);
  };
  return (x, y, octaves = 5) => {
    let sum = 0, amp = 1, freq = 1, norm = 0;
    for (let o = 0; o < octaves; o++) {
      // Ridged noise gives sharp, glacier-carved crests.
      sum += (1 - Math.abs(noise(x * freq, y * freq))) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return sum / norm;
  };
}

const ridged = makeNoise(8586);

// Summits as seen from Darjeeling, left to right: Kabru, Kabru Dome, Talung,
// the Kanchenjunga main / central / south summits, then Pandim.
const PEAKS = [
  { x: -58, z: -42, h: 17, sx: 18, sz: 12 },
  { x: -36, z: -44, h: 21, sx: 13, sz: 11 },
  { x: -20, z: -46, h: 23, sx: 11, sz: 11 },
  { x: -3, z: -50, h: 30, sx: 14, sz: 12 },
  { x: 10, z: -49, h: 28, sx: 11, sz: 11 },
  { x: 22, z: -47, h: 25, sx: 12, sz: 11 },
  { x: 42, z: -40, h: 17, sx: 10, sz: 9 },
  { x: 66, z: -46, h: 14, sx: 18, sz: 12 },
];

function rangeHeight(x, z) {
  let h = 0;
  for (const p of PEAKS) {
    const dx = (x - p.x) / p.sx;
    const dz = (z - p.z) / p.sz;
    // Between a cone and a gaussian: defined summits on broad shoulders.
    h = Math.max(h, p.h * Math.exp(-Math.pow(dx * dx + dz * dz, 0.7) * 1.1));
  }
  // A long connecting ridge so the massif reads as one wall of snow.
  const ridge = 17 * Math.exp(-(((z + 45) / 9) ** 2)) * Math.exp(-((x / 75) ** 6));
  h = Math.max(h, ridge);
  const n = ridged(x * 0.055, z * 0.055);
  // Noise bites harder near the tops so ridgelines look glacier-cut.
  return h * (0.75 + 0.4 * n * Math.min(1, h / 18)) - 2;
}

function hillsHeight(seed, base, amp) {
  const n = makeNoise(seed);
  return (x, z) => base + amp * n(x * 0.035, z * 0.05, 3) * (0.6 + 0.4 * Math.sin(x * 0.05 + seed));
}

const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255].map((c) => c ** 2.2);
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

const SNOW = hex(0xf4f7fb);
const ICE = hex(0xc9d6ea);
const ROCK = hex(0x3a4766);
const FOREST = hex(0x16223d);
const NIGHT = hex(0x0b1428);

function rangeColor(y, slope, jitter) {
  const snowline = 7.5 + jitter * 3;
  if (y > snowline && slope < 0.88) return mix(ICE, SNOW, Math.min(1, (y - snowline) / 10));
  if (y > snowline - 3) return mix(ROCK, ICE, 0.35);
  if (y > 1) return mix(FOREST, ROCK, Math.min(1, y / 8));
  return FOREST;
}

/**
 * Builds a flat-shaded grid. Vertices inside the grid get a small jitter so the
 * facets look hand-cut rather than gridded.
 */
function buildGrid({ x0, x1, z0, z1, nx, nz, height, color, seed }) {
  const rand = mulberry32(seed);
  const pts = [];
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const edge = i === 0 || j === 0 || i === nx || j === nz;
      const jx = edge ? 0 : (rand() - 0.5) * 0.7;
      const jz = edge ? 0 : (rand() - 0.5) * 0.7;
      const x = x0 + ((i + jx) / nx) * (x1 - x0);
      const z = z0 + ((j + jz) / nz) * (z1 - z0);
      pts.push([x, height(x, z), z]);
    }
  }
  const at = (i, j) => pts[j * (nx + 1) + i];
  const positions = [];
  const colors = [];
  const pushTri = (a, b, c) => {
    // Face normal for the slope used in colouring.
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const len = Math.hypot(...n) || 1;
    const slope = 1 - Math.abs(n[1] / len);
    const cy = (a[1] + b[1] + c[1]) / 3;
    const col = color(cy, slope, rand());
    positions.push(...a, ...b, ...c);
    colors.push(...col, ...col, ...col);
  };
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
      // Alternate the diagonal for a less regular triangulation.
      if ((i + j) % 2 === 0) {
        pushTri(a, c, b);
        pushTri(b, c, d);
      } else {
        pushTri(a, c, d);
        pushTri(a, d, b);
      }
    }
  }
  return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
}

const layers = [
  {
    name: "Range",
    ...buildGrid({ x0: -110, x1: 110, z0: -80, z1: -14, nx: 110, nz: 34, height: rangeHeight, color: rangeColor, seed: 1 }),
  },
  {
    name: "HillsMid",
    ...buildGrid({
      x0: -110, x1: 110, z0: -26, z1: -6, nx: 60, nz: 8,
      height: hillsHeight(31, -3, 9),
      color: (y, s, r) => mix(NIGHT, FOREST, 0.55 + r * 0.25),
      seed: 2,
    }),
  },
  {
    name: "HillsNear",
    ...buildGrid({
      x0: -120, x1: 120, z0: -10, z1: 30, nx: 60, nz: 10,
      height: hillsHeight(77, -6, 6),
      color: (y, s, r) => mix(NIGHT, FOREST, 0.15 + r * 0.2),
      seed: 3,
    }),
  },
];

const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene("Kanchenjunga");
const material = doc.createMaterial("Terrain").setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.92).setMetallicFactor(0);

for (const layer of layers) {
  const count = layer.positions.length / 3;
  const indices = new Uint32Array(count).map((_, i) => i);
  const prim = doc
    .createPrimitive()
    .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(layer.positions).setBuffer(buffer))
    .setAttribute("COLOR_0", doc.createAccessor().setType("VEC3").setArray(layer.colors).setBuffer(buffer))
    .setIndices(doc.createAccessor().setType("SCALAR").setArray(indices).setBuffer(buffer))
    .setMaterial(material);
  const mesh = doc.createMesh(layer.name).addPrimitive(prim);
  scene.addChild(doc.createNode(layer.name).setMesh(mesh));
}

doc
  .createExtension(KHRDracoMeshCompression)
  .setRequired(true)
  .setEncoderOptions({
    method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
    encodeSpeed: 5,
    decodeSpeed: 5,
    quantizationBits: { POSITION: 14, COLOR: 8 },
  });

const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
  "draco3d.encoder": await draco3d.createEncoderModule(),
  "draco3d.decoder": await draco3d.createDecoderModule(),
});

mkdirSync(dirname(OUT), { recursive: true });
await io.write(OUT, doc);
const kb = statSync(OUT).size / 1024;
console.log(`Wrote ${OUT} (${kb.toFixed(1)} KB)`);
if (kb > 2048) throw new Error("Model exceeds the 2 MB budget");
