import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BeforeAfter from "@/components/BeforeAfter";
import GameModes from "@/components/GameModes";
import HowItWorks from "@/components/HowItWorks";
import DemoSection from "@/components/DemoSection";
import Stats from "@/components/Stats";
import ForWho from "@/components/ForWho";
import FAQ from "@/components/FAQ";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-crypto-darker">
      <Nav />
      <Hero />
      <BeforeAfter />
      <GameModes />
      <HowItWorks />
      <DemoSection />
      <Stats />
      <ForWho />
      <FAQ />
      <Waitlist />
      <Footer />
    </main>
  );
}
