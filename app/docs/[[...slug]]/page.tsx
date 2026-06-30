import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx-content";
import { DocsTOC } from "@/components/docs/docs-toc";

type VeliteTocNode = { title: string; url: string; items?: VeliteTocNode[] };
type FlatTocEntry = { title: string; id: string; depth: number };

function flattenToc(nodes: VeliteTocNode[], depth = 1): FlatTocEntry[] {
  return nodes.flatMap((node) => {
    const id = node.url.slice(1);
    const entries: FlatTocEntry[] = depth >= 2 ? [{ title: node.title, id, depth }] : [];
    return [...entries, ...flattenToc(node.items ?? [], depth + 1)];
  });
}

async function getDoc(slug: string[] | undefined) {
  const slugStr = slug && slug.length > 0 ? slug.join("/") : "introduction";
  try {
    const { docs } = await import("@/.velite");
    return docs.find((doc) => doc.slug === `docs/${slugStr}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) return { title: "Not Found" };
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const doc = await getDoc(slug);

  if (!doc) {
    notFound();
  }

  const toc = doc.tocOverride
    ? doc.tocOverride.map((e: { title: string; id: string; depth?: number }) => ({
        ...e,
        depth: e.depth ?? 2,
      }))
    : flattenToc(doc.toc as VeliteTocNode[]);

  return (
    <div className="flex gap-8 xl:gap-12 py-10 pb-24">
      <article
        className="flex-1 min-w-0 prose prose-invert prose-sm md:prose-base max-w-none
        prose-headings:font-medium prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:mb-8
        prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4
        prose-p:text-white/70 prose-p:leading-relaxed
        prose-code:text-white prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg
        prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white
        prose-strong:text-white
        prose-li:text-white/70
        prose-table:border-collapse
        prose-th:text-white/80 prose-th:border-b prose-th:border-white/15 prose-th:pb-2 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-wider
        prose-td:text-white/60 prose-td:border-b prose-td:border-white/10 prose-td:py-2 prose-td:text-sm
      "
      >
        <MDXContent code={doc.body} />
      </article>
      <aside className="hidden xl:block w-48 flex-shrink-0">
        <div className="sticky top-24">
          <DocsTOC toc={toc} />
        </div>
      </aside>
    </div>
  );
}
