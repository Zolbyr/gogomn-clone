"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATS } from "../lib/data";

export default function Nav() {
  const path = usePathname();
  const items = [{ slug: "", name: "Нүүр", href: "/" }, ...CATS.map((c) => ({ ...c, href: `/category/${c.slug}` }))];
  return (
    <nav className="nav">
      <div className="wrap">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={path === i.href ? "on" : ""}>{i.name}</Link>
        ))}
      </div>
    </nav>
  );
}
