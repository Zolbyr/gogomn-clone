import ArticleCard from "../components/ArticleCard";
import ArticleRow from "../components/ArticleRow";
import Popular from "../components/Popular";
import { ARTICLES } from "../lib/data";

export default function Home() {
  return (
    <>
      <section className="hero">
        <ArticleCard article={ARTICLES[0]} big />
        <div className="hero-side">
          <ArticleCard article={ARTICLES[1]} />
          <ArticleCard article={ARTICLES[2]} />
        </div>
      </section>
      <section className="cols">
        <div>
          <h3 className="sec">Сүүлийн мэдээ</h3>
          {ARTICLES.slice(3).map((a) => <ArticleRow key={a.id} article={a} />)}
        </div>
        <Popular />
      </section>
    </>
  );
}
