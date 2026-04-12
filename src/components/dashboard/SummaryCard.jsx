import { ChevronUp } from "lucide-react";
import clsx from "clsx";

export default function SummaryCard({ summary, realityScore, coverageHealth, query, onExploreClick }) {
  if (!summary || !realityScore || !coverageHealth) return null;

  return (
    <article 
      className="bg-white mb-6 relative animate-fade-in-up"
      style={{ 
        borderTop: "3px solid var(--color-rule-heavy)",
        borderBottom: "1px solid var(--color-rule-line)",
        borderLeft: "1px solid var(--color-rule-line)",
        borderRight: "1px solid var(--color-rule-line)",
        background: "var(--color-bg-surface)"
      }}
    >
      <div className="flex flex-col md:flex-row p-6 md:p-8 gap-8">
        
        {/* ── Main Left Column (Summary + CTA) ── */}
        <div className="md:w-2/3 pr-0 md:pr-4">
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--color-accent-kicker)", fontFamily: "var(--font-ui)" }}
            >
              Editorial Summary
            </span>
          </div>
          
          <h2 
            className="text-4xl sm:text-[42px] font-bold tracking-tight leading-[1.1] mb-4" 
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
          >
            {query || "The Consensus"}
          </h2>

          <div 
            className="text-lg leading-relaxed mb-6"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}
          >
            {summary.summary}
          </div>

          {onExploreClick && (
            <button 
              onClick={onExploreClick}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-sm transition-colors hover:bg-opacity-90"
              style={{ background: "var(--color-bg-nav)", fontFamily: "var(--font-ui)" }}
            >
              Explore Deep Dive
            </button>
          )}
        </div>

        {/* ── Right Column (Metrics Rail) ── */}
        <div className="md:w-1/3 flex flex-col pt-2 border-t md:border-t-0 md:border-l md:pl-8 justify-start" style={{ borderColor: "var(--color-rule-line)" }}>
          
          {/* Collapse icon on top right like the mockup */}
          <div className="hidden md:flex justify-end mb-2">
             <ChevronUp size={16} style={{ color: "var(--color-text-muted)" }} className="cursor-pointer" />
          </div>

          <div className="mb-6 border-b pb-6" style={{ borderColor: "var(--color-rule-line)" }}>
            <div 
              className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Reality Score
            </div>
            <div className="flex items-end gap-1 mb-6">
              <span 
                className="text-6xl font-bold leading-none tracking-tighter" 
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
              >
                {realityScore.overall}
              </span>
              <div className="flex flex-col pb-1">
                <span className="text-xl font-bold leading-none text-gray-400">/100</span>
                <span 
                  className="text-[9px] uppercase font-bold mt-1 tracking-widest whitespace-nowrap"
                  style={{ 
                    color: realityScore.overall >= 70 ? "var(--color-credibility-high)" : realityScore.overall >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)",
                    fontFamily: "var(--font-ui)"
                  }}
                >
                  {realityScore.label || (realityScore.overall >= 70 ? "Verified" : realityScore.overall >= 50 ? "Mixed Signals" : "Contested")}
                </span>
              </div>
            </div>

            {/* Narrative Analysis (Logic & Takeaways) */}
            {summary.logic && summary.logic.length > 0 && (
              <div className="mt-4">
                <div 
                  className="text-[10px] uppercase font-bold tracking-widest mb-3 text-gray-500"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Narrative Analysis
                </div>
                <ul className="space-y-2">
                  {summary.logic.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8b0000] mt-1 text-[10px]">■</span>
                      <span className="text-sm leading-snug" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-ui)" }}>
                 Primary Framing
               </div>
               <div className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                 {coverageHealth.primaryFraming || "Neutral"}
               </div>
            </div>

            <div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-ui)" }}>
                 Source Reliability
               </div>
               <div className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                 {coverageHealth.averageReliability}%
               </div>
            </div>

            <div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-ui)" }}>
                 Source Diversity
               </div>
               <div className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
                 {coverageHealth.diversityRating === "Excellent" ? "High" : coverageHealth.diversityRating === "Poor" ? "Low" : "Moderate"}
               </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}
