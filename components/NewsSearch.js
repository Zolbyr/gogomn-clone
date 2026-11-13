"use client";

import { useRouter } from "next/navigation";
import { Newspaper } from "lucide-react";
import ActionSearchBar from "@/components/kokonutui/action-search-bar";
import { ARTICLES, getCat } from "@/lib/data";
import { cn } from "@/lib/utils";

const items = ARTICLES.map((article) => ({
  id: String(article.id),
  label: article.title,
  icon: <Newspaper className="size-4" />,
  group: getCat(article.cat).name,
  keywords: [getCat(article.cat).name, article.body],
  href: `/article/${article.id}`,
}));

export default function NewsSearch({ className }) {
  const router = useRouter();
  return <ActionSearchBar items={items} defaultRecent={[]} shortcut label="Мэдээ хайх" placeholder="Та юу хайж байна?" className={cn("search-palette", className)}
    onSelect={(item) => router.push(item.href)} onSearch={(query) => router.push(`/search?q=${encodeURIComponent(query.trim())}`)} />;
}
