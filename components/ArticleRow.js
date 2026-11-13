import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Thumb from "@/components/Thumb";
import ArticleMeta from "@/components/ArticleMeta";
import { getCat } from "@/lib/data";

export default function ArticleRow({ article }) {
  return (
    <Link href={`/article/${article.id}`} className="group flex gap-4 border-b border-border py-5 last:border-0 sm:gap-6">
      <Thumb cat={article.cat} image={article.image} seed={article.id} className="h-24 w-28 shrink-0 rounded-lg sm:h-[126px] sm:w-[184px]" sizes="(max-width: 640px) 112px, 184px" />
      <div className="flex min-w-0 flex-1 flex-col items-start py-0.5">
        <span className="type-category mb-1.5 text-primary">{getCat(article.cat).name}</span>
        <h3 className="type-row-title mb-2 line-clamp-3 transition-colors group-hover:text-primary">{article.title}</h3>
        <p className="mb-3 hidden line-clamp-1 text-sm leading-6 text-muted-foreground sm:block">{article.body}</p>
        <ArticleMeta article={article} className="mt-auto" />
      </div>
      <ArrowUpRight className="mt-6 hidden size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary sm:block" />
    </Link>
  );
}
