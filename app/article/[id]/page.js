import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ArticleReader from "@/components/ArticleReader";
import ArticleCard from "@/components/ArticleCard";
import ArticleMeta from "@/components/ArticleMeta";
import NewsBreadcrumb from "@/components/NewsBreadcrumb";
import Popular from "@/components/Popular";
import SectionHeading from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ARTICLES, getArticle, getCat } from "@/lib/data";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ id: String(article.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = getArticle(id);
  return article ? { title: article.title, description: article.body } : { title: "Мэдээ олдсонгүй" };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) notFound();
  const category = getCat(article.cat);
  const related = [...ARTICLES.filter((item) => item.cat === article.cat && item.id !== article.id), ...ARTICLES.filter((item) => item.cat !== article.cat)].slice(0, 3);

  return (
    <>
      <ScrollProgress className="z-[60] h-[3px] from-primary via-primary to-[#efa88a]" aria-hidden="true" />
      <NewsBreadcrumb items={[{ label: category.name, href: `/category/${category.slug}` }, { label: "Мэдээний дэлгэрэнгүй" }]} />
      <div className="page-columns">
        <article className="min-w-0 rounded-xl border bg-white p-5 sm:p-8">
          <Link href={`/category/${category.slug}`}><Badge variant="secondary" className="mb-5 bg-accent px-3 py-1.5 text-xs font-medium text-primary hover:bg-accent/70">{category.name}<ArrowUpRight className="ml-1 size-3" /></Badge></Link>
          <h1 className="type-page-title">{article.title}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#172234] font-heading text-base font-extrabold tracking-tight text-white">g<span className="text-primary">.</span></span>
              <div><p className="text-xs font-medium">Gogo clone</p><p className="mt-0.5 text-[11px] text-muted-foreground">Демо редакц</p></div>
            </div>
            <ArticleMeta article={article} />
          </div>
          <ArticleReader article={article} />
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <Button asChild variant="ghost" className="h-9 gap-2 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-primary"><Link href={`/category/${category.slug}`}><ArrowLeft className="size-3.5" />{category.name} · Бусад мэдээ</Link></Button>
            <span className="text-[11px] text-muted-foreground">#{category.name}</span>
          </div>
        </article>
        <Popular excludeId={article.id} />
      </div>
      <section className="mt-12 border-t pt-9">
        <SectionHeading eyebrow="Уншаад үзээрэй">Холбоотой мэдээ</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div>
      </section>
    </>
  );
}
