import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import Projects from "@/components/home/Projects";
import Moodboard from "@/components/home/Moodboard";
import BeforeAfter from "@/components/home/BeforeAfter";
import Process from "@/components/home/Process";
import Experiences from "@/components/home/Experiences";

export default function Home() {
  return (
    <main>
      <Hero />
      <Statement />
      <Projects />
      <Moodboard />
      <BeforeAfter />
      <Experiences />
      <Process />
    </main>
  );
}
