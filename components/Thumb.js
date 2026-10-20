import Image from "next/image";
import { getCat } from "../lib/data";

export default function Thumb({ cat, image, seed, big = false, tag = true }) {
  const c = getCat(cat);

  const src = image ?? `https://picsum.photos/seed/gogo-${seed}/800/500`;

  return (
    <div
      className={big ? "thumb big" : "thumb"}
      style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={big ? "(max-width: 820px) 100vw, 760px" : "(max-width: 820px) 100vw, 380px"}
        style={{ objectFit: "cover", zIndex: 0 }}
      />
      {tag && <span className="tag">{c.name}</span>}
    </div>
  );
}