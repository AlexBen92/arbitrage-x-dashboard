import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Strategies from "@/components/Strategies";
import HowItWorksNew from "@/components/HowItWorksNew";
import PlatformStats from "@/components/PlatformStats";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Nav />
      <Hero />
      <PlatformStats />
      <Strategies />
      <HowItWorksNew />
      <FAQ />
      <Footer />
    </main>
  );
}
