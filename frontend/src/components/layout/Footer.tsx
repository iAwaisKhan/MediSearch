import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💊</span>
          <span className="font-display font-bold text-slate-700">
            Medi<em className="text-brand-300 not-italic">Search</em>
          </span>
        </div>
        <p className="text-xs text-slate-400 text-center max-w-md">
          ⚕ For educational purposes only. Always consult a qualified doctor or pharmacist before taking any medicine.
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <Link to="/search"  className="hover:text-brand-300 transition">Search</Link>
          <Link to="/compare" className="hover:text-brand-300 transition">Compare</Link>
          <span>Powered by Claude AI</span>
        </div>
      </div>
    </footer>
  );
}
