import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const { lang, switchLang, t }  = useLang();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition px-3 py-1.5 rounded-lg ${
      isActive ? "bg-brand-50 text-brand-400" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center text-xl">💊</span>
          <span className="font-display font-bold text-xl text-slate-800">
            Medi<em className="text-brand-300 not-italic">Search</em>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/search"  className={navLinkClass}>{t("search")}</NavLink>
          <NavLink to="/compare" className={navLinkClass}>{t("compare")}</NavLink>
          {isAuth && <NavLink to="/history" className={navLinkClass}>{t("history")}</NavLink>}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <div className="flex bg-slate-100 rounded-full p-0.5 gap-0.5">
            {["en", "hi"].map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                aria-label={`Switch to ${l === "en" ? "English" : "Hindi"}`}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                  lang === l ? "bg-brand-300 text-white" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {l === "en" ? "EN" : "हिं"}
              </button>
            ))}
          </div>

          {/* Auth desktop */}
          {isAuth ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile"
                className="text-sm font-medium text-slate-700 hover:text-brand-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                <span className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
                {user?.name?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-sm">{t("logout")}</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"    className="btn-ghost">{t("login")}</Link>
              <Link to="/register" className="btn-primary">{t("register")}</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {[
            { to: "/search",  label: t("search") },
            { to: "/compare", label: t("compare") },
            ...(isAuth ? [{ to: "/history", label: t("history") }, { to: "/profile", label: t("profile") }] : []),
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className="divider my-1" />
          {isAuth ? (
            <button onClick={handleLogout} className="text-sm text-left text-red-500 px-3 py-1.5">
              {t("logout")}
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"    className="btn-secondary flex-1 justify-center" onClick={() => setMenuOpen(false)}>{t("login")}</Link>
              <Link to="/register" className="btn-primary  flex-1 justify-center" onClick={() => setMenuOpen(false)}>{t("register")}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
