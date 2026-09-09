import { useMemo } from "react";

/**
 * Arka planda rastgele yerlerde titreşen (twinkle) küçük ışık noktaları.
 * Tıklanamaz, tamamen dekoratif.
 */
export default function Sparkles({ count = 24 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 1.8 + Math.random() * 2.4,
        delay: Math.random() * 4,
      })),
    [count]
  );

  return (
    <div className="sparkles" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="sparkle"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
