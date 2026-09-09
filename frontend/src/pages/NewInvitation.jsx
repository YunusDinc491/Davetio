import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInvitation } from "../api/invitations";
import Sparkles from "../components/Sparkles";
import { capitalizeFirst } from "../lib/text";

export default function NewInvitation() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Bir isim girmelisin.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const invitation = await createInvitation(name.trim());
      setCreatedLink(`${window.location.origin}/i/${invitation.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (createdLink) {
    return (
      <div className="hero-scene">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <Sparkles />

        <div className="glass-panel">
          <span className="auth-brand">Davet.io</span>
          <h2 className="hero-step-title">Davet hazır! 🎉</h2>
          <p className="hero-subtitle">Bu linki gönderebilirsin:</p>

          <div className="ni-link-box">{createdLink}</div>

          <button
            type="button"
            className="btn hero-btn-yes hero-btn-wide"
            onClick={() => navigator.clipboard?.writeText(createdLink)}
          >
            Linki kopyala
          </button>
          <button
            type="button"
            className="btn dodge-glass ni-secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Panele dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-scene">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <Sparkles />

      <form className="glass-panel" onSubmit={handleSubmit}>
        <span className="auth-brand">Davet.io</span>
        <h2 className="hero-step-title">Bugün kime davet yolluyoruz?</h2>
        <p className="hero-subtitle">İsmini gir, senin için özel bir link oluşturalım.</p>

        {error && <div className="auth-error-text">{error}</div>}

        <div className="auth-field">
          <label htmlFor="name">İsim</label>
          <input
            id="name"
            className="auth-input"
            value={name}
            onChange={(e) => setName(capitalizeFirst(e.target.value))}
            placeholder="Örn. Ahmet"
          />
        </div>
        <button type="submit" className="btn hero-btn-yes hero-btn-wide" disabled={submitting}>
          {submitting ? "Oluşturuluyor…" : "Link oluştur"}
        </button>

      </form>
    </div>
  );
}
