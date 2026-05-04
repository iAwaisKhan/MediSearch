import { useLang } from "../../context/LangContext";

function InfoCell({ label, children, full = false }) {
  return (
    <div className={`p-4 border-b border-slate-100 ${full ? "col-span-2" : ""}`}>
      <p className="section-label">{label}</p>
      <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  if (!items?.length) return <span className="text-slate-400">—</span>;
  return (
    <ul className="space-y-1 mt-0.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-start">
          <span className="text-brand-300 font-bold mt-0.5 shrink-0">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function GenericCard({ g }) {
  return (
    <div className="bg-white border border-brand-200 rounded-xl p-3 hover:shadow-sm transition">
      <p className="font-semibold text-brand-500 text-sm">{g.name}</p>
      <p className="text-brand-400 text-xs mt-0.5">₹{g.price}</p>
      <p className="text-slate-400 text-xs">{g.manufacturer}</p>
      <span className="mt-2 inline-block badge-green text-[10px] px-2 py-0.5">
        Save ~{g.savings}%
      </span>
    </div>
  );
}

export default function MedicineCard({ data, cached, onFollowUp }) {
  const { t } = useLang();

  return (
    <div className="card overflow-hidden animate-fade-up shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-400 p-5 flex items-start gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
          {data.emoji || "💊"}
        </div>
        <div className="text-white flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight">{data.name}</h2>
              {data.genericName && (
                <p className="text-white/70 text-xs mt-0.5">{data.genericName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {data.category}
              </span>
              {cached && (
                <span className="bg-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full">
                  ⚡ {t("cachedResult")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        <InfoCell label={t("purpose")}>
          <p>{data.purpose}</p>
        </InfoCell>
        <InfoCell label={t("dosage")}>
          <p>{data.dosage}</p>
        </InfoCell>
        <InfoCell label={t("howTo")}>
          <BulletList items={data.howToTake} />
        </InfoCell>
        <InfoCell label={t("side")}>
          <BulletList items={data.sideEffects} />
        </InfoCell>
        <InfoCell label={t("suitable")}>
          <BulletList items={data.suitableFor} />
        </InfoCell>
        <InfoCell label={t("avoid")}>
          <BulletList items={data.notSuitableFor} />
        </InfoCell>
        <InfoCell label={t("precaution")}>
          <BulletList items={data.precautions} />
        </InfoCell>
        <InfoCell label={t("interact")}>
          <BulletList items={data.interactions} />
        </InfoCell>
        <InfoCell label={t("storage")} full>
          <p>{data.storage}</p>
        </InfoCell>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border-t border-b border-amber-100 px-5 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-300 mb-1">
          ⚠ {t("warning")}
        </p>
        <p className="text-sm text-amber-400">{data.warning}</p>
      </div>

      {/* Generics */}
      {data.generics?.length > 0 && (
        <div className="bg-brand-50 px-5 py-4">
          <p className="section-label text-brand-400 mb-3">💚 {t("generics")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.generics.map((g, i) => <GenericCard key={i} g={g} />)}
          </div>
        </div>
      )}

      {/* Follow-up questions */}
      {onFollowUp && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-medium">Ask more:</p>
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

      {/* Disclaimer */}
      <div className="px-5 py-3 bg-white border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
