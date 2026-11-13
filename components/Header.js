import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import Nav from "@/components/Nav";
import NewsSearch from "@/components/NewsSearch";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  return (
    <>
      <div className="border-b bg-white">
        <div className="wrap flex min-h-9 items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />Таны өдөр тутмын мэдээллийн хөтөч</span>
          <Link href="/#latest" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">Шинэ мэдээ<ArrowUpRight className="size-3" /></Link>
        </div>
      </div>
      <header className="bg-white">
        <div className="wrap flex items-center justify-between gap-8 py-6 sm:py-7">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden border-l pl-6 text-xs leading-7 text-muted-foreground xl:block">Мэдээлэлтэй бай.<br />Өөрийн өнцөгтэй бай.</span>
          </div>
          <NewsSearch className="hidden max-w-[350px] md:block" />
          <MobileMenu />
        </div>
      </header>
      <Nav />
    </>
  );
}
