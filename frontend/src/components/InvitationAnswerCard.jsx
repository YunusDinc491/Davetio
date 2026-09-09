import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Ahmet'in verdiği cevapları gösteren, fare hareketiyle hafifçe 3D
 * eğilen kart — 21st.dev "3D Card" bileşeninin proje temamıza (arka
 * plan fotoğrafı yerine mor-pembe degrade, düz CSS + framer-motion)
 * uyarlanmış hali. Panelden ayrılmadan, aynı ekranda modal olarak açılır.
 */
export default function InvitationAnswerCard({
  recipientName,
  activity,
  timeSlot,
  location,
  meetingDate,
  onClose,
}) {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="answer-card-perspective">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="answer-card"
      >
        <div
          style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
          className="answer-card-inner"
        >
          {/* Arka plan: fotoğraf yerine temamızın mor-pembe degradesi */}
          <div className="answer-card-bg" aria-hidden="true">
            <span className="answer-card-bg-emoji">{activity?.emoji ?? "🎉"}</span>
          </div>

          <div className="answer-card-content">
            <div className="answer-card-header">
              <div>
                <motion.h2 style={{ transform: "translateZ(50px)" }} className="answer-card-title">
                  {recipientName}
                </motion.h2>
                <motion.p style={{ transform: "translateZ(40px)" }} className="answer-card-subtitle">
                  kabul etti 💗
                </motion.p>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: "8deg" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Kapat"
                style={{ transform: "translateZ(60px)" }}
                className="answer-card-close-btn"
              >
                ✕
              </motion.button>
            </div>

            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="answer-card-rows"
            >
              <div className="answer-card-row">
                <span className="answer-card-row-label">Yer</span>
                <span className="answer-card-row-value">{location ?? "-"}</span>
              </div>
              <div className="answer-card-row">
                <span className="answer-card-row-label">Aktivite</span>
                <span className="answer-card-row-value">{activity?.label ?? "-"}</span>
              </div>
              <div className="answer-card-row">
                <span className="answer-card-row-label">Zaman dilimi</span>
                <span className="answer-card-row-value">
                  {timeSlot ? `${timeSlot.label} (${timeSlot.range})` : "-"}
                </span>
              </div>
              <div className="answer-card-row">
                <span className="answer-card-row-label">Tarih</span>
                <span className="answer-card-row-value">{meetingDate ?? "-"}</span>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ transform: "translateZ(40px)" }}
              className="answer-card-footer-btn"
            >
              Kapat
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
