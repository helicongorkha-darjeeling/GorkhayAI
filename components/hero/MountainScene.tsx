"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroStore } from "@/lib/heroStore";

const MODEL_URL = "/models/kanchenjunga.glb";
const DRACO_PATH = "/draco/";
const SUN_DIR = new THREE.Vector3(0.75, 0.12, -0.65);

/* ------------------------------------------------------------------ Sky -- */

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Dawn gradient: night navy overhead, a band of rose and ember on the horizon,
// strongest towards the (still hidden) sun on the right.
const skyFragment = /* glsl */ `
  uniform vec3 uSunDir;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 zenith = vec3(0.012, 0.027, 0.075);
    vec3 mid = vec3(0.07, 0.11, 0.24);
    vec3 rose = vec3(0.62, 0.33, 0.42);
    vec3 ember = vec3(1.0, 0.56, 0.28);
    float sun = pow(max(dot(normalize(vDir), uSunDir), 0.0), 3.0);
    vec3 col = mix(mid, zenith, smoothstep(0.05, 0.55, h));
    float horizon = (1.0 - smoothstep(-0.02, 0.22, h)) * smoothstep(-0.12, 0.0, h);
    col = mix(col, rose, horizon * (0.5 + 0.5 * sun));
    col = mix(col, ember, horizon * horizon * sun * 0.9);
    col += ember * pow(sun, 8.0) * 0.35 * (1.0 - smoothstep(0.0, 0.3, h));
    // Below the horizon fade to night so nothing glows under the hills.
    col = mix(col, zenith, 1.0 - smoothstep(-0.15, 0.0, h));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky({ sunDir }: { sunDir: THREE.Vector3 }) {
  const uniforms = useMemo(() => ({ uSunDir: { value: sunDir.clone().normalize() } }), [sunDir]);
  return (
    <mesh scale={400} renderOrder={-1}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------- Terrain -- */

function Range() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.92,
      metalness: 0,
    });
    // Alpenglow: the summits catch first light before the valleys do. Slopes
    // facing the low sun are graded warmer with height; the valleys stay blue.
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;")
        .replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWorldNormal = normalize(mat3(modelMatrix) * objectNormal);",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;",
        )
        .replace(
          "#include <opaque_fragment>",
          `float glowH = smoothstep(7.0, 26.0, vWorldPos.y);
          float facing = clamp(dot(normalize(vWorldNormal), normalize(vec3(0.85, 0.35, 0.4))), 0.0, 1.0);
          vec3 glowCol = mix(vec3(1.0, 0.42, 0.45), vec3(1.0, 0.70, 0.45), glowH);
          float k = glowH * (0.35 + 0.65 * facing);
          outgoingLight = mix(outgoingLight, outgoingLight * vec3(1.65, 0.88, 0.7) + glowCol * 0.16, k);
          #include <opaque_fragment>`,
        );
    };
    return m;
  }, []);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = material;
        mesh.geometry.computeVertexNormals();
      }
    });
  }, [scene, material]);

  return <primitive object={scene} />;
}

/* ------------------------------------------------------------------ Fog -- */

