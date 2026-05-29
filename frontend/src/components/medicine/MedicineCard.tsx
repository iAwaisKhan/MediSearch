import { useState } from "react";
import { useLang } from "../../context/LangContext";

/* ── Safety score heuristic ──────────────────────────────────────────── */
function getSafetyScore(data) {
  const e = data.sideEffects?.length || 0;
  const w = data.warning ? 1 : 0;
  const c = data.notSuitableFor?.length || 0;
  const t = e + w * 2 + c;
  if (t <= 2) return { score: 9.2, label: "Very Safe",        accent: "#22c55e", bg: "#f0fdf4" };
  if (t <= 5) return { score: 7.5, label: "Generally Safe",   accent: "#0F6E56", bg: "#E1F5EE" };
  if (t <= 8) return { score: 5.8, label: "Use with Caution", accent: "#d97706", bg: "#fffbeb" };
  return              { score: 3.5, label: "Consult Doctor",   accent: "#dc2626", bg: "#fef2f2" };
}

/* ── Bullet list ─────────────────────────────────────────────────────── */
function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return <span className="text-slate-300 text-sm italic">No data available</span>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start text-[13px] text-slate-600 leading-relaxed">
          <span className="w-[5px] h-[5px] rounded-full bg-slate-300 mt-[7px] shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Stat pill for Quick Facts ───────────────────────────────────────── */
