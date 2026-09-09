import { useEffect, useRef, useState } from "react";

// Buton her tıklamada bu noktaları sırayla dolaşır, sonra baştan başlar:
// sağ orta -> sol üst köşe -> sol alt köşe -> tekrar orta -> (tekrar sağ orta...)
// Değerler containerRef'in (artık tüm sayfa) 0..1 aralığındaki oranları —
// 0.15/0.85 sınırları, alanın ortasındaki ~yarısı içinde kalmasını sağlar.
const WAYPOINTS = [
  { x: 0.85, y: 0.5 }, // sağ orta
  { x: 0.15, y: 0.15 }, // sol üst köşe
  { x: 0.15, y: 0.85 }, // sol alt köşe
  { x: 0.5, y: 0.5 }, // orta
];

/**
 * "Hayır" gibi tıklanmasını istemediğimiz bir buton: fare/parmak yaklaşınca ya da
 * tıklanınca kapsayıcı alan içinde sabit bir köşe sırasını (WAYPOINTS) izleyerek
 * sarsılarak kaçar ve (varsa) sırayla farklı bir metin gösterir.
 *
 * containerRef: butonun içinde kaçacağı alanın ref'i (position: relative olmalı)
 * labels: dodge sayısına göre sırayla gösterilecek metinler (son metinde kalır)
 */
export default function DodgeButton({
  containerRef,
  anchorRef,
  children,
  labels,
  onDodge,
  className = "",
}) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  function pointAt(fracX, fracY) {
    const container = containerRef.current;
    const btn = btnRef.current;
    const padding = 10;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const maxX = Math.max(containerRect.width - btnRect.width - padding * 2, 0);
    const maxY = Math.max(containerRect.height - btnRect.height - padding * 2, 0);
    return { x: padding + fracX * maxX, y: padding + fracY * maxY };
  }

  // Mount olunca "Evet" butonunun (anchorRef) yanında başlar. anchorRef
  // verilmediyse konteyner içinde yaklaşık bir noktaya (sağ üst) yerleşir.
  // NOT: useEffect kullanıyoruz (useLayoutEffect değil) — çünkü bu, alt
  // bileşen; üstteki containerRef'in DOM'a bağlanması ancak tüm ağacın
  // layout-effect turu bitip passive effect turuna geçildiğinde garanti.
  useEffect(() => {
    const container = containerRef.current;
    const btn = btnRef.current;
    if (!container || !btn) return;

    const anchor = anchorRef?.current;
    if (anchor) {
      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const gap = 8;
      let x = anchorRect.right - containerRect.left + gap;
      let y = anchorRect.top - containerRect.top + (anchorRect.height - btnRect.height) / 2;
      x = Math.min(x, Math.max(containerRect.width - btnRect.width - 10, 0));
      y = Math.max(0, Math.min(y, Math.max(containerRect.height - btnRect.height - 10, 0)));
      setPos({ x, y });
    } else {
      setPos(pointAt(0.78, 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dodge() {
    if (!containerRef.current || !btnRef.current) return;
    const waypoint = WAYPOINTS[dodgeCount % WAYPOINTS.length];
    setPos(pointAt(waypoint.x, waypoint.y));
    setShakeKey((k) => k + 1);
    setDodgeCount((c) => c + 1);
    onDodge?.(dodgeCount + 1);
  }

  // Konum geçişini bozmadan (aynı DOM elemanı kalır) sarsılma animasyonunu
  // her dodge'da baştan tetikler.
  useEffect(() => {
    if (shakeKey === 0) return;
    const btn = btnRef.current;
    if (!btn) return;
    btn.classList.remove("shake-on-dodge");
    // eslint-disable-next-line no-unused-expressions
    btn.offsetWidth; // reflow'u zorla, animasyonu yeniden başlat
    btn.classList.add("shake-on-dodge");
  }, [shakeKey]);

  // pos hesaplanana kadar (bir sonraki tick) butonu görünmez tutuyoruz ki
  // yanlış yerde belirip sonra zıplamasın.
  const style = {
    position: "absolute",
    left: pos ? pos.x : 0,
    top: pos ? pos.y : 0,
    opacity: pos ? 1 : 0,
    pointerEvents: pos ? "auto" : "none",
    transition:
      "left 0.34s cubic-bezier(.34,1.56,.64,1), top 0.34s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease",
  };

  // Etiketler sona erince takılıp kalmasın, baştan dönsün.
  const label = labels ? labels[dodgeCount % labels.length] : children;

  return (
    <button
      ref={btnRef}
      type="button"
      className={`btn btn-ghost dodge-btn ${className}`}
      style={style}
      onMouseEnter={dodge}
      onClick={dodge}
      onTouchStart={(e) => {
        e.preventDefault();
        dodge();
      }}
    >
      {label}
    </button>
  );
}
