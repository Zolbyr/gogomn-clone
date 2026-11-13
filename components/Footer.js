import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import { CATS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-[#172234] text-white sm:mt-24">
      <div className="wrap py-10 sm:py-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div><Logo light /><p className="mt-4 max-w-72 text-[13px] leading-7 text-white/65">Өнөөдрийн мэдээ. Олон талын өнцөг.<br />Таны өдөр тутмын мэдээллийн хөтөч.</p></div>
          <nav aria-label="Хөл хэсгийн цэс" className="grid grid-cols-2 gap-x-12 gap-y-3 text-[13px] text-white/65 sm:grid-cols-4 sm:gap-x-8">
            {CATS.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="transition-colors hover:text-white">{category.name}</Link>)}
          </nav>
        </div>
        <div className="mt-9 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[11px] leading-6 text-white/55 sm:flex-row">
          <span>© Gogo clone · Сургалтын төсөл. Мэдээ, зургийг жишээ болгон ашиглав.</span>
          <Link href="#top" className="flex w-fit items-center gap-1.5 hover:text-white">Дээш очих<ArrowUpRight className="size-3" /></Link>
        </div>
      </div>
    </footer>
  );
}
