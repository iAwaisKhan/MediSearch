import { useNavigate } from "react-router-dom";
import SearchBar from "../components/medicine/SearchBar";

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Label */}
          <div className="mb-8 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#7AA95C]" />
            <span className="text-[#7AA95C] text-xs font-semibold uppercase tracking-widest">
              AI-POWERED MEDICINE SEARCH
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-medium text-slate-900 leading-[1.1] mb-6">
            Understand your <br className="hidden md:block"/> medicine <em className="text-[#7AA95C] font-serif italic font-medium">clearly.</em>
          </h1>

          {/* Sub-headline */}
          <p className="text-slate-500 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed">
            Drug information, interaction checks, and generic alternatives <br className="hidden md:block" />
            — explained simply.
          </p>

          {/* Search */}
          <div className="w-full">
            <SearchBar onSearch={handleSearch} loading={false} />
          </div>
        </div>
      </section>
    </div>
  );
}
