import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, light = false }) {
  return (
    <Link href="/" aria-label="Gogo clone — нүүр хуудас" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("font-heading text-[35px] font-extrabold leading-none tracking-[-.06em]", light ? "text-white" : "text-foreground")}>
        gogo<span className="text-primary">.</span>
      </span>
      <span className={cn("mt-1 border-l pl-2.5 text-[11px] font-medium uppercase tracking-[.14em]", light ? "border-white/20 text-white/50" : "border-border text-muted-foreground")}>clone</span>
    </Link>
  );
}
