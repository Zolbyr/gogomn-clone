"use client";

import dynamic from "next/dynamic";

// Split the renderer into its own chunk. WebGL starts only in its client effect;
// retaining SSR also keeps Next.js not-found rendering intact.
const CloudShaderDemo = dynamic(() => import("@/components/cloud-shader-demo"));

export default function CloudBackground() {
  return (
    <div aria-hidden="true" data-site-background className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-linear-to-b from-[#397fbc] to-[#b2d5ef]">
      <CloudShaderDemo className="absolute inset-0 h-full min-h-0" speed={0.5} count={6} cloudColor="#fffdf7" skyTopColor="#397fbc" skyBottomColor="#b2d5ef" maxFps={24} pixelRatio={0.75} maxPixels={450_000} />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/15" />
    </div>
  );
}
