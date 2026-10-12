import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";

const ITEMS = [
  {
    href: "/room",
    index: "01",
    title: "Χώρος 3D",
    text: "Περιστρέψτε ένα σαλόνι σε τρεις διαστάσεις, αλλάξτε υφάσματα και ατμόσφαιρα φωτισμού.",
    image: "/media/p-fireplace.jpg",
  },
  {
    href: "/tour",
    index: "02",
    title: "Περιήγηση 360°",
    text: "Περπατήστε μέσα σε ολοκληρωμένα έργα, δωμάτιο προς δωμάτιο.",
    image: "/media/p-palazzo.jpg",
  },
  {
    href: "/catalogue",
    index: "03",
    title: "Η Συλλογή",
    text: "Επιλεγμένα έπιπλα και φωτιστικά, που τα βλέπετε από κάθε γωνία.",
    image: "/media/p-ceiling.jpg",
  },
];

/** Entry points into the three immersive experiences. */
export default function Experiences() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-[14vh] md:px-10">
      <Reveal className="mb-14">
        <p className="eyebrow mb-6">Ζήστε τον χώρο πριν υπάρξει</p>
        <h2 className="max-w-4xl font-display text-[clamp(2.4rem,5vw,5rem)] leading-none font-extralight">
          Τρεις τρόποι να <span className="italic text-blue">εξερευνήσετε.</span>
        </h2>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {ITEMS.map((item, i) => (
          <Reveal key={item.href} delay={i * 0.12}>
            <Link href={item.href} data-cursor="view" className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="font-sans text-xs tracking-[0.3em] text-blue">{item.index}</span>
                  <h3 className="mt-3 font-display text-4xl font-light">{item.title}</h3>
                  <p className="mt-3 max-w-xs text-sm text-mist/80">{item.text}</p>
                  <span className="mt-6 inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase">
                    Εξερευνήστε
                    <span className="h-px w-8 bg-ivory transition-all duration-500 ease-luxe group-hover:w-16" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
