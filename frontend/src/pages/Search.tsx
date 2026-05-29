import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMedicine } from "../hooks/useMedicine";
import { useLang } from "../context/LangContext";
import SearchBar    from "../components/medicine/SearchBar";
import ImageUpload  from "../components/medicine/ImageUpload";
import MedicineCard from "../components/medicine/MedicineCard";
import Spinner      from "../components/ui/Spinner";
import ErrorBox     from "../components/ui/ErrorBox";
import PageHeader   from "../components/ui/PageHeader";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t }    = useLang();
  const { data, loading, error, cached, search, reset } = useMedicine();
  const lastQuery = useRef("");
  const [showOcr, setShowOcr] = useState(false);

  // Run search if ?q= in URL on mount / URL change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q && q !== lastQuery.current) {
      lastQuery.current = q;
      search(q);
    }
    if (!q) reset();
  }, [searchParams]); // eslint-disable-line

  const handleSearch = (name) => {
    lastQuery.current = name;
    setSearchParams({ q: name });
    search(name);
    setShowOcr(false); // Close OCR panel after selecting a medicine
  };

  const handleFollowUp = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <PageHeader
        eyebrow="Medicine Search"
        title={t("search")}
        subtitle="Enter any medicine name to get complete, AI-powered information."
      />

      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          initialValue={searchParams.get("q") || ""}
          showOcr={showOcr}
          onToggleOcr={() => setShowOcr((prev) => !prev)}
        />

        {/* OCR Image Upload Panel */}
        {showOcr && (
          <ImageUpload onMedicineDetected={handleSearch} />
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Spinner size="lg" />
          <p className="text-sm text-slate-400 animate-pulse">
            Looking up <strong>{searchParams.get("q")}</strong>…
          </p>
        </div>
      )}

      {error && !loading && (
        <ErrorBox message={error} onRetry={() => search(searchParams.get("q") || "")} />
      )}

      {data && !loading && (
        <MedicineCard data={data} cached={cached} onFollowUp={handleFollowUp} />
      )}
    </div>
  );
}

