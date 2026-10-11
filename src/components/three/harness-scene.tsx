"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "The model inside its harness."
 * A living core (the model) sits inside a geodesic cage (the harness). Signals
 * travel the cage's edges like tool calls; two orbit rings carry the tools.
 * The whole assembly turns to face the pointer, and the core gets restless
 * when the pointer moves quickly.
 */

const SIGNAL = new THREE.Color("#c8f25c");
const VIOLET = new THREE.Color("#9b8cff");
const BONE = new THREE.Color("#f2f0ea");

const pointer = { x: 0, y: 0, speed: 0 };

/** Deterministic hash-based random in [0, 1). */
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAgitation;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vNoise;

  // 3D simplex noise (Ashima / Stefan Gustavson)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    float t = uTime * 0.35;
    float n = snoise(position * 1.3 + vec3(t, t * 0.6, -t));
    float n2 = snoise(position * 3.5 - vec3(t * 1.4));
    float disp = n * (0.055 + uAgitation * 0.12) + n2 * 0.015;
    vNoise = n;
    vec3 p = position + normal * disp;
    vPos = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const coreFragment = /* glsl */ `
  uniform vec3 uSignal;
  uniform vec3 uViolet;
  uniform float uAgitation;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vNoise;

  void main(){
    float fres = pow(1.0 - max(dot(normalize(vNormal), vView), 0.0), 3.0);
    vec3 deep = vec3(0.012, 0.012, 0.02);
    vec3 col = mix(deep, uViolet * 0.42, smoothstep(-0.5, 1.0, vNoise) * 0.6);
    // scan lines: thin latitude bands drifting upward, like a model thinking
    float bands = sin(vPos.y * 38.0 - uTime * 1.6);
    float line = smoothstep(0.965, 1.0, bands) * (0.25 + uAgitation * 0.5);
    col += uSignal * line * (0.35 + fres);
    col += mix(uViolet, uSignal, fres) * fres * (1.1 + uAgitation * 0.8);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Core() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAgitation: { value: 0 },
      uSignal: { value: SIGNAL },
      uViolet: { value: VIOLET },
    }),
    [],
  );
  useFrame((_, dt) => {
    if (!mat.current || !mesh.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    u.uAgitation.value = THREE.MathUtils.lerp(u.uAgitation.value, Math.min(pointer.speed * 18, 1), 0.05);
    mesh.current.rotation.y += dt * 0.12;
    mesh.current.rotation.x += dt * 0.05;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.92, 48]} />
      <shaderMaterial ref={mat} vertexShader={coreVertex} fragmentShader={coreFragment} uniforms={uniforms} />
    </mesh>
  );
}

/** Geodesic cage: edges + vertex nodes + signals running along edges. */
function Cage() {
  const group = useRef<THREE.Group>(null);
  const signals = useRef<THREE.InstancedMesh>(null);

  const { edges, nodes, segments } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.7, 1);
    const edgesGeo = new THREE.EdgesGeometry(geo, 1);
    const pos = edgesGeo.getAttribute("position") as THREE.BufferAttribute;
    const segs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < pos.count; i += 2) {
      segs.push([
        new THREE.Vector3().fromBufferAttribute(pos, i),
        new THREE.Vector3().fromBufferAttribute(pos, i + 1),
      ]);
    }
    // unique vertices
    const seen = new Map<string, THREE.Vector3>();
    for (const [a, b] of segs) {
      for (const v of [a, b]) seen.set(v.toArray().map((n) => n.toFixed(3)).join(","), v);
    }
    geo.dispose();
    return { edges: edgesGeo, nodes: [...seen.values()], segments: segs };
  }, []);

  const SIGNAL_COUNT = 14;
  const state = useMemo(
    () =>
      Array.from({ length: SIGNAL_COUNT }, (_, i) => ({
        seg: (i * 7) % segments.length,
        t: rand(i * 3),
        speed: 0.25 + rand(i * 3 + 1) * 0.5,
        dir: rand(i * 3 + 2) > 0.5 ? 1 : -1,
      })),
    [segments.length],
  );
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y -= dt * 0.05;
    }
    const inst = signals.current;
    if (!inst) return;
    state.forEach((s, i) => {
      s.t += dt * s.speed * (1 + pointer.speed * 20);
      if (s.t >= 1) {
        // hop to a connected edge, like a call handed to the next tool
        const end = s.dir === 1 ? segments[s.seg][1] : segments[s.seg][0];
        const candidates = segments
          .map((seg, idx) => ({ seg, idx }))
          .filter(({ seg, idx }) => idx !== s.seg && (seg[0].distanceTo(end) < 1e-3 || seg[1].distanceTo(end) < 1e-3));
        const next = candidates[Math.floor(Math.random() * candidates.length)];
        if (next) {
          s.seg = next.idx;
          s.dir = next.seg[0].distanceTo(end) < 1e-3 ? 1 : -1;
        }
        s.t = 0;
      }
      const [a, b] = segments[s.seg];
      const k = s.dir === 1 ? s.t : 1 - s.t;
      tmpV.copy(a).lerp(b, k);
      tmp.position.copy(tmpV);
      const pulse = Math.sin(s.t * Math.PI);
      tmp.scale.setScalar(0.6 + pulse * 0.8);
      tmp.updateMatrix();
      inst.setMatrixAt(i, tmp.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={BONE} transparent opacity={0.22} />
      </lineSegments>
      {nodes.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial color={BONE} transparent opacity={0.7} />
        </mesh>
      ))}
      <instancedMesh ref={signals} args={[undefined, undefined, SIGNAL_COUNT]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={SIGNAL} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Orbit({ radius, tilt, speed, tools }: { radius: number; tilt: [number, number, number]; speed: number; tools: number }) {
  const ref = useRef<THREE.Group>(null);
  const ring = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2).getPoints(160);
    return new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, p.y, 0)));
  }, [radius]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <lineLoop geometry={ring}>
          <lineBasicMaterial color={BONE} transparent opacity={0.1} />
        </lineLoop>
        {Array.from({ length: tools }, (_, i) => {
          const a = (i / tools) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <boxGeometry args={[0.07, 0.07, 0.07]} />
              <meshBasicMaterial color={i === 0 ? SIGNAL : BONE} transparent opacity={i === 0 ? 1 : 0.55} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.6, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.4, 0.04);
    pointer.speed *= 0.92;
  });
  const scale = size.width < 640 ? 0.78 : 1;
  return (
    <group ref={group} scale={scale}>
      <Core />
      <Cage />
      <Orbit radius={2.35} tilt={[1.2, 0.2, 0]} speed={0.18} tools={5} />
      <Orbit radius={2.7} tilt={[-0.6, 0.9, 0.3]} speed={-0.12} tools={3} />
    </group>
  );
}

export default function HarnessScene({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const v = Math.hypot(nx - lastX, ny - lastY) / dt;
      pointer.speed = Math.min(pointer.speed + v, 0.08);
      pointer.x = nx;
      pointer.y = ny;
      lastX = nx;
      lastY = ny;
      lastT = now;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Pauser visible={visible} />
        <Rig />
      </Canvas>
    </div>
  );
}

/** Stop rendering while the canvas is scrolled out of view. */
function Pauser({ visible }: { visible: React.RefObject<boolean> }) {
  const { setFrameloop } = useThree();
  useEffect(() => {
    const id = setInterval(() => setFrameloop(visible.current ? "always" : "demand"), 250);
    return () => clearInterval(id);
  }, [setFrameloop, visible]);
  return null;
}
