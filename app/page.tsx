import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Agents } from "@/components/landing/agents";
import { Install } from "@/components/landing/install";
import { Footer } from "@/components/landing/footer";

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
