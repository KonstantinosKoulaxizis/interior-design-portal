import Link from "next/link";
import Wordmark from "./Wordmark";
import { NAV } from "@/lib/nav";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-slate bg-ink px-6 pt-28 pb-10 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <p className="eyebrow mb-8">Επικοινωνία</p>
        <a
          href="mailto:studio@example.gr"
          data-cursor="view"
          className="group block font-display text-[clamp(2.6rem,8vw,8rem)] leading-[0.95] font-light"
        >
          Ας σχεδιάσουμε
          <br />
          <span className="italic text-blue transition-colors duration-500 group-hover:text-ivory">
            τον χώρο σας.
          </span>
        </a>

        <div className="mt-24 grid gap-12 border-t border-slate pt-12 text-sm text-mist/80 md:grid-cols-4">
          <div>
            <p className="eyebrow mb-4">Στούντιο</p>
            <p>Λεωφόρος Βασιλίσσης Σοφίας 00</p>
            <p>Κολωνάκι, Αθήνα</p>
          </div>
          <div>
            <p className="eyebrow mb-4">Ραντεβού</p>
            <p>+30 210 000 0000</p>
            <p>studio@example.gr</p>
          </div>
          <div>
            <p className="eyebrow mb-4">Πλοήγηση</p>
            <ul className="space-y-1.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-ivory" data-cursor="link">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Ακολουθήστε</p>
            <p>Instagram</p>
            <p>Pinterest</p>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-8 text-[clamp(0.9rem,2.6vw,2.2rem)] text-ivory/90">
          <Wordmark withTagline />
          <p className="font-sans text-[0.68rem] tracking-[0.2em] text-mist/50 uppercase">
            Πρωτότυπο επίδειξης · Ενδεικτικό περιεχόμενο
          </p>
        </div>
      </div>
    </footer>
  );
}
