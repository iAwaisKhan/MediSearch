import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { historyAPI } from "../../services/api";
import { useLang } from "../../context/LangContext";
import toast from "react-hot-toast";

function HistoryItem({ item, onDelete }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await historyAPI.deleteItem(item._id);
      onDelete(item._id);
      toast.success("Removed from history.");
    } catch {
      toast.error("Could not delete item.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClick = () => {
    if (item.type === "compare") {
      navigate(`/compare?a=${encodeURIComponent(item.query)}&b=${encodeURIComponent(item.compareWith || "")}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(item.query)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50 rounded-xl cursor-pointer transition group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 text-lg ${item.type === "compare" ? "" : ""}`}>
          {item.type === "compare" ? "⚖️" : "🔍"}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            {item.type === "compare" ? `${item.query} vs ${item.compareWith}` : item.query}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-medium uppercase tracking-wide ${item.resultFound ? "text-brand-300" : "text-red-400"}`}>
              {item.resultFound ? "Found" : "Not found"}
            </span>
            {item.cachedResult && (
              <span className="text-[10px] text-slate-400">· ⚡ Cached</span>
            )}
            {item.responseTimeMs && (
              <span className="text-[10px] text-slate-400">· {item.responseTimeMs}ms</span>
            )}
            <span className="text-[10px] text-slate-400">
              · {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 transition shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
        title={t("deleteItem")}
      >
        {deleting ? (
          <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1H9a1 1 0 00-1 1m2 0h6" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function HistoryList({ items, onDelete, onClearAll }) {
  const { t } = useLang();
  const [clearing, setClearing] = useState(false);

  const handleClearAll = async () => {
    if (!window.confirm("Clear all search history?")) return;
    setClearing(true);
    try {
      await historyAPI.clearAll();
      onClearAll();
      toast.success("History cleared.");
    } catch {
      toast.error("Could not clear history.");
    } finally {
      setClearing(false);
    }
  };

  if (!items.length) return null;

  return (
    <div className="card divide-y divide-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </p>
        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="btn-danger text-xs py-1.5 px-3"
        >
          {clearing ? "Clearing…" : t("clearAll")}
        </button>
      </div>
      {items.map((item) => (
        <HistoryItem key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
