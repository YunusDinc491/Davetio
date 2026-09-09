/**
 * İki şirin karakter (emoji tabanlı), arkalarında yumuşak bir ışık halesi,
 * hafif zıplama animasyonu ve üstünde patlayan mini kalple. Görsel dekor
 * amaçlı, tıklanamaz.
 */
export default function CharacterDuo() {
  return (
    <div className="hero-characters" aria-hidden="true">
      <span className="hero-pop-heart">💗</span>
      <span className="hero-character hero-bounce-a">🐻‍❄️</span>
      <span className="hero-character hero-bounce-b">🐻</span>
    </div>
  );
}
