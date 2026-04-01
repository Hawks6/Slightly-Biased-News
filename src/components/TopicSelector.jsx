"use client";
import { useState } from "react";
import clsx from "clsx";
import Footer from "./common/Footer";

// ─── Per-topic personality tints ─────────────────────────────────────────
const TINTS = {
  world: "rgba(5,41,98,0.04)",
  politics: "rgba(161,29,33,0.05)",
  business: "rgba(46,125,50,0.04)",
  tech: "rgba(63,81,181,0.04)",
  climate: "rgba(2,119,189,0.05)",
  science: "rgba(123,31,162,0.04)",
  culture: "rgba(230,81,0,0.04)",
  opinion: "rgba(136,19,55,0.05)",
};
const TINTS_HOVER = {
  world: "rgba(5,41,98,0.08)",
  politics: "rgba(161,29,33,0.09)",
  business: "rgba(46,125,50,0.08)",
  tech: "rgba(63,81,181,0.08)",
  climate: "rgba(2,119,189,0.09)",
  science: "rgba(123,31,162,0.08)",
  culture: "rgba(230,81,0,0.08)",
  opinion: "rgba(136,19,55,0.09)",
};

// ─── Topic Doodles — every element has pathLength="1" + className="doodle-path"
// so the CSS draw-on animation works with stroke-dashoffset
function TopicDoodle({ id }) {
  const ink = "var(--color-accent-brand)";
  const dp = "doodle-path"; // shorthand

  const doodles = {
    world: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <circle className={dp} pathLength="1" cx="60" cy="60" r="40" strokeWidth="2" />
        <ellipse className={dp} pathLength="1" cx="60" cy="60" rx="20" ry="40" strokeWidth="1.2" />
        <line className={dp} pathLength="1" x1="20" y1="60" x2="100" y2="60" strokeWidth="1.2" />
        <path className={dp} pathLength="1" d="M28 40 Q60 48 92 40" strokeWidth="1" />
        <path className={dp} pathLength="1" d="M28 80 Q60 72 92 80" strokeWidth="1" />
        <line className={dp} pathLength="1" x1="60" y1="18" x2="60" y2="10" strokeWidth="2" />
        <circle className={dp} pathLength="1" cx="60" cy="8" r="3" fill={ink} stroke="none" />
        <line className={dp} pathLength="1" x1="60" y1="102" x2="60" y2="110" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="18" y1="60" x2="10" y2="60" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="102" y1="60" x2="110" y2="60" strokeWidth="2" />
        <path className={dp} pathLength="1" d="M46 36 Q52 30 58 36 Q64 42 60 50 Q55 55 48 50 Q42 44 46 36Z" strokeWidth="1" strokeDasharray="2,2" />
        <path className={dp} pathLength="1" d="M68 62 Q74 57 80 62 Q84 68 78 74 Q72 78 66 73 Q62 67 68 62Z" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    ),
    politics: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <line className={dp} pathLength="1" x1="14" y1="96" x2="106" y2="96" strokeWidth="2.5" />
        <line className={dp} pathLength="1" x1="20" y1="90" x2="100" y2="90" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="26" y1="84" x2="94" y2="84" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="28" y="54" width="8" height="30" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="44" y="54" width="8" height="30" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="60" y="54" width="8" height="30" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="76" y="54" width="8" height="30" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="24" y="48" width="72" height="8" strokeWidth="2" />
        <path className={dp} pathLength="1" d="M24 48 L60 20 L96 48" strokeWidth="2" />
        <path className={dp} pathLength="1" d="M60 28 L62 34 L68 34 L63 38 L65 44 L60 40 L55 44 L57 38 L52 34 L58 34Z" strokeWidth="1" fill={ink} stroke="none" />
        <line className={dp} pathLength="1" x1="60" y1="8" x2="60" y2="20" strokeWidth="1.5" />
        <path className={dp} pathLength="1" d="M60 8 L72 12 L60 16Z" strokeWidth="1" fill={ink} stroke="none" />
      </svg>
    ),
    business: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <line className={dp} pathLength="1" x1="16" y1="16" x2="16" y2="96" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="12" y1="96" x2="108" y2="96" strokeWidth="2" />
        <rect className={dp} pathLength="1" x="24" y="60" width="14" height="36" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="44" y="44" width="14" height="52" strokeWidth="1.5" fill={ink} fillOpacity="0.06" />
        <rect className={dp} pathLength="1" x="64" y="30" width="14" height="66" strokeWidth="1.5" />
        <rect className={dp} pathLength="1" x="84" y="20" width="14" height="76" strokeWidth="1.5" fill={ink} fillOpacity="0.06" />
        <polyline className={dp} pathLength="1" points="24,72 46,54 66,60 96,28" strokeWidth="1.8" strokeDasharray="5,3" />
        <circle className={dp} pathLength="1" cx="96" cy="28" r="4" fill={ink} stroke="none" />
        <line className={dp} pathLength="1" x1="12" y1="40" x2="16" y2="40" strokeWidth="1" />
        <line className={dp} pathLength="1" x1="12" y1="60" x2="16" y2="60" strokeWidth="1" />
        <line className={dp} pathLength="1" x1="12" y1="80" x2="16" y2="80" strokeWidth="1" />
      </svg>
    ),
    tech: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <rect className={dp} pathLength="1" x="34" y="34" width="52" height="52" rx="6" strokeWidth="2" />
        <rect className={dp} pathLength="1" x="46" y="46" width="28" height="28" rx="4" strokeWidth="1.5" fill={ink} fillOpacity="0.05" />
        <line className={dp} pathLength="1" x1="46" y1="60" x2="74" y2="60" strokeWidth="1" />
        <line className={dp} pathLength="1" x1="60" y1="46" x2="60" y2="74" strokeWidth="1" />
        <line className={dp} pathLength="1" x1="44" y1="22" x2="44" y2="34" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="56" y1="20" x2="56" y2="34" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="68" y1="20" x2="68" y2="34" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="76" y1="22" x2="76" y2="34" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="44" y1="86" x2="44" y2="98" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="56" y1="86" x2="56" y2="100" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="68" y1="86" x2="68" y2="100" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="76" y1="86" x2="76" y2="98" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="22" y1="44" x2="34" y2="44" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="20" y1="56" x2="34" y2="56" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="20" y1="68" x2="34" y2="68" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="22" y1="76" x2="34" y2="76" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="86" y1="44" x2="98" y2="44" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="86" y1="56" x2="100" y2="56" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="86" y1="68" x2="100" y2="68" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="86" y1="76" x2="98" y2="76" strokeWidth="1.5" />
        <circle className={dp} pathLength="1" cx="44" cy="20" r="3" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="68" cy="18" r="3" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="100" cy="56" r="3" fill={ink} stroke="none" />
      </svg>
    ),
    climate: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <circle className={dp} pathLength="1" cx="60" cy="42" r="18" strokeWidth="2" />
        <circle className={dp} pathLength="1" cx="60" cy="42" r="8" strokeWidth="1" fill={ink} fillOpacity="0.08" />
        <line className={dp} pathLength="1" x1="60" y1="16" x2="60" y2="10" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="80" y1="22" x2="85" y2="17" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="92" y1="42" x2="98" y2="42" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="80" y1="62" x2="86" y2="67" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="40" y1="22" x2="35" y2="17" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="28" y1="42" x2="22" y2="42" strokeWidth="2" />
        <path className={dp} pathLength="1" d="M10 82 Q22 74 34 82 Q46 90 58 82 Q70 74 82 82 Q94 90 110 82" strokeWidth="1.8" />
        <path className={dp} pathLength="1" d="M10 92 Q22 84 34 92 Q46 100 58 92 Q70 84 82 92 Q94 100 110 92" strokeWidth="1.2" />
        <path className={dp} pathLength="1" d="M50 66 Q60 58 72 66 Q80 74 72 82 Q62 90 50 82 Q42 74 50 66Z" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="60" y1="60" x2="60" y2="84" strokeWidth="1" />
      </svg>
    ),
    science: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <ellipse className={dp} pathLength="1" cx="60" cy="60" rx="44" ry="16" strokeWidth="1.8" />
        <ellipse className={dp} pathLength="1" cx="60" cy="60" rx="44" ry="16" transform="rotate(60 60 60)" strokeWidth="1.8" />
        <ellipse className={dp} pathLength="1" cx="60" cy="60" rx="44" ry="16" transform="rotate(120 60 60)" strokeWidth="1.8" />
        <circle className={dp} pathLength="1" cx="60" cy="60" r="9" fill={ink} fillOpacity="0.12" strokeWidth="2" />
        <circle className={dp} pathLength="1" cx="60" cy="60" r="4" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="104" cy="60" r="4" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="38" cy="28" r="4" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="38" cy="92" r="4" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="60" cy="60" r="18" strokeWidth="0.8" strokeDasharray="3,4" />
      </svg>
    ),
    culture: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path className={dp} pathLength="1" d="M24 46 Q22 72 42 80 Q52 84 60 84 Q68 84 78 80 Q98 72 96 46 Q94 22 60 22 Q26 22 24 46Z" strokeWidth="2" />
        <path className={dp} pathLength="1" d="M38 52 Q40 62 50 62 Q60 62 62 52" strokeWidth="1.8" />
        <path className={dp} pathLength="1" d="M62 52 Q64 62 74 62 Q84 62 86 52" strokeWidth="1.8" />
        <path className={dp} pathLength="1" d="M36 44 Q44 40 54 44" strokeWidth="1.2" />
        <path className={dp} pathLength="1" d="M66 44 Q76 40 84 44" strokeWidth="1.2" />
        <circle className={dp} pathLength="1" cx="42" cy="70" r="3" fill={ink} stroke="none" />
        <circle className={dp} pathLength="1" cx="78" cy="70" r="3" fill={ink} stroke="none" />
        <line className={dp} pathLength="1" x1="60" y1="84" x2="60" y2="102" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="42" y1="102" x2="78" y2="102" strokeWidth="2.5" />
        <line className={dp} pathLength="1" x1="92" y1="28" x2="92" y2="44" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="92" y1="44" x2="98" y2="42" strokeWidth="1.5" />
        <ellipse className={dp} pathLength="1" cx="90" cy="46" rx="4" ry="3" strokeWidth="1.2" fill={ink} fillOpacity="0.2" />
      </svg>
    ),
    opinion: (
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path className={dp} pathLength="1" d="M16 18 L94 18 Q102 18 102 26 L102 68 Q102 76 94 76 L68 76 L60 96 L52 76 L18 76 Q10 76 10 68 L10 26 Q10 18 16 18Z" strokeWidth="2" />
        <line className={dp} pathLength="1" x1="24" y1="34" x2="88" y2="34" strokeWidth="1.8" />
        <line className={dp} pathLength="1" x1="24" y1="46" x2="88" y2="46" strokeWidth="1.8" />
        <line className={dp} pathLength="1" x1="24" y1="58" x2="64" y2="58" strokeWidth="1.8" />
        <path className={dp} pathLength="1" d="M74 52 Q74 58 80 56" strokeWidth="1.5" />
        <path className={dp} pathLength="1" d="M82 52 Q82 58 88 56" strokeWidth="1.5" />
        <path className={dp} pathLength="1" d="M98 88 L106 80 L112 86 L104 94Z" strokeWidth="1.5" />
        <line className={dp} pathLength="1" x1="95" y1="91" x2="100" y2="100" strokeWidth="1" strokeDasharray="2,2" />
        <line className={dp} pathLength="1" x1="104" y1="78" x2="108" y2="74" strokeWidth="1.5" />
      </svg>
    ),
  };

  return doodles[id] ?? doodles.world;
}

