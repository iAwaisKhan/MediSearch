import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCompare } from "../hooks/useMedicine";
import { useLang }    from "../context/LangContext";
import CompareCard from "../components/medicine/CompareCard";
import Spinner     from "../components/ui/Spinner";
import ErrorBox    from "../components/ui/ErrorBox";
import PageHeader  from "../components/ui/PageHeader";

const QUICK_PAIRS = [
  ["Paracetamol",  "Ibuprofen"],
  ["Metformin",    "Glipizide"],
  ["Omeprazole",   "Pantoprazole"],
  ["Amoxicillin",  "Azithromycin"],
  ["Atorvastatin", "Rosuvastatin"],
];

export default function ComparePage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const { t }           = useLang();
  const { data, loading, error, cached, compare, reset } = useCompare();

  const [medA, setMedA] = useState(searchParams.get("a") || "");
  const [medB, setMedB] = useState(searchParams.get("b") || "");

  // Auto-run if URL has both params
  useEffect(() => {
    const a = searchParams.get("a"), b = searchParams.get("b");
    if (a && b) { setMedA(a); setMedB(b); compare(a, b); }
  }, []); // eslint-disable-line

  const handleCompare = () => {
    if (!medA.trim() || !medB.trim()) return;
    navigate(`/compare?a=${encodeURIComponent(medA)}&b=${encodeURIComponent(medB)}`, { replace: true });
    compare(medA.trim(), medB.trim());
  };

  const handleFollowUp = (q) => navigate(`/search?q=${encodeURIComponent(q)}`);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <PageHeader
        eyebrow="Medicine Compare"
        title={t("compare")}
        subtitle="Compare two medicines side by side — dosage, side effects, generics and more."
      />

      {/* Input panel */}
      <div className="card p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div>
            <label className="label">{t("comparePlaceholder1")}</label>
            <input
              className="input"
              value={medA}
              onChange={(e) => { setMedA(e.target.value); reset(); }}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              placeholder="e.g. Paracetamol"
              autoFocus
            />
          </div>
          <div className="hidden md:flex items-center justify-center">
            <span className="font-display text-xl font-bold text-slate-400 mt-5">VS</span>
          </div>
          <div>
            <label className="label">{t("comparePlaceholder2")}</label>
            <input
              className="input"
              value={medB}
              onChange={(e) => { setMedB(e.target.value); reset(); }}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              placeholder="e.g. Ibuprofen"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCompare}
            disabled={loading || !medA.trim() || !medB.trim()}
            className="btn-primary px-6 py-2.5"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Comparing…</>
              : <>{t("compareBtn")} →</>}
          </button>
          <div className="flex flex-wrap gap-2">
            {QUICK_PAIRS.map(([a, b]) => (
              <button key={`${a}${b}`} className="chip"
                onClick={() => { setMedA(a); setMedB(b); compare(a, b); }}>
                {a} vs {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Spinner size="lg" />
          <p className="text-sm text-slate-400 animate-pulse">Comparing <strong>{medA}</strong> vs <strong>{medB}</strong>…</p>
        </div>
      )}

      {error && !loading && <ErrorBox message={error} onRetry={() => compare(medA, medB)} />}

      {data && !loading && (
        <CompareCard data={data} cached={cached} onFollowUp={handleFollowUp} />
      )}
    </div>
  );
}
