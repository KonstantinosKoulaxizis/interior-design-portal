"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import Wordmark from "./Wordmark";
import { NAV } from "@/lib/nav";


export default function Header() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lenis = useLenis(({ scroll, direction }) => {
    setSolid(scroll > 40);
    setHidden(direction === 1 && scroll > 240);
  });

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
          solid && !open ? "bg-ink/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="Αρχική" className="text-[0.82rem] md:text-[0.95rem]" data-cursor="link">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="link"
                className={`group relative text-[0.78rem] uppercase tracking-[0.22em] transition-colors ${
                  pathname.startsWith(item.href) ? "text-ivory" : "text-mist/70 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-blue transition-all duration-500 ease-luxe ${
                    pathname.startsWith(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
            <a
              href="#contact"
              data-cursor="link"
              className="rounded-full border border-ivory/25 px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] transition-colors hover:border-blue hover:text-blue"
            >
              Ραντεβού
            </a>
          </nav>

          <button
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-label="Μενού"
            data-cursor="link"
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-px w-7 bg-ivory transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-7 bg-ivory transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-graphite px-6 pb-16 lg:hidden"
          >
            <ul className="space-y-4">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={item.href} className="flex items-baseline gap-4 font-display text-5xl font-light">
                    <span className="font-sans text-xs tracking-[0.3em] text-blue">{item.index}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
