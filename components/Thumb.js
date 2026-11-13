"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getCat } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Thumb({ cat, image, seed, big = false, tag = false, alt = "", className, priority = false, sizes }) {
  const category = getCat(cat);
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("news-image relative isolate aspect-[16/10] w-full overflow-hidden bg-muted", big && "aspect-[16/9]", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${category?.colors[0] ?? "#172234"}, ${category?.colors[1] ?? "#50617a"})` }}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/60" role="img" aria-label={alt || "Зураг ачаалагдсангүй"}><ImageOff className="size-8" /></div>
      ) : (
        <Image src={image ?? "/images/ulaanbaatar-winter.jpg"} alt={alt} fill priority={priority}
          sizes={sizes ?? (big ? "(max-width: 1024px) 100vw, 780px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px")}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none" onError={() => setFailed(true)} />
      )}
      {tag && category && <Badge className="absolute bottom-4 left-4 border-white/15 bg-white/90 text-foreground backdrop-blur-sm">{category.name}</Badge>}
    </div>
  );
}
