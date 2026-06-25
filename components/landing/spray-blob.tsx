"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// vUv is passed from vertex → fragment; (0.5, 0.5) = exact screen centre always
const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uScroll;

float g(vec2 p, vec2 c, float r) {
  float asp = uResolution.x / uResolution.y;
  vec2 d = (p - c) * vec2(asp, 1.0);
  return exp(-dot(d, d) / (r * r));
}

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 17.31);
  return fract(p.x * p.y);
}

float filmGrain(vec2 px, float t) {
  float g1 = hash(px + fract(t * 7.317));
  float g2 = hash(px * 0.713 + fract(t * 3.141));
  float g3 = hash(px * 1.337 + fract(t * 11.23));
  return (g1 * 0.50 + g2 * 0.35 + g3 * 0.15) - 0.5;
}

// Returns multiply-blend color for the full blob cluster at time te.
// fade: 1.0 = full, <1.0 = trail ghost (pulled toward white)
vec3 cluster(vec2 p, float te, vec2 mo, float sc, float fade) {
  float py1 = sc * 0.28;
  float py2 = sc * 0.13;
  float py3 = sc * 0.20;

  // Negative parallax: blobs swell when scrolled to top (sc→0), shrink when scrolled down
  float grow = 1.0 - sc;

  float r1 = 0.257 + grow * 0.140 + sin(te * 0.71) * 0.062;
  vec2  c1 = vec2(
    0.50 + cos(te * 0.61) * 0.080 + mo.x * 0.05,
    0.52 - sin(te * 0.61) * 0.068 + sin(te * 0.43) * 0.028 + mo.y * 0.04 + py1
  );

  float r2 = 0.228 + grow * 0.090 + sin(te * 0.59 + 1.1) * 0.054;
  vec2  c2 = vec2(
    0.50 - cos(te * 0.53 + 1.5) * 0.076 + mo.x * 0.04,
    0.47 + sin(te * 0.53 + 1.5) * 0.064 + mo.y * 0.03 + py2
  );

  float r3 = 0.143 + grow * 0.060 + sin(te * 0.83 + 2.1) * 0.038;
  vec2  c3 = vec2(
    0.50 + sin(te * 0.69 + 2.5) * 0.072 + mo.x * 0.03,
    0.50 + cos(te * 0.61 + 1.8) * 0.058 + mo.y * 0.02 + py3
  );

  // Cyan + lime: right side of cluster, not at corner
  float r4 = 0.152 + grow * 0.050 + sin(te * 0.58 + 0.6) * 0.038;
  vec2  c4 = vec2(
    0.66 + sin(te * 0.49 + 3.0) * 0.055 + mo.x * 0.04,
    0.60 + cos(te * 0.44 + 2.0) * 0.050 + mo.y * 0.03
  );

  float r5 = 0.114 + grow * 0.030 + sin(te * 0.66 + 3.6) * 0.030;
  vec2  c5 = vec2(
    0.72 + sin(te * 0.957 + 4.1) * 0.046 + mo.x * 0.03,
    0.64 + cos(te * 0.952 + 39.2) * 0.042 + mo.y * 0.03
  );

  float b1 = g(p, c1, r1);
  float b2 = g(p, c2, r2);
  float b3 = g(p, c3, r3);
  float b4 = g(p, c4, r4);
  float b5 = g(p, c5, r5);

  float w = 0.32 * fade;
  vec3 col = vec3(1.0);
  col *= mix(vec3(1.0), vec3(0.50, 0.00, 1.00), b1 * w);
  col *= mix(vec3(1.0), vec3(1.00, 0.82, 0.00), b2 * w);
  col *= mix(vec3(1.0), vec3(1.00, 0.06, 0.74), b3 * w);
  col *= mix(vec3(1.0), vec3(0.00, 0.94, 1.00), b4 * w);
  col *= mix(vec3(1.0), vec3(0.52, 1.00, 0.16), b5 * w);
  return col;
}

void main() {
  vec2  p  = vUv;
  float t  = uTime;
  vec2  mo = uMouse;
  float sc = uScroll;

  // ── TRAIL: ghost frames layered oldest→newest ────────────────────────────
  // Each step 0.22s in the past, fading to white (invisible via multiply)
  vec3 col = vec3(1.0);
  col *= cluster(p, t - 0.66, mo * 0.5, sc, 0.18); // oldest ghost
  col *= cluster(p, t - 0.44, mo * 0.7, sc, 0.35);
  col *= cluster(p, t - 0.22, mo * 0.85, sc, 0.60);
  col *= cluster(p, t,        mo,        sc, 1.00); // current, full

  // ── FILM GRAIN ───────────────────────────────────────────────────────────
  vec2 px = vUv * uResolution;
  float grain = filmGrain(px, t);
  float presence = .50 - min(col.r, min(col.g, col.b));
  col += grain * mix(0.12, 0.32, presence);
  col  = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.40);
}
`;

export function SprayBlob({
  mouseRef,
  scrollRef,
}: {
  mouseRef: React.MutableRefObject<[number, number]>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0xffffff, 1);
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // uResolution only used for aspect ratio — CSS pixels are fine here
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(el.clientWidth, el.clientHeight),
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: false,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    const t0 = performance.now();
    let smx = 0,
      smy = 0,
      raf: number;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      uniforms.uTime.value = (performance.now() - t0) / 1000;
      uniforms.uResolution.value.set(el.clientWidth, el.clientHeight);
      smx += (mouseRef.current[0] - smx) * 0.36;
      smy += (mouseRef.current[1] - smy) * 0.46;
      uniforms.uMouse.value.set(smx, smy);
      uniforms.uScroll.value = scrollRef.current;
      renderer.render(scene, camera);
    };
    loop();

    const ro = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      uniforms.uResolution.value.set(el.clientWidth, el.clientHeight);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: "multiply",
      }}
    />
  );
}
