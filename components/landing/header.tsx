import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-signalgray-800/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-mono font-medium text-sm tracking-tight text-white">
            SUPER<span style={{ opacity: 0.4 }}>SPECS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <Link href="/docs" className="link-underline">
            Docs
          </Link>
          <Link href="/#how-it-works" className="link-underline">
            How It Works
          </Link>
          <Link href="/#features" className="link-underline">
            Features
          </Link>
          <Link
            href="https://github.com/fokkerone/superspecs"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}
