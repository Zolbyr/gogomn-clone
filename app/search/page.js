import Link from "next/link";
import { Search, SearchX, ArrowUpRight } from "lucide-react";
import ArticleRow from "@/components/ArticleRow";
import NewsBreadcrumb from "@/components/NewsBreadcrumb";
import Popular from "@/components/Popular";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { search } from "@/lib/data";

export const metadata = { title: "Мэдээ хайх" };

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q ?? "").trim();
  const results = q ? search(q) : [];
  return (
    <>
      <NewsBreadcrumb items={[{ label: "Хайлт" }]} />
      <div className="page-columns">
        <section>
          <p className="type-eyebrow mb-2.5 text-primary">Хайж, олж, уншаарай</p>
          <h1 className="type-page-title">Мэдээ хайх</h1>
          <form action="/search" role="search" className="relative mt-6 flex gap-2">
            <label htmlFor="news-query" className="sr-only">Хайх үг</label>
            <div className="relative flex-1"><Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" /><Input id="news-query" name="q" defaultValue={q} placeholder="Сонирхсон сэдвээ бичээрэй…" className="h-11 bg-white pl-10 text-base md:text-sm" /></div>
            <Button type="submit" className="h-11 px-5 text-xs">Хайх</Button>
          </form>
          <div className="mt-7 flex items-start justify-between gap-3 border-b pb-4">
            <h2 className="min-w-0 break-words text-sm font-semibold">{q ? `“${q}” хайлтын үр дүн` : "Түлхүүр үгээр хайх"}</h2>
            {q && <span className="shrink-0 text-xs text-muted-foreground">{results.length} мэдээ</span>}
          </div>
          {results.length ? results.map((article) => <ArticleRow key={article.id} article={article} />) : (
            <Card className="mt-6 items-center border border-dashed bg-white px-6 py-16 text-center shadow-none ring-0">
              {q ? <SearchX className="size-9 text-muted-foreground/40" /> : <Search className="size-9 text-muted-foreground/40" />}
              <h3 className="mt-1 text-base font-semibold">{q ? "Тохирох мэдээ олдсонгүй" : "Та юу сонирхож байна?"}</h3>
              <p className="max-w-xs text-sm leading-7 text-muted-foreground">{q ? "Түлхүүр үгээ зөв бичсэн эсэхийг шалгаарай. Эсвэл өөр үгээр хайж үзээрэй." : "Мэдээний гарчиг, агуулга болон ангиллаар хайна. Жишээ нь: Улаанбаатар, технологи, спорт."}</p>
              <Button asChild variant="outline" className="mt-3 h-9 text-xs"><Link href="/">Нүүр хуудас руу<ArrowUpRight className="ml-2 size-3.5" /></Link></Button>
            </Card>
          )}
        </section>
        <Popular />
      </div>
    </>
  );
}
