import { useNavigate } from "react-router-dom";
import AnimatedMarqueeHero from "../components/AnimatedMarqueeHero";

export default function Home() {
  const navigate = useNavigate();

  return (
    <AnimatedMarqueeHero
      brandName="Davet.io"
      tagline="Reddedemeyeceğin bir teklif"
      title={
        <>
          Birine unutamayacağı
          <br />
          bir davet gönder
        </>
      }
      description="Bir davet linki oluştur, gönder. Zamanı, aktiviteyi ve tarihi karşı taraf seçsin — sürpriz sana gelsin."
      ctaText="Hemen başlayalım"
      onCtaClick={() => navigate("/register")}
    />
  );
}
