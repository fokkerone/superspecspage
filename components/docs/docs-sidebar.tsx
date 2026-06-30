"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Doc = {
  title: string;
  slug: string;
  order: number;
  section: string | null;
};

function toTitleCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DocsSidebar({ docs }: { docs: Doc[] }) {
  const pathname = usePathname();

  // Sort: by order asc, then title asc
  const sorted = [...docs].sort((a, b) =>
    a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title)
  );

  // Group: null section = top-level, string = section group
  const topLevel = sorted.filter((d) => d.section === null);
  const sections = sorted
    .filter((d) => d.section !== null)
    .reduce<Record<string, Doc[]>>((acc, d) => {
      const key = d.section!;
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      return acc;
    }, {});

  // Preserve section order by first occurrence in sorted array
  const sectionOrder = [
    ...new Set(sorted.filter((d) => d.section).map((d) => d.section!)),
  ];

  const NavItem = ({ doc }: { doc: Doc }) => {
    const href = `/${doc.slug}`;
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={[
          "block text-sm py-1.5 transition-colors",
          isActive
            ? "text-white border-l-2 border-white pl-3"
            : "text-white/50 hover:text-white pl-3.5",
        ].join(" ")}
      >
        {doc.title}
      </Link>
    );
  };

  return (
    <nav>
      {topLevel.map((doc) => (
        <NavItem key={doc.slug} doc={doc} />
      ))}
      {sectionOrder.map((section) => (
        <div key={section} className="mt-6">
          <p className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
            {toTitleCase(section)}
          </p>
          {sections[section].map((doc) => (
            <NavItem key={doc.slug} doc={doc} />
          ))}
        </div>
      ))}
    </nav>
  );
}
