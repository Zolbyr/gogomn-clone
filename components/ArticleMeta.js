import { Clock3, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArticleMeta({ article, className, showViews = true }) {
  return (
    <div className={cn("type-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground sm:gap-x-4", className)}>
      <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{article.time}</span>
      {showViews && <span className="inline-flex items-center gap-1.5"><Eye className="size-3.5" />{article.views.toLocaleString("en-US")}</span>}
    </div>
  );
}
