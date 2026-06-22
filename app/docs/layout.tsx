import Link from "next/link";
import { Header } from "@/components/landing/header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Introduction", href: "/docs/introduction" },
    { label: "Quick Start", href: "/docs/quick-start" },
    { label: "How It Works", href: "/docs/how-it-works" },
  ];

  return (
    <div className="min-h-screen bg-signalgray-800 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-20 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0 py-10">
          <div className="sticky top-20">
            <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-4">
              Documentation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-white/50 hover:text-white py-1.5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

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

        {/* Content */}
        <main className="flex-1 min-w-0 py-10 pb-24">{children}</main>
      </div>
    </div>
  );
}
