import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition px-4 py-2 rounded-full ${
      isActive ? "text-slate-800 bg-white/60 shadow-sm border border-slate-200/40" : "text-slate-400 hover:text-slate-700 hover:bg-white/40"
    }`;

  return (
    <nav className="sticky top-0 z-50 pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-8 h-8 rounded-lg border border-[#7AA95C] text-[#7AA95C] flex items-center justify-center text-lg font-light group-hover:bg-[#7AA95C] group-hover:text-white transition">
            +
          </span>
          <span className="font-display font-medium text-xl text-slate-800 tracking-tight">
            MediSearch
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/search"  className={navLinkClass}>Search</NavLink>
          <NavLink to="/compare" className={navLinkClass}>Compare</NavLink>
          {isAuth && <NavLink to="/history" className={navLinkClass}>History</NavLink>}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Auth desktop */}
          {isAuth ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/50 transition">
                <span className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"    className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-secondary">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-200/50 text-slate-600"
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
        <div className="md:hidden mt-2 mx-4 bg-white/90 backdrop-blur rounded-2xl p-4 flex flex-col gap-2 shadow-sm border border-slate-100 animate-fade-in">
          {[
            { to: "/search",  label: "Search" },
            { to: "/compare", label: "Compare" },
            ...(isAuth ? [{ to: "/history", label: "History" }, { to: "/profile", label: "Profile" }] : []),
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className="divider my-2" />
          {isAuth ? (
            <button onClick={handleLogout} className="text-sm text-left text-slate-500 hover:text-slate-800 px-4 py-2">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login"    className="btn-ghost w-full justify-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-secondary w-full justify-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
