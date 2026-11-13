"use client";

import { useState } from "react";
import { Bookmark, Check, Copy, Share2, Type, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Thumb from "@/components/Thumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { useSavedArticles } from "@/hooks/use-saved-articles";

export default function ArticleReader({ article }) {
  const { savedIds, toggleSaved } = useSavedArticles();
  const isSaved = savedIds.includes(article.id);
  const [fontSize, setFontSize] = useState("18");
  const [copying, setCopying] = useState(false);

  function saveArticle() {
    try {
      const saved = toggleSaved(article.id);
      toast.success(saved ? "Мэдээг хадгаллаа" : "Хадгалсан жагсаалтаас хаслаа", { description: saved ? "Нүүр хуудасны «Хадгалсан» хэсгээс уншаарай." : undefined });
    } catch { toast.error("Энэ хөтөч дээр мэдээ хадгалах боломжгүй байна."); }
  }

  async function copyLink() {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Мэдээний холбоосыг хууллаа");
    } catch { toast.error("Холбоосыг хуулж чадсангүй. Хаягийн мөр дэх холбоосыг хуулна уу."); }
    finally { setCopying(false); }
  }

  async function shareArticle() {
    if (!navigator.share) { await copyLink(); return; }
    try { await navigator.share({ title: article.title, url: window.location.href }); }
    catch (error) { if (error.name !== "AbortError") await copyLink(); }
  }

  return (
    <>
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 border-y py-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><BookOpen className="size-3.5" />1 минут уншина</span>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-10" aria-label="Текстийн хэмжээ"><Type className="size-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Текстийн хэмжээ</DropdownMenuLabel><DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
                <DropdownMenuRadioItem value="16">Жижиг</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="18">Дунд</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="22">Том</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="mx-1 h-5!" />
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-10" onClick={copyLink} disabled={copying} aria-label="Холбоос хуулах"><Copy className="size-4" /></Button></TooltipTrigger><TooltipContent>Холбоос хуулах</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-10" onClick={shareArticle} aria-label="Мэдээ хуваалцах"><Share2 className="size-4" /></Button></TooltipTrigger><TooltipContent>Хуваалцах</TooltipContent></Tooltip>
          <Button variant={isSaved ? "secondary" : "outline"} className="ml-2 h-10 gap-2 px-3 text-xs" aria-pressed={isSaved} onClick={saveArticle}>
            {isSaved ? <Check className="size-3.5 text-primary" /> : <Bookmark className="size-3.5" />}{isSaved ? "Хадгалсан" : "Хадгалах"}
          </Button>
        </div>
      </div>
      <figure>
        <Thumb cat={article.cat} image={article.image} seed={article.id} big priority className="rounded-xl" alt="Мэдээний жишээ зураг" />
        <figcaption className="mt-2.5 text-right text-xs leading-6 text-muted-foreground">Жишээ зураг · Unsplash</figcaption>
      </figure>
      <div className="article-copy py-8 text-foreground/90 sm:py-10" style={{ fontSize: `${fontSize}px` }} aria-label="Мэдээний агуулга">
        <p>{article.body}</p>
      </div>
      <div className="flex gap-3 rounded-lg border border-dashed bg-muted/50 p-4">
        <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-[13px] leading-7 text-muted-foreground">Энэ бол сургалтын зориулалттай жишээ мэдээ. Агуулга, нийтэлсэн хугацаа, уншилтын тоо болон зураг нь бодит үйл явдлыг илэрхийлэхгүй.</p>
      </div>
    </>
  );
}
