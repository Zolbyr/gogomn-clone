import { getCat } from "../lib/data";

export default function Thumb({ cat, big = false, tag = true }) {
  const c = getCat(cat);
  return (
    <div className={big ? "thumb big" : "thumb"} style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}>
      {tag && <span className="tag">{c.name}</span>}
    </div>
  );
}
  