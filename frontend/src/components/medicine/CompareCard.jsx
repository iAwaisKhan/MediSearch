import { useLang } from "../../context/LangContext";

function Row({ label, value }) {
  return (
    <div className="px-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{value || "—"}</p>
    </div>
  );
}

function SingleCard({ med, index }) {
  const { t } = useLang();
  const colors = ["from-brand-600 to-brand-400", "from-slate-700 to-slate-500"];
  return (
    <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div className={`bg-gradient-to-br ${colors[index]} p-4 text-white`}>
        <div className="text-3xl mb-2">{med.emoji || "💊"}</div>
        <h3 className="font-display text-xl font-bold leading-tight">{med.name}</h3>
        <p className="text-white/70 text-xs mt-0.5">{med.genericName}</p>
        <span className="mt-2 inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
          {med.category}
        </span>
      </div>

      <Row label={t("purpose")}   value={med.purpose} />
      <Row label={t("dosage")}    value={med.dosage} />
      <Row label={t("side")}      value={(med.sideEffects  || []).slice(0, 3).join(", ")} />
      <Row label={t("avoid")}     value={(med.notSuitableFor || []).slice(0, 2).join(", ")} />
      <Row label={t("interact")}  value={(med.interactions || []).slice(0, 2).join(", ")} />
      <Row label={t("storage")}   value={med.storage} />

      {/* Warning */}
      <div className="bg-amber-50 px-4 py-3 border-t border-amber-100">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-amber-300 mb-1">⚠ {t("warning")}</p>
        <p className="text-xs text-amber-400">{med.warning}</p>
      </div>

      {/* Generics */}
      {med.generics?.length > 0 && (
        <div className="bg-brand-50 px-4 py-3 border-t border-brand-100">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-brand-300 mb-2">
            💚 {t("generics")}
          </p>
          <div className="flex flex-col gap-1.5">
            {med.generics.slice(0, 2).map((g, i) => (
              <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-brand-100">
                <div>
                  <p className="text-xs font-semibold text-brand-500">{g.name}</p>
                  <p className="text-[10px] text-slate-400">{g.manufacturer}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-400 font-medium">₹{g.price}</p>
                  <span className="text-[10px] bg-brand-100 text-brand-500 px-1.5 py-0.5 rounded-full">
                    -{g.savings}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompareCard({ data, cached, onFollowUp }) {
  const { t } = useLang();
  const [a, b] = data;

  return (
    <div className="space-y-4">
      {cached && (
        <div className="text-center">
          <span className="badge-green text-[11px]">⚡ {t("cachedResult")}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SingleCard med={a} index={0} />
        <SingleCard med={b} index={1} />
      </div>

      {/* Follow-up */}
      {onFollowUp && (
        <div className="card px-5 py-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">Ask more:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t("whichBetter"),     q: `Which is better: ${a.name} or ${b.name}?` },
              { label: t("canTakeTogether"), q: `Can I take ${a.name} and ${b.name} together?` },
            ].map(({ label, q }) => (
              <button key={label} className="chip" onClick={() => onFollowUp(q)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-slate-400">{t("disclaimer")}</p>
    </div>
  );
}
