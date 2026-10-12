"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import RoomScene, { FLOORS, MOODS, WALLS, type Hotspot, type RoomState } from "./RoomScene";
import { getProduct } from "@/lib/content";
import SceneLoader from "../three/SceneLoader";

const sofa = getProduct("glam-velvet-sofa")!;
const chair = getProduct("sheen-chair")!;

const HOTSPOTS: Hotspot[] = [
  {
    id: "sofa",
    position: [0.4, 0.95, -1.5],
    title: sofa.name,
    text: "Βαθύ κάθισμα, βελούδο υψηλής πυκνότητας και ορειχάλκινα πόδια. Αλλάξτε απόχρωση από το πάνελ.",
    href: `/catalogue/${sofa.slug}`,
  },
  {
    id: "chair",
    position: [1.75, 0.95, -0.25],
    title: chair.name,
    text: "Βελούδο με λάμψη που αλλάζει τόνο ανάλογα με το φως της ημέρας.",
    href: `/catalogue/${chair.slug}`,
  },
  {
    id: "table",
    position: [0.45, 0.5, -0.45],
    title: "Τραπέζι Nero Marquina",
    text: "Επιφάνεια από μαύρο μάρμαρο σε ραβδωτή βάση από βουρτσισμένο ορείχαλκο. Κατασκευή κατά παραγγελία.",
  },
  {
    id: "wall",
    position: [-0.9, 1.95, -2.1],
    title: "Ραβδωτή επένδυση",
    text: "Χειροποίητα ημικυλινδρικά πηχάκια που παίζουν με το φως και κρύβουν την ακουστική μόνωση.",
  },
  {
    id: "lamp",
    position: [1.55, 1.15, -1.78],
    title: "Φωτιστικό Ίρις",
    text: "Ιριδίζον γυαλί που ζωντανεύει το βράδυ. Δοκιμάστε την ατμόσφαιρα «Βράδυ».",
    href: "/catalogue/iridescence-lamp",
  },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-[0.62rem]">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Swatch({ color, label, active, onClick }: { color: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`h-8 w-8 rounded-full border transition-all duration-300 ${
        active ? "scale-110 border-ivory ring-2 ring-blue ring-offset-2 ring-offset-graphite" : "border-ivory/20 hover:border-ivory/60"
      }`}
      style={{ background: color }}
    />
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
        active ? "border-blue bg-blue text-ink" : "border-ivory/20 text-mist hover:border-ivory/60 hover:text-ivory"
      }`}
    >
      {label}
    </button>
  );
}

export default function RoomExperience() {
  const [state, setState] = useState<RoomState>({ sofa: "Navy", chair: "Peacock Velvet", wall: "graphite", floor: "oak", mood: "dusk" });
  const [active, setActive] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const set = <K extends keyof RoomState>(k: K, v: RoomState[K]) => setState((s) => ({ ...s, [k]: v }));
  const hotspot = HOTSPOTS.find((h) => h.id === active);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden" data-lenis-prevent>
      <div className="absolute inset-0" data-cursor="drag">
        <RoomScene state={state} hotspots={HOTSPOTS} activeHotspot={active} onHotspot={setActive} />
      </div>
      <SceneLoader />

      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-ink/80 to-transparent px-6 pt-28 pb-16 md:px-10">
        <p className="eyebrow mb-3">Διαδραστικός χώρος · 3D</p>
        <h1 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-none font-extralight">
          Σαλόνι <span className="italic text-blue">Αθηνών</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm text-mist/75">
          Σύρετε για να περιστρέψετε, πατήστε τα σημεία για λεπτομέρειες και διαμορφώστε τον χώρο από το πάνελ.
        </p>
      </div>

      <motion.aside
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-x-4 bottom-20 space-y-5 rounded-lg border border-ivory/10 bg-graphite/85 p-5 backdrop-blur-xl md:inset-x-auto md:right-8 md:bottom-8 md:block md:w-[340px] md:p-6 ${
          panelOpen ? "block" : "hidden"
        }`}
      >
        <Group title="Ύφασμα καναπέ">
          {sofa.variants!.map((v) => (
            <Swatch key={v.name} color={v.swatch} label={v.label} active={state.sofa === v.name} onClick={() => set("sofa", v.name)} />
          ))}
        </Group>
        <Group title="Πολυθρόνα">
          {chair.variants!.map((v) => (
            <Swatch key={v.name} color={v.swatch} label={v.label} active={state.chair === v.name} onClick={() => set("chair", v.name)} />
          ))}
        </Group>
        <div className="grid grid-cols-2 gap-5">
          <Group title="Τοίχος">
            {Object.entries(WALLS).map(([k, w]) => (
              <Swatch key={k} color={w.color} label={w.label} active={state.wall === k} onClick={() => set("wall", k as RoomState["wall"])} />
            ))}
          </Group>
          <Group title="Δάπεδο">
            {Object.entries(FLOORS).map(([k, f]) => (
              <Swatch key={k} color={f.swatch} label={f.label} active={state.floor === k} onClick={() => set("floor", k as RoomState["floor"])} />
            ))}
          </Group>
        </div>
        <Group title="Ατμόσφαιρα φωτισμού">
          {Object.entries(MOODS).map(([k, m]) => (
            <Pill key={k} label={m.label} active={state.mood === k} onClick={() => set("mood", k as RoomState["mood"])} />
          ))}
        </Group>
      </motion.aside>

      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-ivory/25 bg-ink/70 px-6 py-3 text-[0.7rem] tracking-[0.22em] uppercase backdrop-blur md:hidden"
      >
        {panelOpen ? "Κλείσιμο" : "Διαμόρφωση χώρου"}
      </button>

      <AnimatePresence>
        {hotspot && (
          <motion.div
            key={hotspot.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-4 w-[min(320px,calc(100%-2rem))] -translate-y-1/2 rounded-lg border border-ivory/10 bg-ink/85 p-6 backdrop-blur-xl md:left-10"
          >
            <p className="eyebrow mb-3 text-[0.62rem] text-blue">Λεπτομέρεια</p>
            <h2 className="font-display text-2xl font-light">{hotspot.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist/80">{hotspot.text}</p>
            {hotspot.href && (
              <Link href={hotspot.href} className="mt-5 inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase" data-cursor="link">
                Στη συλλογή <span className="h-px w-8 bg-ivory" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
