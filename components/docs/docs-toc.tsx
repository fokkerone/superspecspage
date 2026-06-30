"use client";

type TocEntry = { title: string; id: string; depth: number };

export function DocsTOC({ toc }: { toc: TocEntry[] }) {
  if (!toc || toc.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.location.hash = id;
  };

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-white/30 mb-4">
        On this page
      </p>
      <nav>
        {toc.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            onClick={(e) => handleClick(e, entry.id)}
            className={[
              "block text-sm py-1 transition-colors text-white/40 hover:text-white/80",
              entry.depth === 3 ? "pl-3" : "",
            ]
              .join(" ")
              .trim()}
          >
            {entry.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
