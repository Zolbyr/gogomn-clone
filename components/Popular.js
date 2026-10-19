import Link from "next/link";
import { popular } from "../lib/data";

export default function Popular() {
  return (
    <aside className="side">
      <h3 className="sec">Их уншсан</h3>
      {popular().map((a, i) => (
        <Link key={a.id} href={`/article/${a.id}`} className="pop">
          <span className="num">{i + 1}</span>
          <span>{a.title}</span>
        </Link>
      ))}
    </aside>
  );
}
