"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = `void main(){ gl_Position = vec4(position, 1.0); }`;

const FRAG = `
uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uScroll;

float g(vec2 uv, vec2 c, float r){
  vec2 d = uv - c;
  return exp(-(d.x*d.x + d.y*d.y) / (r * r));
}

void main(){
  float t  = uTime;
  float sc = uScroll;
  vec2  mo = uMouse;
  vec2  uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  uv.x    *= uResolution.x / uResolution.y;

  // VIOLET — groß, oben-mitte-links, langsam
  float r1 = 0.55 + sin(t*0.23 + 0.00)*0.18;
  vec2  c1 = vec2(
    -0.05 + sin(t*0.14)*0.30 + cos(t*0.09)*0.15 + mo.x*0.20 - sc*0.15,
     0.12 + cos(t*0.11)*0.24 + sin(t*0.07)*0.12 + mo.y*0.12
  );

  // YELLOW — groß, unten-links
  float r2 = 0.50 + sin(t*0.31 + 1.57)*0.16;
  vec2  c2 = vec2(
    -0.22 + sin(t*0.24+1.2)*0.26 + cos(t*0.16+0.5)*0.13 + mo.x*0.14,
    -0.20 + cos(t*0.20+0.9)*0.22 + sin(t*0.13+2.0)*0.11 + mo.y*0.16 - sc*0.12
  );

  // PINK — mittelgroß, dazwischen
  float r3 = 0.38 + sin(t*0.28 + 3.14)*0.13;
  vec2  c3 = vec2(
     0.06 + sin(t*0.19+2.1)*0.22 + cos(t*0.14+1.0)*0.11 + mo.x*0.16,
    -0.02 + cos(t*0.17+1.5)*0.18 + sin(t*0.11+3.2)*0.09 + mo.y*0.14
  );

  // CYAN — kleiner, weit rechts
  float r4 = 0.28 + sin(t*0.52 + 0.78)*0.10;
  vec2  c4 = vec2(
     0.58 + sin(t*0.40+3.3)*0.18 + cos(t*0.28+2.0)*0.09 + mo.x*0.25,
    -0.02 + cos(t*0.35+2.8)*0.15 + sin(t*0.46+4.1)*0.07 + mo.y*0.22 - sc*0.08
  );

  // ORANGE — kleiner, unten-mitte
  float r5 = 0.22 + sin(t*0.41 + 4.71)*0.08;
  vec2  c5 = vec2(
     0.05 + sin(t*0.32+4.1)*0.18 + cos(t*0.23+1.8)*0.09 + mo.x*0.10,
    -0.26 + cos(t*0.28+3.7)*0.15 + sin(t*0.19+2.5)*0.07 - sc*0.16
  );

  // GREEN — klein, rechts-unten
  float r6 = 0.18 + sin(t*0.15 + 2.36)*0.07;
  vec2  c6 = vec2(
     0.42 + sin(t*0.10+5.0)*0.16 + cos(t*0.07+2.3)*0.08 + mo.x*0.08,
    -0.30 + cos(t*0.08+4.5)*0.13 + sin(t*0.05+6.1)*0.06 - sc*0.10
  );

  r1=max(r1,0.28); r2=max(r2,0.24); r3=max(r3,0.18);
  r4=max(r4,0.12); r5=max(r5,0.10); r6=max(r6,0.08);

  float b1=g(uv,c1,r1), b2=g(uv,c2,r2), b3=g(uv,c3,r3);
  float b4=g(uv,c4,r4), b5=g(uv,c5,r5), b6=g(uv,c6,r6);

  vec3 col1=vec3(0.50,0.00,0.85);
  vec3 col2=vec3(1.00,0.82,0.00);
  vec3 col3=vec3(0.95,0.05,0.48);
  vec3 col4=vec3(0.00,0.82,0.95);
  vec3 col5=vec3(1.00,0.34,0.00);
  vec3 col6=vec3(0.00,0.88,0.38);

  // Multiply: jede Farbe dunkelt den Hintergrund ab
  vec3 col = vec3(1.0);
  col *= mix(vec3(1.0), col1, b1);
  col *= mix(vec3(1.0), col2, b2);
  col *= mix(vec3(1.0), col3, b3);
  col *= mix(vec3(1.0), col4, b4);
  col *= mix(vec3(1.0), col5, b5);
  col *= mix(vec3(1.0), col6, b6);
  col = clamp(col, 0.0, 1.0);

  float mx=max(max(max(b1,b2),max(b3,b4)),max(b5,b6));
  // Schärferer Alpha-Abfall: schwache Ränder werden transparent statt weiß
  float alpha=clamp(smoothstep(0.05, 0.40, mx)*0.90, 0.0, 0.88);

  gl_FragColor=vec4(col,alpha);
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
      alpha: true, antialias: false, premultipliedAlpha: false,
    });
    renderer.setPixelRatio(1);
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);

    const uniforms = {
      uTime:       { value: 0 },
      uResolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      uMouse:      { value: new THREE.Vector2(0,0) },
      uScroll:     { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms, transparent: true, depthWrite: false,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), mat));

    const t0=performance.now();
    let smx=0, smy=0, raf: number;

    const loop=()=>{
      raf=requestAnimationFrame(loop);
      uniforms.uTime.value=(performance.now()-t0)/1000;
      uniforms.uResolution.value.set(el.clientWidth,el.clientHeight);
      smx+=(mouseRef.current[0]-smx)*0.05;
      smy+=(mouseRef.current[1]-smy)*0.05;
      uniforms.uMouse.value.set(smx,smy);
      uniforms.uScroll.value=scrollRef.current;
      renderer.render(scene,camera);
    };
    loop();

    const ro=new ResizeObserver(()=>{
      renderer.setSize(el.clientWidth,el.clientHeight);
      uniforms.uResolution.value.set(el.clientWidth,el.clientHeight);
    });
    ro.observe(el);

    return ()=>{
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return <div ref={mountRef} style={{position:"absolute",inset:0,pointerEvents:"none"}}/>;
}
