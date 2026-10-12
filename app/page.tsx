import Seasons from "@/components/home/Seasons";
import Projects from "@/components/home/Projects";
import Moodboard from "@/components/home/Moodboard";
import BeforeAfter from "@/components/home/BeforeAfter";
import Process from "@/components/home/Process";
import Experiences from "@/components/home/Experiences";

export default function Home() {
  return (
    <main>
      <Seasons />
      <Projects />
      <Moodboard />
      <BeforeAfter />
      <Experiences />
      <Process />
    </main>
  );
}
