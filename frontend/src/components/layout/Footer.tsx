import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white/30 backdrop-blur-md border-t border-slate-200/50 py-3 px-6 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 opacity-60">
          <span className="w-5 h-5 rounded border border-slate-400 text-slate-500 flex items-center justify-center text-[10px] font-medium">
            +
          </span>
          <span className="font-display font-medium text-sm text-slate-600 tracking-tight">
            MediSearch
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium tracking-wide">
          ⚕ Educational use only. Consult a doctor.
        </p>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          <Link to="/search"  className="hover:text-slate-800 transition">Search</Link>
          <Link to="/compare" className="hover:text-slate-800 transition">Compare</Link>
        </div>
      </div>
    </footer>
  );
}
