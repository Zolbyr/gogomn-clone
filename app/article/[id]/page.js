import Link from "next/link";
import { notFound } from "next/navigation";
import Thumb from "../../../components/Thumb";
import Popular from "../../../components/Popular";
import { getArticle, getCat } from "../../../lib/data";

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const a = getArticle(id);
  if (!a) notFound();
  return (
    <section className="cols">
      <article className="card post">
        <Thumb cat={a.cat} big />
        <div className="pad">
          <Link href={`/category/${a.cat}`} className="meta">{getCat(a.cat).name}</Link>
          <h1>{a.title}</h1>
          <div className="meta">{a.time} · {a.views.toLocaleString()} уншсан</div>
          <p>{a.body}</p>
          <p className="meta">Энэ нь жишээ агуулга бөгөөд бодит мэдээ биш.</p>
        </div>
      </article>
      <Popular />
    </section>
  );
}