function makeCloudTexture(seed: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size * 2;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 26; i++) {
    const x = size * 0.2 + rand() * size * 1.6;
    const y = size * 0.45 + (rand() - 0.5) * size * 0.35;
    const r = size * (0.12 + rand() * 0.22);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(220,228,245,0.22)");
    g.addColorStop(1, "rgba(220,228,245,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Feather every edge so planes never show a hard border.
  ctx.globalCompositeOperation = "destination-in";
  const fadeY = ctx.createLinearGradient(0, 0, 0, size);
  fadeY.addColorStop(0, "rgba(0,0,0,0)");
  fadeY.addColorStop(0.35, "rgba(0,0,0,1)");
  fadeY.addColorStop(0.65, "rgba(0,0,0,1)");
  fadeY.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fadeY;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const fadeX = ctx.createLinearGradient(0, 0, canvas.width, 0);
  fadeX.addColorStop(0, "rgba(0,0,0,0)");
  fadeX.addColorStop(0.15, "rgba(0,0,0,1)");
  fadeX.addColorStop(0.85, "rgba(0,0,0,1)");
  fadeX.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fadeX;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const FOG_LAYERS = [
  { z: -30, y: 2, scale: [150, 22], speed: 0.35, depth: 0.4, opacity: 0.4, seed: 11 },
  { z: -16, y: -1, scale: [130, 18], speed: -0.5, depth: 0.8, opacity: 0.35, seed: 23 },
  { z: -4, y: -3, scale: [110, 14], speed: 0.7, depth: 1.4, opacity: 0.3, seed: 37 },
] as const;

function FogBanks() {
  const textures = useMemo(() => FOG_LAYERS.map((l) => makeCloudTexture(l.seed)), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const { pointer } = heroStore;
    FOG_LAYERS.forEach((layer, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      // Slow drift plus a pointer-driven parallax that is stronger up close.
      const target = Math.sin(t * 0.03 * layer.speed + i) * 10 - pointer.x * 6 * layer.depth;
      mesh.position.x += (target - mesh.position.x) * 0.03;
      mesh.position.y += (layer.y - pointer.y * 1.5 * layer.depth - mesh.position.y) * 0.03;
    });
  });

  return (
    <group>
      {FOG_LAYERS.map((layer, i) => (
        <mesh
          key={layer.seed}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={[0, layer.y, layer.z]}
          renderOrder={2 + i}
        >
          <planeGeometry args={[layer.scale[0], layer.scale[1]]} />
          <meshBasicMaterial
            map={textures[i]}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------ Particles -- */

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Rise slowly and wrap, with a gentle sway.
    p.y = mod(p.y + uTime * (0.25 + aSeed * 0.5), 34.0) - 4.0;
    p.x += sin(uTime * 0.2 + aSeed * 40.0) * 1.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    // Push particles away from the pointer in screen space.
    vec2 ndc = clip.xy / clip.w;
    vec2 away = ndc - uPointer;
    float d = length(away);
    float push = smoothstep(0.35, 0.0, d) * 0.12;
    clip.xy += normalize(away + 1e-4) * push * clip.w;
    gl_Position = clip;
    gl_PointSize = (2.0 + aSeed * 4.0) * uPixelRatio * (30.0 / -mv.z);
    vAlpha = (0.35 + 0.65 * aSeed) * (0.6 + 0.6 * smoothstep(0.35, 0.0, d));
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(1.0, 0.86, 0.72, a);
  }
`;

function makeParticleGeometry(count: number) {
  // Seeded so the field is the same on every render.
  let s = 1234567;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 120;
    pos[i * 3 + 1] = rand() * 34;
    pos[i * 3 + 2] = -30 + rand() * 55;
    seed[i] = rand();
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

function Particles({ count }: { count: number }) {
  const { gl } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => makeParticleGeometry(count), [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    const ptr = u.uPointer.value as THREE.Vector2;
    ptr.x += (heroStore.pointer.x - ptr.x) * 0.08;
    ptr.y += (heroStore.pointer.y - ptr.y) * 0.08;
  });

  return (
    <points geometry={geometry} renderOrder={10} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ----------------------------------------------------------- Camera rig -- */

const CAMERA_START = new THREE.Vector3(0, 7, 40);
const CAMERA_END = new THREE.Vector3(-14, 15, 6);
const LOOK_START = new THREE.Vector3(0, 13, -45);
const LOOK_END = new THREE.Vector3(6, 18, -48);

// Scratch vectors reused every frame.
const pos = new THREE.Vector3();
const target = new THREE.Vector3();
const look = LOOK_START.clone();

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const s = heroStore.scroll;
    const { pointer } = heroStore;
    const t = clock.elapsedTime;
    // Scroll pushes the camera up the valley towards the massif; a slow idle
    // orbit and the pointer add a little life on top.
    pos.lerpVectors(CAMERA_START, CAMERA_END, s);
    pos.x += Math.sin(t * 0.05) * 2 + pointer.x * 2.5;
    pos.y += Math.cos(t * 0.04) * 0.6 + pointer.y * 1.2;
    camera.position.lerp(pos, 0.05);
    target.lerpVectors(LOOK_START, LOOK_END, s);
    look.lerp(target, 0.05);
    camera.lookAt(look);
  });

  return null;
}

/* ---------------------------------------------------------------- Scene -- */

/** Fires once a few frames after the model is on screen, so the poster can fade out. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 4) onReady();
  });
  return null;
}

export function MountainScene({ particleCount, onReady }: { particleCount: number; onReady: () => void }) {
  return (
    <>
      <fogExp2 attach="fog" args={["#1b2747", 0.0062]} />
      <Sky sunDir={SUN_DIR} />
      <hemisphereLight args={["#5d74ad", "#0a1428", 0.5]} />
      {/* Alpenglow: a low, warm key light raking the east faces. */}
      <directionalLight position={[90, 18, 20]} intensity={4.8} color="#ffa985" />
      <directionalLight position={[-60, 40, 40]} intensity={0.35} color="#9db4ff" />
      <Range />
      <FogBanks />
      <Particles count={particleCount} />
      <CameraRig />
      <ReadySignal onReady={onReady} />
    </>
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);
