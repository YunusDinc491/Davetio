import { useMemo } from "react";

const EMOJIS = ["💕", "💗", "💓", "❤️", "💖"];

/**
 * Arka planda sürekli yukarı süzülen küçük kalpler. Sayfa boyunca dekoratif,
 * tıklanamaz (pointer-events: none).
 */
export default function FloatingHearts({ count = 12 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 0.8 + Math.random() * 1.1,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
        emoji: EMOJIS[i % EMOJIS.length],
      })),
    [count]
  );

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
