import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DodgeButton from "../components/DodgeButton";
import FloatingHearts from "../components/FloatingHearts";
import CharacterDuo from "../components/CharacterDuo";
import Sparkles from "../components/Sparkles";
import Calendar from "../components/Calendar";
import { getInvite, respondToInvite } from "../api/invitations";
import { TIME_SLOTS, ACTIVITIES, LOCATIONS } from "../lib/catalog";

// "welcome" ekranı artık karşılama + ilk soruyu (buluşma teklifi) tek sayfada
// birleştiriyor — Ahmet linke tıklayınca doğrudan bunu görüyor.
// Tarih seçimi, saat (zaman dilimi) seçiminden ÖNCE geliyor.
const STEPS = ["welcome", "date", "time", "activity", "location", "confirm", "done"];

const DODGE_LABELS = [
  "Hayır",
  "Emin misin?",
  "Gerçekten mi?",
  "Son bir şansın var!",
  "Tamam, pes ediyorum 😅",
];

// "Evet!" kutlamasında kartı dolduran noktalar — farklı yerlerden belirip
// goo (metaball) filtresiyle birleşerek kartı pembeye boyuyorlar.
const CELEBRATE_DOTS = [
  { left: "-5%", top: "-5%", delay: 0 },
  { left: "50%", top: "-8%", delay: 70 },
  { left: "105%", top: "-5%", delay: 40 },
  { left: "-8%", top: "50%", delay: 110 },
  { left: "50%", top: "45%", delay: 170 },
  { left: "108%", top: "50%", delay: 90 },
  { left: "-5%", top: "105%", delay: 200 },
  { left: "50%", top: "108%", delay: 140 },
  { left: "105%", top: "105%", delay: 190 },
];

