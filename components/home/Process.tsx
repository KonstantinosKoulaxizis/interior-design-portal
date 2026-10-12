import { PROCESS } from "@/lib/content";
import Reveal from "../Reveal";

/** The four-step working method, with a sticky heading beside the numbered steps. */
export default function Process() {
  return (
    <section className="mx-auto grid max-w-[1600px] gap-16 px-6 py-[14vh] md:grid-cols-[1fr_1.4fr] md:px-10">
      <div className="md:sticky md:top-32 md:self-start">
        <p className="eyebrow mb-6">Η διαδικασία</p>
        <h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-none font-extralight">
          Από την ιδέα
          <br />
          <span className="italic text-blue">στο κλειδί.</span>
        </h2>
      </div>
      <ol>
        {PROCESS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.05}>
            <li className="grid grid-cols-[4.5rem_1fr] gap-6 border-t border-slate py-10 md:grid-cols-[7rem_1fr]">
              <span className="font-display text-5xl font-extralight text-blue/80 md:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-3xl font-light md:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-md text-mist/75">{step.text}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
