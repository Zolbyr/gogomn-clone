import Link from "next/link";
import { Fragment } from "react";
import { House } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function NewsBreadcrumb({ items }) {
  return (
    <Breadcrumb aria-label="Хуудасны байршил" className="mb-7">
      <BreadcrumbList className="gap-2 text-xs leading-6">
        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/" className="inline-flex items-center gap-1.5"><House className="size-3" />Нүүр</Link></BreadcrumbLink></BreadcrumbItem>
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{item.href ? <BreadcrumbLink asChild><Link href={item.href}>{item.label}</Link></BreadcrumbLink> : <BreadcrumbPage className={index === items.length - 1 ? "max-w-56 truncate" : undefined}>{item.label}</BreadcrumbPage>}</BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
