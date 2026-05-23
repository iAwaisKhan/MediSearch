import { useState } from "react";
import { useLang } from "../../context/LangContext";

const SUGGESTIONS = [
  "Paracetamol", "Ibuprofen", "Amoxicillin", "Metformin", "Atorvastatin"
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
      <form onSubmit={handleSubmit} className="flex items-center bg-white p-1.5 rounded-full shadow-sm border border-slate-200/60">
        <div className="flex-1 flex items-center bg-[#2C2C2C] rounded-full px-5 py-3 relative">
          <svg className="w-5 h-5 text-slate-400 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Try paracetamol, metformin, ibuprofen..."
            aria-label="Search medicine"
            className="bg-transparent text-white placeholder-slate-400 w-full ml-3 outline-none text-sm font-medium"
            autoFocus
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <button type="submit" disabled={loading || !value.trim()} className="px-6 py-3 text-slate-300 hover:text-slate-600 transition font-medium text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:hover:text-slate-300">
          {loading ? (
            <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
          ) : (
            <>
              Search <span className="font-sans">→</span>
            </>
          )}
        </button>
      </form>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mt-4 items-center justify-start ml-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => { setValue(s); onSearch(s); }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