// ─── Search bar ───────────────────────────────────────────────────────────
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
      <button
        type="submit"
        className="px-8 py-3 text-white font-bold transition-opacity hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: "var(--color-accent-brand)" }}
      >
        Analyze &rarr;
      </button>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function TopicSelector({ onSelect }) {
  const topics = [
    { id: "world", num: "01", kicker: "GLOBAL AFFAIRS", span: "md:col-span-2 md:row-span-2" },
    { id: "politics", num: "02", kicker: "POWER & POLICY", span: "md:col-span-2" },
    { id: "business", num: "03", kicker: "MARKETS", span: "" },
    { id: "tech", num: "04", kicker: "INNOVATION", span: "" },
    { id: "climate", num: "05", kicker: "ENVIRONMENT", span: "" },
    { id: "science", num: "06", kicker: "DISCOVERY", span: "md:row-span-2" },
    { id: "culture", num: "07", kicker: "SOCIETY", span: "md:col-span-2 md:row-span-2" },
    { id: "opinion", num: "08", kicker: "EDITORIAL", span: "" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col min-h-screen animate-fade-in-up">

      {/* Masthead */}
      <div
        className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 border-b pb-6"
        style={{ borderColor: "var(--color-rule-heavy)" }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-0"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-brand)" }}
        >
          <i className="font-serif italic font-bold">Slightly</i> Biased News
        </h1>
        <div className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Statement */}
      <div className="mb-16 max-w-2xl">
        <h2
          className="text-5xl md:text-7xl mb-4 leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          The world&apos;s stories,<br />without the agenda.
        </h2>
        <p
          className="text-xl md:text-2xl italic mb-8"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}
        >
          Independent &middot; Transparent &middot; Unbiased
        </p>
        <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "var(--color-accent-kicker)" }}>
          Choose Your Edition
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 md:auto-rows-[180px]">
        {topics.map((t, i) => {
          const label = t.id.charAt(0).toUpperCase() + t.id.slice(1);
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={clsx(
                "topic-tile tile-enter",
                "relative text-left p-5 overflow-hidden border flex flex-col min-h-[180px] cursor-pointer",
                t.span || "col-span-1 row-span-1"
              )}
              style={{
                backgroundColor: TINTS[t.id],
                borderColor: "var(--color-rule-line)",
                animationDelay: `${i * 0.06}s`,
                transition: "border-color 0.25s ease, background-color 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent-brand)";
                e.currentTarget.style.backgroundColor = TINTS_HOVER[t.id];
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--color-rule-line)";
                e.currentTarget.style.backgroundColor = TINTS[t.id];
              }}
            >
              {/* Top row: kicker + edition badge */}
              <div className="flex items-center justify-between z-10 w-full relative">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-accent-kicker)" }}
                >
                  {t.kicker}
                </span>
                <span
                  className="edition-badge text-[10px] font-mono font-bold px-1.5 py-0.5 border bg-white/50 backdrop-blur-sm"
                  style={{
                    color: "var(--color-accent-brand)",
                    borderColor: "var(--color-rule-line)",
                    fontFamily: "var(--font-ui)"
                  }}
                >
                  #{t.num}
                </span>
              </div>

              {/* Centered Content (Doodle + Label together) */}
              <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 pt-2 relative z-10">
                <div className="doodle-wrapper flex items-center justify-center mb-2 h-[60px] md:h-[80px] w-full [&>svg]:h-full [&>svg]:w-auto">
                  <TopicDoodle id={t.id} />
                </div>
                
                {/* Label */}
                <h3
                  className="text-xl md:text-2xl font-bold w-full text-center"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
                >
                  {label}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t" style={{ borderColor: "var(--color-rule-line)" }}>
        <TopicSelectorSearch onSearch={onSelect} />
      </div>

      <Footer />
    </div>
  );
}
