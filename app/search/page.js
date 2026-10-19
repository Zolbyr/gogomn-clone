import ArticleRow from "../../components/ArticleRow";
import Popular from "../../components/Popular";
import { search } from "../../lib/data";

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const results = q ? search(q) : [];
  return (
    <section className="cols">
      <div>
        <h3 className="sec">“{q}” хайлтын үр дүн</h3>
        {results.length ? results.map((a) => <ArticleRow key={a.id} article={a} />) : <p className="empty">Мэдээ олдсонгүй.</p>}
      </div>
      <Popular />
    </section>
  );
}
