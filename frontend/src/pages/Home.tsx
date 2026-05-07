import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/medicine/SearchBar";

const FEATURES = [
  { icon: "🔍", title: "Instant Search",       desc: "Get complete medicine info in seconds powered by Claude AI." },
  { icon: "⚖️", title: "Side-by-Side Compare", desc: "Compare two medicines across purpose, dosage, side effects and more." },
  { icon: "💚", title: "Generic Alternatives",  desc: "Find cheaper Indian generic brands with real price comparisons." },
  { icon: "🇮🇳", title: "Hindi Support",        desc: "Full medicine information available in Hindi (हिंदी) with one click." },
  { icon: "⚡", title: "Smart Caching",          desc: "Repeated searches are instant — results cached at DB level." },
  { icon: "📋", title: "Search History",         desc: "Logged-in users get a personal searchable history with stats." },
];

export default function Home() {
  const navigate   = useNavigate();
  const { t }      = useLang();
  const { isAuth } = useAuth();

  const handleSearch = (name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 0%, transparent 60%), radial-gradient(circle at 75% 20%, white 0%, transparent 50%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/20">
            {t("tagline")}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Know Your <em className="text-brand-100 not-italic">Medicine</em>
          </h1>
          <p className="text-white/75 text-lg font-light mb-10 max-w-xl mx-auto">
            {t("heroSub")}
          </p>
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} loading={false} />
          </div>
          {!isAuth && (
            <p className="text-white/60 text-sm mt-6">
              <a href="/register" className="text-white underline underline-offset-2 hover:text-brand-100">
                Create a free account
              </a>{" "}
              to save your search history.
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">Why MediSearch</span>
          <h2 className="font-display text-3xl font-bold text-slate-800 mt-2">Everything you need to know</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 hover:shadow-md transition group">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-brand-400 transition">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-600 mb-3">Start searching now</h2>
          <p className="text-brand-400 text-sm mb-6">No account needed to search. Sign up to unlock history & personalisation.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/search"   className="btn-primary px-6 py-3">Search a Medicine</a>
            <a href="/compare"  className="btn-secondary px-6 py-3">Compare Medicines</a>
          </div>
        </div>
      </section>
    </div>
  );
}
