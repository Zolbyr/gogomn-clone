import Link from "next/link";
import Thumb from "./Thumb";

export default function ArticleCard({ article, big = false }) {
  return (
    <Link href={`/article/${article.id}`} className="card">
      <Thumb cat={article.cat} image={article.image} seed={article.id} big={big} />
      <div className="pad">
        {big ? <h2>{article.title}</h2> : <h3>{article.title}</h3>}
        <div className="meta">{article.time} · {article.views.toLocaleString()} уншсан</div>
      </div>
    </Link>
  );
}
