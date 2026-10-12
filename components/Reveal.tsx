"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Fades and lifts its children into place the first time they scroll into view. */
export default function Reveal({ children, className, delay = 0, y = 40 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal for headlines: each line slides up from behind its own mask. */
export function LineReveal({
  lines,
  className,
  delay = 0,
  immediate = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            {...(immediate
              ? { animate: { y: "0%" } }
              : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-10% 0px" } })}
            transition={{ duration: 1.2, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
