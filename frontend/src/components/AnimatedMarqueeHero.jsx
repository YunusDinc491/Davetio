import { motion } from "framer-motion";

// Görsel yolunu bilmediğimiz için şimdilik rastgele stok görseller
// kullanıyoruz — kullanıcı kendi görselleriyle değiştirecek.
const DEMO_IMAGES = [
  "https://picsum.photos/seed/davetio-1/500/700",
  "https://picsum.photos/seed/davetio-2/500/700",
  "https://picsum.photos/seed/davetio-3/500/700",
  "https://picsum.photos/seed/davetio-4/500/700",
  "https://picsum.photos/seed/davetio-5/500/700",
  "https://picsum.photos/seed/davetio-6/500/700",
  "https://picsum.photos/seed/davetio-7/500/700",
  "https://picsum.photos/seed/davetio-8/500/700",
];

const FADE_IN = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const TITLE_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/**
 * Ana sayfanın tam ekran, pembe tonlarda açılış (hero) bölümü —
 * üstte animasyonlu başlık/açıklama/CTA, altta kayan görsel şeridi.
 * (21st.dev "Animated Marquee Hero" bileşeninin proje temamıza,
 * düz CSS + framer-motion ile uyarlanmış hali.)
 */
export default function AnimatedMarqueeHero({
  brandName,
  tagline,
  title,
  description,
  ctaText,
  onCtaClick,
  images = DEMO_IMAGES,
}) {
  const duplicatedImages = [...images, ...images];

  return (
    <section className="landing-hero">
      <div className="aurora aurora-pink-a" />
      <div className="aurora aurora-pink-b" />
      <div className="aurora aurora-pink-c" />

      <div className="landing-hero-content">
        {brandName && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN}
            className="landing-brand"
          >
            {brandName}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.1 }}
          className="landing-tagline"
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={TITLE_CONTAINER}
          className="landing-title"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_IN} className="landing-title-word">
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.5 }}
          className="landing-description"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn hero-btn-yes landing-cta"
            onClick={onCtaClick}
          >
            {ctaText}
          </motion.button>
        </motion.div>
      </div>

      <div className="landing-marquee-wrap">
        <motion.div
          className="landing-marquee"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="landing-marquee-item"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
