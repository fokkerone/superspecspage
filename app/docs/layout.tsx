import { Header } from "@/components/landing/header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

async function getAllDocs() {
  try {
    const { docs } = await import("@/.velite");
    return docs.filter((d) => d.published);
  } catch {
    return [];
  }
}

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = await getAllDocs();

  return (
    <div className="min-h-screen bg-signalgray-800 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-20 flex gap-8 xl:gap-12">
        {/* Left sidebar */}
        <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0 py-10">
          <div className="sticky top-24">
            <p className="text-xs font-mono uppercase tracking-wider text-white/30 mb-4">
              Documentation
            </p>
            <DocsSidebar docs={docs} />
            <div className="mt-8 pt-8 border-t border-white/10">
              <a
                href="https://github.com/fokkerone/superspecs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </aside>
        {/* Center + Right (owned by page) */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
