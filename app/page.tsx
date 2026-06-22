import { Agents } from "@/components/landing/agents";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Install } from "@/components/landing/install";
import { Problem } from "@/components/landing/problem";
import { Terminal } from "@/components/landing/terminal";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Terminal />
      <Problem />
      <HowItWorks />
      <Features />
      <Agents />
      <Install />
      <Footer />
    </main>
  );
}
