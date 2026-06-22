import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/page-transition";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SuperSpecs — Spec-driven AI development that compounds",
    template: "%s | SuperSpecs",
  },
  description:
    "Spec-driven planning. Parallel TDD execution. A wiki that never forgets. The discipline layer that makes AI-driven development actually compound.",
  keywords: ["AI coding", "spec-driven development", "TDD", "Claude Code", "Cursor", "OpenCode"],
  authors: [{ name: "SuperSpecs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://superspecs.dev",
    siteName: "SuperSpecs",
    title: "SuperSpecs — Spec-driven AI development that compounds",
    description: "Spec-driven planning. Parallel TDD execution. A wiki that never forgets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperSpecs — Spec-driven AI development that compounds",
    description: "Spec-driven planning. Parallel TDD execution. A wiki that never forgets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
