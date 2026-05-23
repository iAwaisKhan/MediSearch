import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white border border-slate-200/60 text-slate-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:text-slate-900 transition-all duration-300"
        aria-label="Toggle Footer"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer Container */}
      <footer
        className={`fixed bottom-0 left-0 w-full bg-white border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-40 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg border border-[#7AA95C] text-[#7AA95C] flex items-center justify-center text-lg font-light">
              +
            </span>
            <span className="font-display font-medium text-xl text-slate-800 tracking-tight">
              MediSearch
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-md">
            ⚕ For educational purposes only. Always consult a qualified doctor or pharmacist before taking any medicine.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <Link to="/search"  className="hover:text-slate-700 transition">Search</Link>
            <Link to="/compare" className="hover:text-slate-700 transition">Compare</Link>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs">Powered by AI</span>
          </div>
        </div>
      </footer>
    </>
  );
}
