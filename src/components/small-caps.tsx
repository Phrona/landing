/**
 * Faux small caps: full-height initial, the rest set smaller.
 *
 * Montserrat has no true small-caps cut, and `font-variant: small-caps`
 * synthesises them by squashing capitals, which reads as a different weight
 * next to the real ones. Sizing the remainder down keeps the letterforms
 * honest — same font, same weight, just a smaller cap height.
 *
 * Applied per word, so a two-word phrase gets two full-height initials.
 */
export function SmallCaps({ children }: { children: string }) {
  return (
    <>
      {children.split(" ").map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 && " "}
          {word.charAt(0).toUpperCase()}
          <span className="text-[0.8em]">{word.slice(1).toUpperCase()}</span>
        </span>
      ))}
    </>
  );
}
