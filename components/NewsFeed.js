"use client";

import { Bookmark, Clock3, TrendingUp } from "lucide-react";
import ArticleRow from "@/components/ArticleRow";
import SectionHeading from "@/components/SectionHeading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSavedArticles } from "@/hooks/use-saved-articles";

export default function NewsFeed({ articles }) {
  const { savedIds } = useSavedArticles();
  const mostRead = [...articles].sort((a, b) => b.views - a.views);
  const saved = articles.filter((article) => savedIds.includes(article.id));

  return (
    <section id="latest" className="scroll-mt-24">
      <SectionHeading eyebrow="Мэдээллийн урсгал" aside={<span className="mb-1 shrink-0 text-xs text-muted-foreground">{articles.length} мэдээ</span>}>Мэдээний тойм</SectionHeading>
      <Tabs defaultValue="latest" className="gap-1">
        <TabsList aria-label="Мэдээ шүүх" className="mb-2 h-10! w-full justify-start rounded-lg bg-secondary/70 p-1 sm:w-fit">
          <TabsTrigger value="latest" className="gap-1 px-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs"><Clock3 className="hidden size-3.5 min-[375px]:block" />Шинэ мэдээ</TabsTrigger>
          <TabsTrigger value="popular" className="gap-1 px-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs"><TrendingUp className="hidden size-3.5 min-[375px]:block" />Их уншсан</TabsTrigger>
          <TabsTrigger value="saved" className="gap-1 px-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs"><Bookmark className="hidden size-3.5 min-[375px]:block" />Хадгалсан</TabsTrigger>
        </TabsList>
        <TabsContent value="latest">{articles.map((article) => <ArticleRow key={article.id} article={article} />)}</TabsContent>
        <TabsContent value="popular">{mostRead.map((article) => <ArticleRow key={article.id} article={article} />)}</TabsContent>
        <TabsContent value="saved">
          {saved.length ? saved.map((article) => <ArticleRow key={article.id} article={article} />) : (
            <div className="my-5 rounded-xl border border-dashed bg-white px-6 py-14 text-center">
              <Bookmark className="mx-auto mb-4 size-7 text-muted-foreground/45" />
              <h3 className="font-semibold">Хадгалсан мэдээ алга байна</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-muted-foreground">Дараа унших мэдээгээ «Хадгалах» товчоор энэ жагсаалтад нэмээрэй. Жагсаалт зөвхөн энэ хөтөч дээр хадгалагдана.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
