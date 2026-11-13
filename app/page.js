import Link from "next/link";
import { ArrowUpRight, Hash, Sparkles } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import NewsFeed from "@/components/NewsFeed";
import Popular from "@/components/Popular";
import SectionHeading from "@/components/SectionHeading";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { ARTICLES } from "@/lib/data";

export default function Home() {
  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="type-eyebrow mb-2.5 flex items-center gap-1.5 text-muted-foreground"><Sparkles className="size-3 text-primary" />Анхаарлын төвд</p>
          <h1 className="type-display">Өнөөдрийн <span className="text-primary">онцлох мэдээ</span></h1>
        </div>
        <Badge variant="outline" className="mb-1 hidden bg-white px-2.5 py-1 text-[11px] font-normal text-muted-foreground sm:inline-flex">Жишээ хувилбар</Badge>
      </div>
      <section aria-label="Онцлох мэдээнүүд" className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
        <BlurFade delay={0.05} className="h-full"><ArticleCard article={ARTICLES[0]} big priority /></BlurFade>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <BlurFade delay={0.12} className="h-full"><ArticleCard article={ARTICLES[1]} compact priority /></BlurFade>
          <BlurFade delay={0.18} className="h-full"><ArticleCard article={ARTICLES[2]} compact /></BlurFade>
        </div>
      </section>
      <div className="my-7 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border bg-white px-5 py-4 text-xs leading-6 sm:my-9">
        <span className="flex items-center gap-1.5 font-bold"><Hash className="size-3.5 text-primary" />Онцлох сэдвүүд</span>
        <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
        {[{ slug: "tech", name: "Хиймэл оюун ухаан" }, { slug: "society", name: "Улаанбаатар" }, { slug: "economy", name: "Эдийн засаг" }, { slug: "life", name: "Эрүүл амьдрал" }].map((topic) => <Link key={topic.slug} href={`/category/${topic.slug}`} className="text-muted-foreground transition-colors hover:text-primary">#{topic.name}</Link>)}
      </div>
      <div className="page-columns">
        <NewsFeed articles={ARTICLES} />
        <Popular />
      </div>
      <section className="mt-12 border-t pt-9 sm:mt-16 sm:pt-12">
        <SectionHeading eyebrow="Мэдээний цаана" aside={<Link href="/category/life" className="mb-1 inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">Амьдралын мэдээ<ArrowUpRight className="size-3.5" /></Link>}>Санал болгох мэдээ</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[ARTICLES[4], ARTICLES[6], ARTICLES[7]].map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </section>
    </>
  );
}
