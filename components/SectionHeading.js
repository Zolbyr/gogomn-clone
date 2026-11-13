import { cn } from "@/lib/utils";

export default function SectionHeading({ children, eyebrow, aside, className, id }) {
  return (
    <div id={id} className={cn("section-heading mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="type-eyebrow mb-2 text-muted-foreground">{eyebrow}</p>}
        <h2 className="type-section-title flex items-center gap-2.5"><span aria-hidden="true" className="h-5 w-1 rounded-full bg-primary" />{children}</h2>
      </div>
      {aside}
    </div>
  );
}
