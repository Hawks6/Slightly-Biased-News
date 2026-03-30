import { useState } from "react";
import clsx from "clsx";
import Footer from "./common/Footer";

function TopicSelectorSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Or search for a specific topic..."
        className="flex-1 bg-white border px-4 py-3 outline-none"
        style={{ borderColor: "var(--color-rule-line)", color: "var(--color-text-primary)" }}
        onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent-brand)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "var(--color-rule-line)"}
      />
      <button type="submit" className="px-8 py-3 text-white font-bold transition-opacity hover:opacity-90 cursor-pointer" style={{ backgroundColor: "var(--color-accent-brand)" }}>
        Analyze &rarr;
      </button>
    </form>
  );
}

export default function TopicSelector({ onSelect }) {
  const topics = [
    { id: "world", label: "World", icon: "🌍", num: "01", kicker: "GLOBAL AFFAIRS", span: "md:col-span-2 md:row-span-2", desc: "International news, conflicts, and diplomacy" },
    { id: "politics", label: "Politics", icon: "🏛️", num: "02", kicker: "POWER & POLICY", span: "md:col-span-2", desc: "Elections, legislation, and government" },
    { id: "business", label: "Business", icon: "📈", num: "03", kicker: "MARKETS", span: "", desc: "Economy and finance" },
    { id: "tech", label: "Tech", icon: "💻", num: "04", kicker: "INNOVATION", span: "", desc: "Silicon valley and AI" },
    { id: "climate", label: "Climate", icon: "🌡️", num: "05", kicker: "ENVIRONMENT", span: "", desc: "Global warming and ecology" },
    { id: "science", label: "Science", icon: "🔬", num: "06", kicker: "DISCOVERY", span: "md:row-span-2", desc: "Research and breakthroughs" },
    { id: "culture", label: "Culture", icon: "🎭", num: "07", kicker: "SOCIETY", span: "md:col-span-2", desc: "Arts, entertainment, and pop culture" },
    { id: "opinion", label: "Opinion", icon: "💭", num: "08", kicker: "EDITORIAL", span: "", desc: "Perspectives and commentary" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col min-h-screen animate-fade-in-up">
      {/* Masthead */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 border-b pb-6" style={{ borderColor: "var(--color-rule-heavy)" }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-0" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-brand)" }}>
          <i className="font-serif italic font-bold">Slightly</i> Biased News
        </h1>
        <div className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]" suppressHydrationWarning>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Statement */}
      <div className="mb-16 max-w-2xl">
        <h2 className="text-5xl md:text-7xl mb-4 leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
          The world's stories,<br/>without the agenda.
        </h2>
        <p className="text-xl md:text-2xl italic mb-8" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
          Independent &middot; Transparent &middot; Unbiased
        </p>
        <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--color-accent-kicker)" }}>
          Choose Your Edition
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 md:auto-rows-[160px]">
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={clsx(
              "relative text-left p-6 transition-colors overflow-hidden border flex flex-col group min-h-[160px]",
              t.span || "col-span-1 row-span-1"
            )}
            style={{ 
              backgroundColor: "var(--color-bg-surface)",
              borderColor: "var(--color-rule-line)"
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--color-accent-brand)"; e.currentTarget.style.backgroundColor = "#FDFBFA"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--color-rule-line)"; e.currentTarget.style.backgroundColor = "var(--color-bg-surface)"; }}
          >
            <div className="absolute -right-4 -bottom-8 text-[120px] font-bold opacity-5 pointer-events-none group-hover:scale-110 transition-transform origin-bottom-right" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-brand)" }}>
              {t.num}
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-accent-kicker)" }}>{t.kicker}</span>
            </div>
            <h3 className="text-2xl mb-2 mt-auto relative z-10" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>{t.label}</h3>
            <p className="text-sm italic relative z-10" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8 border-t" style={{ borderColor: "var(--color-rule-line)" }}>
        <TopicSelectorSearch onSearch={onSelect} />
      </div>

      <Footer />
    </div>
  );
}
