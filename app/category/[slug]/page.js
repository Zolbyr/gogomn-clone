import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers3 } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import NewsBreadcrumb from "@/components/NewsBreadcrumb";
import Popular from "@/components/Popular";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATS, getCat, byCat } from "@/lib/data";

export function generateStaticParams() { return CATS.map((category) => ({ slug: category.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: getCat(slug)?.name ?? "Ангилал олдсонгүй" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCat(slug);
  if (!category) notFound();
  const articles = byCat(slug);

  return (
    <>
      <NewsBreadcrumb items={[{ label: category.name }]} />
      <div className="mb-8 border-b pb-7">
        <p className="type-eyebrow mb-2.5 text-primary">Мэдээний ангилал</p>
        <div className="flex items-center gap-3"><h1 className="type-page-title">{category.name}</h1><Badge variant="secondary" className="font-normal">{articles.length} мэдээ</Badge></div>
        <nav aria-label="Бусад ангилал" className="mt-6 flex flex-wrap gap-2">
          {CATS.map((item) => <Button key={item.slug} asChild variant={slug === item.slug ? "default" : "outline"} className="h-8 rounded-full px-3.5 text-xs shadow-none"><Link aria-current={slug === item.slug ? "page" : undefined} href={`/category/${item.slug}`}>{item.name}</Link></Button>)}
        </nav>
      </div>
      <div className="page-columns">
        {articles.length ? <div className="grid gap-5 sm:grid-cols-2">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center"><Layers3 className="mx-auto mb-4 size-8 text-muted-foreground/45" /><h2 className="font-semibold">Энэ ангилалд мэдээ алга байна</h2><Button asChild variant="link" className="mt-3"><Link href="/">Бусад мэдээ үзэх</Link></Button></div>
        )}
        <Popular />
      </div>
    </>
  );
}