function StatPill({ emoji, value, label }: { emoji: string; value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 px-2">
      <span className="text-lg">{emoji}</span>
      <span className="text-lg font-bold text-[#2C2C2C]">{value}</span>
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

/* ── Expandable accordion item ───────────────────────────────────────── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100/80 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition">{title}</span>
        <svg
          className={`w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ── Generic alternative card ────────────────────────────────────────── */
function GenericCard({ g }) {
  return (
    <div className="bg-[#F6F6F2] rounded-2xl p-4 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-200/60">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-[#2C2C2C] text-[13px] truncate">{g.name}</p>
          <p className="text-slate-400 text-[11px] mt-0.5">{g.manufacturer}</p>
        </div>
        <span className="bg-[#E1F5EE] text-[#0F6E56] text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
          -{g.savings}%
        </span>
      </div>
      <p className="text-[#0F6E56] text-sm font-bold mt-2">₹{g.price}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function MedicineCard({ data, cached, onFollowUp }) {
  const { t } = useLang();
  const safety = getSafetyScore(data);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="animate-fade-up space-y-4">

      {/* ───────── CARD 1: Medicine Overview ───────────────────────── */}
      <div className="card overflow-hidden">
        {/* Top bar — Category + Cache badge */}
        <div className="px-6 pt-5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {data.category}
          </span>
          {cached && (
            <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
              ⚡ Instant result
            </span>
          )}
        </div>

        {/* Name + Emoji hero */}
        <div className="px-6 pt-3 pb-2 flex items-start gap-4">
          <div className="w-14 h-14 bg-[#F6F6F2] rounded-2xl flex items-center justify-center text-3xl shrink-0 overflow-hidden shadow-sm">
            {data.emoji && data.emoji !== "💊" ? data.emoji : (
              <img src="/pill-3d.png" alt="Medicine" className="w-full h-full object-cover scale-[1.15]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-[26px] font-bold text-[#111] leading-tight tracking-tight">
              {data.name}
            </h2>
            {data.genericName && (
              <p className="text-slate-400 text-xs mt-1">{data.genericName}</p>
            )}
          </div>
        </div>

        {/* AI purpose summary */}
        <div className="px-6 pb-5">
          <p className="text-[13px] text-slate-500 leading-[1.7]">{data.purpose}</p>
        </div>

        {/* Quick Facts — Minimalist Professional Row */}
        <div className="px-5 pb-5 grid grid-cols-3 gap-3">
          
          {/* Safety */}
          <div className="bg-slate-50/50 rounded-[20px] p-4 border border-slate-100/60 transition-all hover:bg-white hover:shadow-md hover:border-slate-200/50">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: safety.bg }}>
               <span className="text-[12px] font-black tracking-tight" style={{ color: safety.accent }}>{safety.score}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Safety Level</p>
            <p className="text-[13px] font-bold leading-tight" style={{ color: safety.accent }}>{safety.label}</p>
          </div>

          {/* Side Effects */}
          <div className="bg-slate-50/50 rounded-[20px] p-4 border border-slate-100/60 transition-all hover:bg-white hover:shadow-md hover:border-slate-200/50">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mb-3 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Side Effects</p>
            <p className="text-[15px] font-bold text-amber-500 leading-tight">
              {data.sideEffects?.length || 0} <span className="text-[12px] font-medium text-slate-400">known</span>
            </p>
          </div>

          {/* Alternatives */}
          <div className="bg-slate-50/50 rounded-[20px] p-4 border border-slate-100/60 transition-all hover:bg-white hover:shadow-md hover:border-slate-200/50">
            <div className="w-9 h-9 rounded-full overflow-hidden mb-3 border border-slate-200/50 shadow-sm">
              <img src="/pill-3d.png" alt="Alternatives" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Alternatives</p>
            <p className="text-[15px] font-bold text-[#0F6E56] leading-tight">
              {data.generics?.length || 0} <span className="text-[12px] font-medium text-slate-400">options</span>
            </p>
          </div>

        </div>
      </div>

      {/* ───────── CARD 2: Dosage ──────────────────────────────────── */}
      <div className="card px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7AA95C] mb-3">
          Dosage
        </p>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-slate-100/80 bg-slate-50/50">
            <img src="/pill-3d.png" alt="Dosage" className="w-full h-full object-cover scale-[1.15]" />
          </div>
          <p className="text-[14px] text-[#2C2C2C] font-medium leading-relaxed flex-1">
            {data.dosage}
          </p>
        </div>
      </div>

      {/* ───────── CARD 3: Side Effects ────────────────────────────── */}
      <div className="card px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">
            Side Effects
          </p>
          <span className="text-[10px] font-medium text-slate-300">
            {data.sideEffects?.length || 0} known
          </span>
        </div>
        <Bullets items={data.sideEffects} />
      </div>

      {/* ───────── CARD 4: Generic Alternatives ────────────────────── */}
      {data.generics?.length > 0 && (
        <div className="card px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0F6E56] mb-4">
            💚 Affordable Alternatives
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.generics.map((g, i) => <GenericCard key={i} g={g} />)}
          </div>
        </div>
      )}

      {/* ───────── WARNING STRIP ───────────────────────────────────── */}
      {data.warning && (
        <div className="card px-6 py-4 border-l-4 border-l-amber-300" style={{ borderLeftWidth: "4px" }}>
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 mb-1">{t("warning")}</p>
              <p className="text-[13px] text-slate-600 leading-relaxed">{data.warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* ───────── MORE INFORMATION (Collapsible) ──────────────────── */}
      <div className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition"
        >
          <span className="text-[13px] font-semibold text-slate-500">
            {moreOpen ? "Hide Details" : "▾ More Information"}
          </span>
          <svg
            className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`grid transition-all duration-400 ease-in-out ${moreOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="px-6 pb-2">
              <Accordion title="📋  How to Take">
                <Bullets items={data.howToTake} />
              </Accordion>
              <Accordion title="🔒  Precautions">
                <Bullets items={data.precautions} />
              </Accordion>
              <Accordion title="🔄  Drug Interactions">
                <Bullets items={data.interactions} />
              </Accordion>
              <Accordion title="✅  Suitable For">
                <Bullets items={data.suitableFor} />
              </Accordion>
              <Accordion title="🚫  Not Suitable For">
                <Bullets items={data.notSuitableFor} />
              </Accordion>
              <Accordion title="🏠  Storage">
                <p className="text-[13px] text-slate-600 leading-relaxed">{data.storage}</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── FOLLOW-UP CHIPS ─────────────────────────────────── */}
      {onFollowUp && (
        <div className="card px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">Ask More</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t("pregnancySafe"),  q: `Is ${data.name} safe during pregnancy?` },
              { label: t("forChildren"),    q: `Can children take ${data.name}?` },
              { label: t("overdoseRisk"),   q: `What is the overdose risk of ${data.name}?` },
              { label: t("alternatives"),   q: `What are the best alternatives to ${data.name}?` },
            ].map(({ label, q }) => (
              <button key={label} className="chip" onClick={() => onFollowUp(q)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ───────── DISCLAIMER ──────────────────────────────────────── */}
      <p className="text-center text-[11px] text-slate-300 pb-2">{t("disclaimer")}</p>
    </div>
  );
}
