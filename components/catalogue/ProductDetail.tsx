"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/lib/content";
import ProductViewer from "./ProductViewer";
import { LineReveal } from "../Reveal";

export default function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants?.[0]?.name);
  const current = product.variants?.find((v) => v.name === variant);

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1.35fr_1fr]">
      <div className="relative h-[62svh] lg:sticky lg:top-0 lg:h-[100svh]" data-lenis-prevent>
        <ProductViewer model={product.model} variant={variant} />
        <p className="eyebrow pointer-events-none absolute bottom-6 left-6 text-[0.62rem] text-mist/60">
          Σύρετε για περιστροφή · κύλιση για μεγέθυνση
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 pt-12 pb-24 md:px-12 lg:pt-36">
        <Link href="/catalogue" data-cursor="link" className="eyebrow mb-10 inline-flex items-center gap-3 text-[0.65rem] hover:text-ivory">
          <span className="h-px w-6 bg-current" /> Πίσω στη συλλογή
        </Link>
        <p className="eyebrow mb-4 text-blue">
          {product.category} · {product.room}
        </p>
        <h1 className="font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[1] font-extralight">
          <LineReveal immediate lines={[product.name]} />
        </h1>
        <p className="mt-6 font-display text-2xl font-light text-mist">{product.price}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-8 max-w-md leading-relaxed text-mist/80"
        >
          {product.description}
        </motion.p>

        {product.variants && (
          <div className="mt-10">
            <p className="eyebrow mb-4 text-[0.62rem]">
              Απόχρωση · <span className="text-ivory">{current?.label}</span>
            </p>
            <div className="flex gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.name}
                  onClick={() => setVariant(v.name)}
                  aria-label={v.label}
                  aria-pressed={variant === v.name}
                  className={`h-10 w-10 rounded-full border transition-all duration-300 ${
                    variant === v.name ? "scale-110 border-ivory ring-2 ring-blue ring-offset-2 ring-offset-ink" : "border-ivory/20 hover:border-ivory/60"
                  }`}
                  style={{ background: v.swatch }}
                />
              ))}
            </div>
          </div>
        )}

        <dl className="mt-12 grid grid-cols-2 gap-y-5 border-t border-slate pt-8 text-sm">
          <dt className="text-mist/60">Διαστάσεις</dt>
          <dd>{product.dimensions}</dd>
          <dt className="text-mist/60">Υλικό</dt>
          <dd>{product.material}</dd>
          <dt className="text-mist/60">Παράδοση</dt>
          <dd>8 έως 10 εβδομάδες</dd>
        </dl>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#contact"
            data-cursor="link"
            className="rounded-full bg-ivory px-7 py-3.5 text-[0.72rem] tracking-[0.22em] text-ink uppercase transition-colors hover:bg-blue"
          >
            Ζητήστε προσφορά
          </a>
          <Link
            href="/room"
            data-cursor="link"
            className="rounded-full border border-ivory/25 px-7 py-3.5 text-[0.72rem] tracking-[0.22em] uppercase transition-colors hover:border-blue hover:text-blue"
          >
            Δείτε το στον χώρο
          </Link>
        </div>
      </div>
    </div>
  );
}
