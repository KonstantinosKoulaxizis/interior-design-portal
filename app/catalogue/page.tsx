import type { Metadata } from "next";
import CatalogueGrid from "@/components/catalogue/CatalogueGrid";
import { LineReveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Η Συλλογή | Maria Michalakakou" };

export default function CataloguePage() {
  return (
    <main>
      <header className="mx-auto max-w-[1600px] px-6 pt-40 pb-16 md:px-10 md:pt-48">
        <p className="eyebrow mb-6">Επιμελημένη συλλογή</p>
        <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.92] font-extralight">
          <LineReveal immediate lines={["Η Συλλογή", <span key="i" className="italic text-blue">σε τρεις διαστάσεις.</span>]} />
        </h1>
        <p className="mt-8 max-w-lg text-mist/75">
          Έπιπλα, φωτιστικά και αντικείμενα που επιλέγουμε για τα έργα μας. Ανοίξτε οποιοδήποτε κομμάτι για να το δείτε σε 3D και να αλλάξετε την απόχρωσή του.
        </p>
      </header>
      <CatalogueGrid />
    </main>
  );
}
