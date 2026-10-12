type Props = {
  className?: string;
  /** Show the Greek discipline line under the name */
  withTagline?: boolean;
};

/**
 * Typographic wordmark for Maria Michalakakou: spaced display capitals over a hairline,
 * with an optional Greek tagline. Pure text, so it stays crisp at any size.
 */
export default function Wordmark({ className = "", withTagline = false }: Props) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-display font-light uppercase tracking-[0.34em] whitespace-nowrap [margin-right:-0.34em]">
        Maria Michalakakou
      </span>
      {withTagline && (
        <>
          <span className="my-[0.7em] h-px w-full bg-current opacity-40" />
          <span className="font-sans text-[0.32em] uppercase tracking-[0.5em] text-mist [margin-right:-0.5em]">
            Σχεδιασμός Εσωτερικών Χώρων
          </span>
        </>
      )}
    </span>
  );
}

/** Compact monogram for tight spaces such as the favicon area or mobile header. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-current font-display font-light italic ${className}`}
    >
      MM
    </span>
  );
}
