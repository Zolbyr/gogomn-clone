"use client";

import { CloudShader, type CloudShaderProps } from "@/components/ui/cloud-shader";
import { cn } from "@/lib/utils";

// Aceternity's demo defaults, with optional overrides for the shared background.
export default function CloudShaderDemo({ className, ...props }: CloudShaderProps = {}) {
  return (
    <CloudShader className={cn("h-[40rem] w-full", className)} {...props} />
  );
}
