"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight, Search } from "lucide-react";
import { CATS } from "@/lib/data";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [{ name: "Нүүр", href: "/" }, ...CATS.map((category) => ({ ...category, href: `/category/${category.slug}` }))];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><Button variant="outline" size="icon" className="size-10 md:hidden" aria-label="Цэс болон хайлт нээх"><Menu className="size-5" /></Button></SheetTrigger>
      <SheetContent className="w-[min(360px,90vw)] overflow-y-auto p-2" side="right">
        <SheetHeader className="pt-7">
          <SheetTitle className="sr-only">Үндсэн цэс</SheetTitle>
          <Logo className="mb-3 w-fit" />
          <SheetDescription className="text-[13px] leading-6">Сонирхсон мэдээгээ хайж олоорой.</SheetDescription>
        </SheetHeader>
        <form action="/search" role="search" className="relative mx-4" onSubmit={() => setOpen(false)}>
          <Input name="q" aria-label="Мэдээ хайх" placeholder="Мэдээ хайх…" className="h-11 pr-12" />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1 size-9" aria-label="Хайх"><Search className="size-4" /></Button>
        </form>
        <nav aria-label="Гар утасны цэс" className="px-4 pb-4">
          {items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined}
            className={cn("flex items-center justify-between border-b py-4 text-[15px] font-medium", pathname === item.href ? "text-primary" : "text-foreground")}>
            {item.name}<ArrowUpRight className="size-3.5 text-muted-foreground" />
          </Link>)}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
