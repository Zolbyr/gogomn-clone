import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center sm:py-28">
      <p className="font-heading text-[80px] font-extrabold leading-none tracking-tighter text-primary/20">404</p>
      <h1 className="type-section-title mt-6">Хуудас олдсонгүй</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Таны хайсан мэдээ эсвэл ангилал байхгүй байна. Нүүр хуудаснаас бусад мэдээг уншаарай.</p>
      <Button asChild className="mt-7 h-10 gap-2 px-5 text-xs"><Link href="/"><ArrowLeft className="size-3.5" />Нүүр хуудас руу</Link></Button>
    </div>
  );
}