export default function InviteFlow() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [location, setLocation] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeSlot, setTimeSlot] = useState(null);
  const [activity, setActivity] = useState(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const choiceZoneRef = useRef(null);
  const heroYesRef = useRef(null);
  const heroSceneRef = useRef(null);
  const confirmSceneRef = useRef(null);
  const confirmZoneRef = useRef(null);
  const confirmYesRef = useRef(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
    let cancelled = false;
    getInvite(slug)
      .then((data) => {
        if (!cancelled) setInvitation(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center" }}>
          <p>Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (loadError || !invitation) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Bu davet bulunamadı 💔</h2>
          <p>Link yanlış olabilir ya da davet kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }

  if (invitation.status === "Completed" && step !== "done") {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Bu davet zaten yanıtlandı 🎉</h2>
          <p>{invitation.recipientName}, planınız zaten oluşturuldu.</p>
        </div>
      </div>
    );
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  // "Evet!" ile buluşma teklifi kabul edilince: kart komple pembeye dönüp
  // sevinen ayı emojisini gösteriyor, kısa bir kutlamanın ardından
  // otomatik olarak bir sonraki adıma geçiyor.
  function handleWelcomeYes() {
    setCelebrating(true);
    setTimeout(() => {
      goNext();
    }, 1300);
  }

  async function handleFinalConfirm() {
    setSubmitError("");
    try {
      await respondToInvite(slug, { timeSlot, activity, location, meetingDate });
      goNext();
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  // --- İlk sayfa: karşılama + "benimle çıkar mısın" sorusu ---
  if (step === "welcome") {
    return (
      <div className="hero-scene" ref={heroSceneRef}>
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "12%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, hoşgeldin</p>

          <CharacterDuo />

          <h1 className="hero-title">Benimle buluşmak ister misin?</h1>
          <p className="hero-subtitle">Sadece bir doğru cevap var 😉</p>

          <div className="choice-zone" ref={choiceZoneRef}>
            <button
              ref={heroYesRef}
              className="btn hero-btn-yes choice-static-btn"
              onClick={handleWelcomeYes}
            >
              Evet! 💕
            </button>
          </div>

          {/* Kart aynı boyutta kalır — farklı yerlerden beliren noktalar
              goo filtresiyle birleşip kartı pembeye boyuyor, sonraki adıma
              bu katmanın üstünden geçilir. */}
          {celebrating && (
            <div className="celebrate-overlay">
              <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                <defs>
                  <filter id="celebrate-goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                      result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                  </filter>
                </defs>
              </svg>
              <div className="celebrate-goo">
                {CELEBRATE_DOTS.map((d, i) => (
                  <span
                    key={i}
                    className="celebrate-dot"
                    style={{ left: d.left, top: d.top, animationDelay: `${d.delay}ms` }}
                  />
                ))}
              </div>
              <div className="celebrate-overlay-content">
                <span className="celebrate-emoji" aria-hidden="true">🐻</span>
                <h2 className="celebrate-text">Yaşasın! 🎉</h2>
                <p className="celebrate-subtext">Hazırlanıyoruz…</p>
              </div>
            </div>
          )}
        </div>

        {!celebrating && (
          <DodgeButton
            containerRef={heroSceneRef}
            anchorRef={heroYesRef}
            labels={DODGE_LABELS}
            className="dodge-glass"
          />
        )}
      </div>
    );
  }

  // --- İkinci sayfa: tarih seçimi — saat seçiminden önce, aynı tema ---
  if (step === "date") {
    return (
      <div className="hero-scene">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "32%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, bir adım daha</p>

          <h2 className="hero-step-title">Hangi tarih? 📅</h2>

          <Calendar value={meetingDate} onChange={setMeetingDate} />

          <button
            className="btn hero-btn-yes hero-btn-wide"
            disabled={!meetingDate}
            onClick={goNext}
          >
            Devam et
          </button>
        </div>
      </div>
    );
  }

  // --- Üçüncü sayfa: "ne zaman müsaitsin" — welcome ile aynı tema ---
  if (step === "time") {
    return (
      <div className="hero-scene">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "50%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, yolun yarısında</p>

          <h2 className="hero-step-title">Ne zaman müsaitsin? ⏰</h2>

          <div className="hero-option-grid">
            {TIME_SLOTS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`hero-option-card ${timeSlot === t.id ? "selected" : ""}`}
                onClick={() => setTimeSlot(t.id)}
              >
                <span className="hero-option-label">{t.label}</span>
                <span className="hero-option-range">{t.range}</span>
              </button>
            ))}
          </div>

          <button
            className="btn hero-btn-yes hero-btn-wide"
            disabled={!timeSlot}
            onClick={goNext}
          >
            Devam et
          </button>
        </div>
      </div>
    );
  }

  // --- Dördüncü sayfa: "ne yapalım" — aynı tema ---
  if (step === "activity") {
    return (
      <div className="hero-scene">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "68%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, neredeyse tamam</p>

          <h2 className="hero-step-title">Ne yapalım? 🎀</h2>

          <div className="hero-option-grid">
            {ACTIVITIES.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`hero-option-card ${activity === a.id ? "selected" : ""}`}
                onClick={() => setActivity(a.id)}
              >
                <span className="hero-option-emoji">{a.emoji}</span>
                <span className="hero-option-label">{a.label}</span>
              </button>
            ))}
          </div>

          <button
            className="btn hero-btn-yes hero-btn-wide"
            disabled={!activity}
            onClick={goNext}
          >
            Devam et
          </button>
        </div>
      </div>
    );
  }
  // --- "nerede" adımı — aynı tema ---
  if (step === "location") {
    return (
      <div className="hero-scene">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "72%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, son bir seçim</p>

          <h2 className="hero-step-title">Nerede? 📍</h2>

          <div className="hero-option-grid">
            {LOCATIONS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`hero-option-card ${location === l.id ? "selected" : ""}`}
                onClick={() => setLocation(l.id)}
              >
                <span className="hero-option-label">{l.label}</span>
              </button>
            ))}
          </div>

          <button
            className="btn hero-btn-yes hero-btn-wide"
            disabled={!location}
            onClick={goNext}
          >
            Devam et
          </button>
        </div>
      </div>
    );
  }
  // --- Beşinci sayfa: son onay — welcome'daki gibi kaçan "Hayır" butonu ---
  if (step === "confirm") {
    return (
      <div className="hero-scene" ref={confirmSceneRef}>
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />
        <FloatingHearts />

        <div className="glass-panel">
          <div className="hero-progress-track">
            <div className="hero-progress" style={{ width: "86%" }} />
          </div>

          <p className="hero-eyebrow">{invitation.recipientName}, son bir adım</p>

          <h2 className="hero-step-title">Her şey hazır, emin misin? 💗</h2>
          <p className="hero-subtitle">
            {ACTIVITIES.find((a) => a.id === activity)?.label} ·{" "}
            {TIME_SLOTS.find((t) => t.id === timeSlot)?.label} ·{" "}
            {LOCATIONS.find((l) => l.id === location)?.label} ·{" "}
            {meetingDate &&
              new Date(meetingDate + "T00:00:00").toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
              })}
          </p>

          <div className="choice-zone" ref={confirmZoneRef}>
            {submitError && <div className="auth-error-text">{submitError}</div>}
            <button
              ref={confirmYesRef}
              className="btn hero-btn-yes choice-static-btn"
              onClick={handleFinalConfirm}

            >
              Evet, eminim!
            </button>
          </div>
        </div>

        <DodgeButton
          containerRef={confirmSceneRef}
          anchorRef={confirmYesRef}
          labels={DODGE_LABELS}
          className="dodge-glass"
        />
      </div>
    );
  }

  // --- Son sayfa: teşekkür — aynı tema ---
  return (
    <div className="hero-scene">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <Sparkles />
      <FloatingHearts />

      <div className="glass-panel glass-panel-celebrate">
        <div className="celebrate-content">
          <span className="celebrate-emoji" aria-hidden="true">🐻</span>
          <h2 className="celebrate-text">Teşekkürler {invitation.recipientName}! 🎉</h2>
          <p className="celebrate-subtext">Planın oluşturuldu, buluşmak için sabırsızlanıyoruz!</p>
          <p className="celebrate-subtext">Planın oluşturuldu, buluşmak için sabırsızlanıyoruz!</p>
          <p className="celebrate-subtext">
            Cevapların {invitation.ownerUsername}'na iletildi 💌
          </p><div className="impatient-hearts" aria-hidden="true">
            <span>💗</span>
            <span>💗</span>
            <span>💗</span>
          </div>

          <button
            type="button"
            className="btn hero-btn-yes hero-btn-wide celebrate-cta"
            onClick={() => navigate("/")}
          >
            Sen de davet etmek ister misin? 💌
          </button>
        </div>
      </div>
    </div>
  );
}
