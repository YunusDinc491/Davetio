import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sparkles from "../components/Sparkles";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

    async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre gerekli.");
      return;
    }
    try {
      await login(username, password);
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
        <form className="auth-form-side" onSubmit={handleSubmit}>
          <h2 className="auth-title">Giriş yap</h2>
          <p className="auth-subtitle">Panelinden davetlerini yönetmeye devam et.</p>

          {error && <div className="auth-error-text">{error}</div>}

          <div className="auth-field">
            <label htmlFor="username">Kullanıcı adı</label>
            <input
              id="username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullaniciadi"
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
                autoComplete="current-password"
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

          <button type="submit" className="btn hero-btn-yes hero-btn-wide auth-submit">
            Giriş yap
          </button>

          <p className="auth-muted-link">
            Hesabın yok mu? <Link to="/register">Üye ol</Link>
          </p>
        </form>

        <div className="auth-accent">
          <span className="auth-brand">Davet.io</span>
          <span className="auth-accent-emoji" aria-hidden="true">💌</span>
          <h2>Tekrar hoşgeldin!</h2>
          <p>Kimler teklifine cevap verdi acaba? Görmek için giriş yap.</p>
        </div>
      </div>
    </div>
  );
}
