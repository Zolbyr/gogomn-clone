"use client";

// Installed from https://ui.aceternity.com/registry/cloud-shader.json.
// The renderer is adapted to bound background work and release GPU resources.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CloudShaderProps = {
  className?: string;
  children?: ReactNode;
  speed?: number;
  count?: number;
  cloudColor?: string;
  skyTopColor?: string;
  skyBottomColor?: string;
  /** Maximum render rate, clamped to 1–30 FPS. */
  maxFps?: number;
  /** Maximum backing-store pixels per CSS pixel. */
  pixelRatio?: number;
  /** Maximum total pixels in the drawing buffer. */
  maxPixels?: number;
};

type UniformLocations = Record<"res" | "time" | "count" | "cloud" | "skyTop" | "skyBottom", WebGLUniformLocation | null>;

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Original cloud shader for Aceternity UI.
// Each cloud is an asymmetric envelope (dome top, flat base) filled with
// domain-warped billow noise. A second density sample above the pixel
// approximates self-shadowing. Clouds drift horizontally and wrap around.
const FRAG = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform float u_count;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  // domain-warped billow detail, moves with the cloud, evolves slowly
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one cloud and blends it over the current color
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;

  // sample density toward the sun (straight up) for self-shadowing
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);

  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);

  float alpha = smoothstep(0.02, 0.38, d);

  // silver lining on thin edges
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.10;

  // atmospheric perspective: far clouds fade into the sky
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;

  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;

  // faint haze band near the horizon
  color = mix(color, u_skyBottom * 1.06, (1.0 - smoothstep(0.0, 0.35, v_uv.y)) * 0.5);

  // soft sun glow, upper area
  vec2 sunPos = vec2(aspect * 0.78, 0.92);
  float sunDist = length(p - sunPos);
  color += vec3(1.0, 0.95, 0.82) * exp(-sunDist * sunDist * 5.0) * 0.28;

  // thin cirrus streaks, stretched horizontally, high in the sky
  float cirrusBand = smoothstep(0.55, 0.8, v_uv.y) * (1.0 - smoothstep(0.9, 1.0, v_uv.y));
  if (cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    color = mix(color, u_cloud * 0.98, wisp * 0.35);
  }

  // far layer: small, high, slow
  if (u_count > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  }
  if (u_count > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  }

  // middle layer
  if (u_count > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  }
  if (u_count > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  }

  // near layer: big, low, fast
  if (u_count > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function parseHex(color: string): [number, number, number] {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = value.match(/[\d.]+/g);
  if (rgb && rgb.length >= 3) {
    return [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255];
  }
  return [0.95, 0.95, 0.95];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const CloudShader = ({
  className,
  children,
  speed = 1,
  count = 6,
  cloudColor = "#fbf8f2",
  skyTopColor = "#3876ba",
  skyBottomColor = "#8cbfe8",
  maxFps = 24,
  pixelRatio = 1,
  maxPixels = 500_000,
}: CloudShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGLRenderingContext | null = null;
    let vert: WebGLShader | null = null;
    let frag: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let loc: UniformLocations | null = null;
    let frame = 0;
    let ready = false;
    let disposed = false;
    let inView = true;
    let dirty = true;
    let elapsed = 0;
    let lastDraw = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interval = 1000 / Math.min(30, Math.max(1, maxFps));
    const cloud = parseHex(cloudColor);
    const skyTop = parseHex(skyTopColor);
    const skyBottom = parseHex(skyBottomColor);

    const canAnimate = () => !motionQuery.matches && speed > 0;
    const isVisible = () => !document.hidden && inView;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastDraw = 0;
    };
    const release = () => {
      ready = false;
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vert) gl.deleteShader(vert);
        if (frag) gl.deleteShader(frag);
      }
      buffer = program = vert = frag = null;
    };
    const fallback = () => {
      stop();
      release();
      canvas.style.opacity = "0";
      canvas.dataset.state = "fallback";
    };

    const draw = (now: number) => {
      frame = 0;
      if (disposed || !ready || !gl || !loc || !isVisible()) return;
      if (dirty || !lastDraw || now - lastDraw >= interval - 1) {
        if (canAnimate() && lastDraw) elapsed += Math.min(now - lastDraw, 100) / 1000 * speed;
        gl.uniform1f(loc.time, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        lastDraw = now;
        dirty = false;
        canvas.style.opacity = "1";
      }
      canvas.dataset.state = canAnimate() ? "running" : "paused";
      if (canAnimate()) frame = requestAnimationFrame(draw);
    };
    const requestPaint = () => {
      if (!disposed && ready && isVisible() && !frame) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      if (!ready || !gl || !loc) return;
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      // A soft background needs far fewer pixels than foreground content.
      const scale = Math.min(window.devicePixelRatio || 1, Math.max(0.25, pixelRatio), Math.sqrt(Math.max(1, maxPixels) / (width * height)));
      const w = Math.max(1, Math.floor(width * scale));
      const h = Math.max(1, Math.floor(height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(loc.res, w, h);
      dirty = true;
      requestPaint();
    };

    const initialize = () => {
      try {
        gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: "low-power", depth: false, stencil: false });
        if (!gl) { fallback(); return; }
        vert = compile(gl, gl.VERTEX_SHADER, VERT);
        frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        if (!vert || !frag) { fallback(); return; }
        program = gl.createProgram();
        if (!program) { fallback(); return; }
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.bindAttribLocation(program, 0, "a_pos");
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { fallback(); return; }
        gl.useProgram(program);
        buffer = gl.createBuffer();
        if (!buffer) { fallback(); return; }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        loc = {
          res: gl.getUniformLocation(program, "u_res"),
          time: gl.getUniformLocation(program, "u_time"),
          count: gl.getUniformLocation(program, "u_count"),
          cloud: gl.getUniformLocation(program, "u_cloud"),
          skyTop: gl.getUniformLocation(program, "u_skyTop"),
          skyBottom: gl.getUniformLocation(program, "u_skyBottom"),
        };
        gl.uniform1f(loc.count, Math.min(6, Math.max(1, count)));
        gl.uniform3fv(loc.cloud, cloud);
        gl.uniform3fv(loc.skyTop, skyTop);
        gl.uniform3fv(loc.skyBottom, skyBottom);
        ready = true;
        resize();
      } catch { fallback(); }
    };

    const updateActivity = () => {
      stop();
      if (!ready) return;
      canvas.dataset.state = isVisible() && canAnimate() ? "running" : "paused";
      dirty = true;
      requestPaint();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      fallback();
    };
    const observer = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateActivity();
    });
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", initialize);
    document.addEventListener("visibilitychange", updateActivity);
    motionQuery.addEventListener("change", updateActivity);
    // Defer shader compilation until hydration and initial input work are idle.
    let cancelInitialization: () => void;
    if (typeof window.requestIdleCallback === "function") {
      const idle = window.requestIdleCallback(initialize, { timeout: 1500 });
      cancelInitialization = () => window.cancelIdleCallback(idle);
    } else {
      const timer = window.setTimeout(initialize, 0);
      cancelInitialization = () => window.clearTimeout(timer);
    }
    observer.observe(canvas);
    visibilityObserver.observe(canvas);

    return () => {
      disposed = true;
      cancelInitialization();
      stop();
      observer.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
      motionQuery.removeEventListener("change", updateActivity);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", initialize);
      release();
    };
  }, [speed, count, cloudColor, skyTopColor, skyBottomColor, maxFps, pixelRatio, maxPixels]);

  return (
    <div
      className={cn(
        "relative h-full min-h-80 w-full overflow-hidden",
        className,
      )}
      style={{ background: `linear-gradient(to bottom, ${skyTopColor}, ${skyBottomColor})` }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-cloud-canvas=""
        data-state="pending"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
};
