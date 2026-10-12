"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PRODUCTS, type Product } from "@/lib/content";

const CATEGORIES = ["Όλα", "Καναπέδες", "Καθίσματα", "Φωτισμός", "Αντικείμενα"] as const;
const ROOMS = ["Όλοι οι χώροι", "Σαλόνι", "Τραπεζαρία", "Υπνοδωμάτιο"] as const;

function Filter<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          data-cursor="link"
          className={`relative rounded-full px-4 py-2 text-xs tracking-[0.12em] transition-colors ${
            value === o ? "text-ink" : "text-mist hover:text-ivory"
          }`}
        >
          {value === o && (
            <motion.span layoutId={`pill-${options[0]}`} className="absolute inset-0 rounded-full bg-ivory" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />
          )}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}

function Card({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/catalogue/${product.slug}`} data-cursor="view" className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-graphite">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(127,155,176,0.16),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute inset-[14%] transition-transform duration-[1.2s] ease-luxe group-hover:scale-[1.08] group-hover:-rotate-2">
            <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
          </div>
          <span className="eyebrow absolute top-5 left-5 text-[0.6rem] text-mist/60">{product.category}</span>
          <span className="absolute top-5 right-5 rounded-full border border-ivory/20 px-3 py-1 text-[0.6rem] tracking-[0.2em] text-mist uppercase opacity-0 transition-all duration-500 group-hover:opacity-100">
            3D
          </span>
          {product.variants && (
            <div className="absolute bottom-5 left-5 flex gap-1.5">
              {product.variants.map((v) => (
                <span key={v.name} className="h-3 w-3 rounded-full border border-ivory/30" style={{ background: v.swatch }} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-light transition-colors group-hover:text-blue md:text-2xl">{product.name}</h3>
          <span className="shrink-0 text-sm text-mist/80">{product.price}</span>
        </div>
        <p className="mt-1 text-xs tracking-wide text-mist/50">
          {product.material} · {product.room}
        </p>
      </Link>
    </motion.div>
  );
}

export default function CatalogueGrid() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Όλα");
  const [room, setRoom] = useState<(typeof ROOMS)[number]>("Όλοι οι χώροι");

  const items = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => (category === "Όλα" || p.category === category) && (room === "Όλοι οι χώροι" || p.room === room),
      ),
    [category, room],
  );

  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-[14vh] md:px-10">
      <div className="-mx-6 mb-12 flex flex-col gap-3 border-y border-slate px-6 py-4 md:-mx-10 md:flex-row md:items-center md:justify-between md:px-10">
        <Filter options={CATEGORIES} value={category} onChange={setCategory} />
        <Filter options={ROOMS} value={room} onChange={setRoom} />
      </div>

      <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <Card key={p.slug} product={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
      {items.length === 0 && <p className="py-24 text-center text-mist/60">Δεν βρέθηκαν κομμάτια για αυτόν τον συνδυασμό.</p>}
    </section>
  );
}
