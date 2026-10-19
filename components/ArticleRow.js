import Link from "next/link";
import Thumb from "./Thumb";
import { getCat } from "../lib/data";

export default function ArticleRow({ article }) {
  return (
    <Link href={`/article/${article.id}`} className="row">
      <Thumb cat={article.cat} tag={false} />
      <div>
        <h3>{article.title}</h3>
        <div className="meta">{getCat(article.cat).name} · {article.time}</div>
      </div>
    </Link>
  );
}
