import { useState } from "react";
import { useLang } from "../../context/LangContext";

const SUGGESTIONS = [
  "Paracetamol", "Metformin", "Amoxicillin", "Omeprazole",
  "Azithromycin", "Atorvastatin", "Cetirizine", "Ibuprofen",
  "Pantoprazole", "Dolo 650",
];

export default function SearchBar({ onSearch, loading, initialValue = "" }) {
  const { t } = useLang();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="input pl-11 pr-4 py-3.5 text-base shadow-sm"
            autoFocus
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" disabled={loading || !value.trim()} className="btn-primary px-6 py-3.5 text-base">
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {t("searchBtn")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <span className="text-xs text-slate-400 font-medium">{t("try")}</span>
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => { setValue(s); onSearch(s); }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
