import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Thumb from "@/components/Thumb";
import ArticleMeta from "@/components/ArticleMeta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCat } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ArticleCard({ article, big = false, compact = false, priority = false }) {
  const category = getCat(article.cat);
  if (big) {
    return (
      <Card className="h-full overflow-hidden border-0 bg-[#172234] py-0 text-white shadow-none">
        <Link href={`/article/${article.id}`} className="group relative isolate flex min-h-[440px] h-full flex-col justify-end overflow-hidden rounded-xl sm:min-h-[510px]">
          <Thumb cat={article.cat} image={article.image} seed={article.id} big priority={priority} className="absolute inset-0 h-full rounded-none" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101b2b] via-[#101b2b]/25 to-transparent" />
          <div className="relative p-6 sm:p-9">
            <Badge className="mb-4 border-0 bg-primary px-3 py-1 text-[11px] font-medium text-white">{category.name}</Badge>
            <h2 className="type-feature-title max-w-[590px]">{article.title}</h2>
            <p className="mt-3 hidden max-w-lg text-[15px] leading-7 text-white/80 sm:block">{article.body}</p>
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
              <ArticleMeta article={article} className="text-white/80" />
              <span className="flex size-9 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-primary group-hover:bg-primary"><ArrowUpRight className="size-4" /></span>
            </div>
          </div>
        </Link>
      </Card>
    );
  }
  return (
    <Card className="h-full gap-0 overflow-hidden py-0 shadow-none transition-colors hover:border-primary/30">
      <Link href={`/article/${article.id}`} className="group flex h-full flex-col">
        <Thumb cat={article.cat} image={article.image} seed={article.id} priority={priority} className={cn(compact && "aspect-[2.45/1]")} />
        <CardContent className={cn("flex flex-1 flex-col p-5", compact && "p-4")}>
          <span className="type-category mb-2.5 text-primary">{category.name}</span>
          <h3 className={cn("type-card-title mb-4 transition-colors group-hover:text-primary", compact && "type-card-title-compact mb-3")}>{article.title}</h3>
          <ArticleMeta article={article} className="mt-auto" />
        </CardContent>
      </Link>
    </Card>
  );
}
