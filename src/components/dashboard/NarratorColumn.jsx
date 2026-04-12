import { Eye, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function NarratorColumn({ data, onExploreClick }) {
  if (!data || !data.summary) return null;

  const { summary, realityScore, meta } = data;
  const query = meta?.query || "The Consensus";

  return (
    <div className="sticky top-[120px] flex flex-col h-[calc(100vh-140px)] overflow-y-auto pr-2 pb-8 custom-scrollbar animate-fade-in-up">
      {/* ── Broadsheet Header ── */}
      <div className="mb-6 border-b pb-6" style={{ borderColor: "var(--color-rule-heavy)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span 
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-accent-kicker)", fontFamily: "var(--font-ui)" }}
          >
            Editorial Summary
          </span>
          {summary.method === "ai" && (
            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-gray-300 text-gray-500 rounded-sm bg-gray-50">
              AI Synthesis
            </span>
          )}
        </div>
        
        <h2 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6" 
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          {query}
        </h2>

        {/* ── Intelligence Badges (Reality Score & Health) ── */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed" style={{ borderColor: "var(--color-rule-line)" }}>
          {realityScore && (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed shadow-sm"
                style={{ 
                  borderColor: realityScore.overall >= 70 ? "var(--color-credibility-high)" : realityScore.overall >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)",
                  background: "var(--color-bg-surface)"
                }}
              >
                <Sparkles size={16} style={{ color: realityScore.overall >= 70 ? "var(--color-credibility-high)" : realityScore.overall >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)" }} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-ui)" }}>
                   Reality Score
                 </span>
                 <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                      {realityScore.overall}
                    </span>
                    <span className="text-xs font-bold text-gray-400">/100</span>
                 </div>
              </div>
            </div>
          )}

          {data.coverageHealth && (
            <div className="flex items-center gap-3 ml-auto pd-2">
                <div className="flex flex-col text-right">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-ui)" }}>
                     Coverage
                   </span>
                   <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}>
                     {data.coverageHealth.tag}
                   </span>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Left Column (Summary + Drop Cap) ── */}
      <div className="flex-1">
        {/* Summary Text acting as lead paragraph with Drop Cap */}
        <div 
          className="text-base sm:text-lg leading-relaxed mb-8"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}
        >
          <span 
            className="float-left text-[80px] leading-[0.7] mr-4 mt-2 font-bold" 
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {summary.summary ? summary.summary.charAt(0) : ""}
          </span>
          {summary.summary ? summary.summary.substring(1) : ""}
        </div>

        {/* Narrative Analysis Section */}
        {summary.narrative && (
          <div className="border-t-2 pt-6 mb-8" style={{ borderColor: "var(--color-rule-heavy)" }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} style={{ color: "var(--color-accent-brand)" }} />
              <h3 
                className="text-lg font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
              >
                Narrative Analysis
              </h3>
            </div>
            <p 
              className="text-sm leading-relaxed" 
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
            >
              {summary.narrative}
            </p>
          </div>
        )}

        {/* ── Right Column (Sidebar / Takeaways) ── */}
        <div className="flex flex-col gap-6 pt-6 border-t border-dashed" style={{ borderColor: "var(--color-rule-line)" }}>
          
          {summary.takeaways && summary.takeaways.length > 0 && (
            <div>
              <h3 
                className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)", borderColor: "var(--color-rule-line)" }}
              >
                Key Takeaways
              </h3>
              <ul className="space-y-4">
                {summary.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-accent-emerald)" }} />
                    <span 
                      className="text-sm leading-snug"
                      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}
                    >
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.watchStatement && (
            <div className="mt-4 border p-5 rounded-sm bg-[rgba(0,0,0,0.02)]" style={{ borderColor: "var(--color-rule-line)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} style={{ color: "var(--color-accent-brand)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-ui)" }}>
                  What To Watch
                </span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
                {summary.watchStatement}
              </p>
            </div>
          )}
        </div>
        
        {/* Mobile-only "Explore Deep Dive" Button */}
        {onExploreClick && (
           <button 
             onClick={onExploreClick}
             className="w-full mt-8 lg:hidden py-4 bg-black text-white font-bold uppercase tracking-widest rounded-sm text-sm"
             style={{ fontFamily: "var(--font-ui)" }}
           >
             Explore Deep Dive Analysis &rarr;
           </button>
        )}
      </div>
    </div>
  );
}
