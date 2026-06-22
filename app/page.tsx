import { Agents } from "@/components/landing/agents";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Install } from "@/components/landing/install";
import { Problem } from "@/components/landing/problem";

export default function Home() {
  return (
    <main className="min-h-screen bg-signalgray-800 text-white">
      <Header />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Agents />
      <Install />
      <Footer />
    </main>
  );
}
