import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sparkles from "../components/Sparkles";
import { capitalizeFirst } from "../lib/text";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

    async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre gerekli.");
      return;
    }
    if (password !== passwordAgain) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    try {
      await register(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="hero-scene">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <Sparkles />

      <div className="auth-card">
        <div className="auth-accent">
          <span className="auth-brand">Davet.io</span>
          <span className="auth-accent-emoji" aria-hidden="true">🎀</span>
          <h2>Hoş geldin!</h2>
          <p>Hemen üye ol, teklif göndermeye başla!</p>
        </div>

        <form className="auth-form-side" onSubmit={handleSubmit}>
          <h2 className="auth-title">Üye ol</h2>
          <p className="auth-subtitle">Davet göndermeye 1 dakikada başla.</p>

          {error && <div className="auth-error-text">{error}</div>}

          <div className="auth-field">
            <label htmlFor="username">Adınız</label>
            <input
              id="username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(capitalizeFirst(e.target.value))}
              placeholder="Adınız"
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Şifre</label>
            <div className="auth-input-wrap">
              <input
                id="password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password2">Şifre (tekrar)</label>
            <input
              id="password2"
              className="auth-input"
              type={showPassword ? "text" : "password"}
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn hero-btn-yes hero-btn-wide auth-submit">
            Üye ol
          </button>

          <p className="auth-muted-link">
            Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
