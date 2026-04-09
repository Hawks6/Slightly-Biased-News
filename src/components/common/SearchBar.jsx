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
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Search
            size={20}
            className="ml-4 flex-shrink-0 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a news topic to analyze across sources…"
            className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />

        </div>
      </form>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
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
            className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
