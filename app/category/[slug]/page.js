import { notFound } from "next/navigation";
import ArticleCard from "../../../components/ArticleCard";
import Popular from "../../../components/Popular";
import { CATS, getCat, byCat } from "../../../lib/data";

export function generateStaticParams() {
  return CATS.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = getCat(slug);
  if (!cat) notFound();
  const list = byCat(slug);
  return (
    <section className="cols">
      <div>
        <h3 className="sec">{cat.name}</h3>
        {list.length ? <div className="grid">{list.map((a) => <ArticleCard key={a.id} article={a} />)}</div> : <p className="empty">Мэдээ алга байна.</p>}
      </div>
      <Popular />
    </section>
  );
}
