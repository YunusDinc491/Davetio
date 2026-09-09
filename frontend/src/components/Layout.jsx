import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  

  // Alıcı tarafı (Ahmet'in tıkladığı davet linki, /i/:slug), açılış
  // sayfası (/) ve giriş/üye ol sayfaları tamamen kendi tam ekran
  // tasarımıyla gösteriliyor — üstte site header'ı yok, sayfa baştan
  // sona kendi rengiyle kaplı (marka adı kartın kendi içinde).
  const BARE_PATHS = ["/", "/login", "/register", "/invitations/new", "/dashboard"];
  const isBareLayout = location.pathname.startsWith("/i/") || BARE_PATHS.includes(location.pathname);

  if (isBareLayout) {
    return <div className="app-shell app-shell-bare">{children}</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to={user ? "/dashboard" : "/"} className="brand">
          Davetio
        </Link>
        <nav>
          {user ? (
            <>
              
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Çıkış yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-link">
                Giriş yap
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ width: "auto" }}>
                Üye ol
              </Link>
            </>
          )}
        </nav>
      </header>
      {children}
    </div>
  );
}
