import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const suggestions = [
    "Interest rate cuts",
    "AI regulation",
    "Climate policy",
    "Immigration reform",
    "Tech layoffs",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="mb-10">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card gradient-border flex items-center overflow-hidden">
          <Search
            size={20}
            className="ml-5 flex-shrink-0"
            style={{ color: "var(--color-text-tertiary)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a news topic to analyze across sources…"
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-gray-500"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-family-sans)" }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={clsx(
              "px-6 py-2 mr-3 rounded-lg text-sm font-semibold transition-all duration-200",
              isLoading || !query.trim()
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
            )}
          >
            {isLoading ? (
              <Loader2 size={16} className="agent-spinner" />
            ) : (
              <>Analyze</>
            )}
          </button>
        </div>
      </form>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Try:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              onSearch(s);
            }}
            disabled={isLoading}
            className="px-3 py-1 text-xs rounded-full border transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-300"
            style={{
              background: "var(--color-bg-tertiary)",
              borderColor: "var(--color-border-primary)",
              color: "var(--color-text-secondary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
