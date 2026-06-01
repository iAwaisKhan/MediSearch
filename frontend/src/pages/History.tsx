import { useState, useEffect, useCallback } from "react";
import { historyAPI } from "../services/api";
import { useLang }    from "../context/LangContext";
import HistoryList from "../components/history/HistoryList";
import Spinner     from "../components/ui/Spinner";
import EmptyState  from "../components/ui/EmptyState";
import ErrorBox    from "../components/ui/ErrorBox";
import PageHeader  from "../components/ui/PageHeader";
import { Link }    from "react-router-dom";

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-bold font-display text-brand-400">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function HistoryPage() {
  const { t } = useLang();
  const [items,    setItems]    = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [total,    setTotal]    = useState(0);
  const [filter,   setFilter]   = useState("all");

  const fetchStats = useCallback(async () => {
    try {
      const statsRes = await historyAPI.getStats();
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Could not load stats", err);
    }
  }, []);

  const fetchData = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 20, ...(filter !== "all" && { type: filter }) };
      const histRes = await historyAPI.getAll(params);
      setItems(histRes.data.data);
      setPage(histRes.data.page);
      setPages(histRes.data.pages);
      setTotal(histRes.data.total);
    } catch (err: any) {
      setError(err.message || "Could not load history.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleDelete  = (id)  => setItems((prev) => prev.filter((i) => i._id !== id));
  const handleClearAll = ()   => { setItems([]); setStats(null); setTotal(0); };

  // Stats summary
  const totalSearches = stats?.stats?.find((s) => s._id === "search")?.count || 0;
  const totalCompares = stats?.stats?.find((s) => s._id === "compare")?.count || 0;
  const avgMs         = stats?.stats?.reduce((a, s) => a + (s.avgMs || 0), 0) / (stats?.stats?.length || 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <PageHeader
        eyebrow="Your Account"
        title={t("searchHistory")}
        subtitle="Every medicine you've searched or compared, all in one place."
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Searches" value={totalSearches} />
          <StatCard label="Comparisons" value={totalCompares} />
          <StatCard label="Avg Response" value={`${Math.round(avgMs || 0)}ms`} />
        </div>
      )}

      {/* Top searches */}
      {stats?.topSearches?.length > 0 && (
        <div className="card p-4 mb-6">
          <p className="label mb-3">{t("topSearches")}</p>
          <div className="flex flex-wrap gap-2">
            {stats.topSearches.map(({ _id, count }) => (
              <Link key={_id} to={`/search?q=${encodeURIComponent(_id)}`}
                className="chip flex items-center gap-1.5">
                {_id}
                <span className="bg-brand-100 text-brand-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "search", "compare"].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition border ${
              filter === f
                ? "bg-brand-300 text-white border-brand-300"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? "All" : f === "search" ? "🔍 Searches" : "⚖️ Comparisons"}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{total} total</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorBox message={error} onRetry={() => fetchData(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="📋"
          title={t("noHistory")}
          description="Start searching for medicines and your history will appear here."
          action={<Link to="/search" className="btn-primary">Search a Medicine</Link>}
        />
      ) : (
        <>
          <HistoryList items={items} onDelete={handleDelete} onClearAll={handleClearAll} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => fetchData(page - 1)}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-slate-500">
                {page} / {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => fetchData(page + 1)}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
