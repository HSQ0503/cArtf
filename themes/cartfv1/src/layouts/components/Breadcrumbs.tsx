"use client";

import { humanize } from "@/lib/utils/textConverter";
import { usePathname } from "next/navigation";

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className }) => {
  const pathname = usePathname();

  const paths = pathname?.split("/").filter((x) => x) || [];
  let parts = [
    {
      label: "Home",
      href: "/",
      "aria-label": pathname === "/" ? "page" : undefined,
    },
  ];

  paths.forEach((label: string, i: number) => {
    const href = `/${paths.slice(0, i + 1).join("/")}`;
    label !== "page" &&
      parts.push({
        label: humanize(label.replace(".html", "").replace(/[-_]/g, " ")) || "",
        href,
        "aria-label": pathname === href ? "page" : undefined,
      });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      data-aos="fade-up-sm"
      data-aos-delay="200"
    >
      <ol className="inline-flex" role="list">
        {parts.map(({ label, ...attrs }, index) => (
          <li className="mx-1 capitalize" role="listitem" key={index}>
            {index > 0 && <span className="inline-block mr-1">/</span>}
            {index !== parts.length - 1 ? (
              <a className="text-primary" {...attrs}>
                {label}
              </a>
            ) : (
              <span className="text-text-light">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
