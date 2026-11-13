"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ArrowUpRight } from "lucide-react";
import { CATS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Nav() {
  const pathname = usePathname();
  const items = [{ slug: "", name: "Нүүр", href: "/" }, ...CATS.map((category) => ({ ...category, href: `/category/${category.slug}` }))];
  return (
    <nav aria-label="Үндсэн цэс" className="sticky top-0 z-40 border-y bg-white/95 backdrop-blur-md">
      <div className="wrap flex items-stretch justify-between gap-6">
        <div className="flex min-w-0 items-stretch gap-5 overflow-x-auto sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}
              className={cn("relative flex shrink-0 items-center gap-1.5 py-4 text-[13px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-t-full hover:text-primary", pathname === item.href ? "text-primary after:bg-primary" : "text-muted-foreground")}>
              {!item.slug && <House className="size-3.5" />}{item.name}
            </Link>
          ))}
        </div>
        <Link href="/#latest" className="hidden shrink-0 items-center gap-2 border-l pl-5 text-[13px] font-semibold hover:text-primary lg:flex">Мэдээний тойм<ArrowUpRight className="size-3.5" /></Link>
      </div>
    </nav>
  );
}
