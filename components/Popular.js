import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { popular, getCat } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Popular({ excludeId }) {
  const articles = popular(7).filter((article) => article.id !== excludeId).slice(0, 5);
  return (
    <aside className="space-y-6">
      <Card className="gap-0 overflow-hidden py-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/40 px-5 py-5">
          <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="size-4 text-primary" />Их уншсан</CardTitle>
          <Badge variant="outline" className="bg-background text-[11px] font-normal text-muted-foreground">Топ 5</Badge>
        </CardHeader>
        <CardContent className="px-5 py-1">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-3 border-b py-5 last:border-0">
              <span className="min-w-7 font-heading text-[27px] font-medium leading-none tracking-tight tabular-nums text-primary/65">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-sm font-semibold leading-[1.6] transition-colors group-hover:text-primary">{article.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{getCat(article.cat).name}<span className="mx-2">·</span>{article.views.toLocaleString("en-US")} уншилт</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
      <div className="relative overflow-hidden rounded-xl bg-[#172234] p-6 text-white">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-40 rounded-full border border-white/10" />
        <span className="type-eyebrow text-white/65">Шинэ өнцөг</span>
        <h3 className="mt-4 max-w-60 text-[22px] font-semibold leading-[1.45] tracking-[-.02em]">Технологийн ертөнцөд юу болж байна?</h3>
        <p className="mt-3 text-sm leading-7 text-white/75">Шинэ санаа, шинэ боломжийг хамтдаа нээцгээе.</p>
        <Link href="/category/tech" className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-white underline-offset-4 hover:underline">Мэдээ үзэх<ArrowUpRight className="size-4 text-primary" /></Link>
      </div>
    </aside>
  );
}
