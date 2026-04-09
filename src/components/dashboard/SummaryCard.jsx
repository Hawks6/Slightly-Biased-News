import { ShieldCheck, ChevronRight, Eye, FileText } from "lucide-react";

export default function SummaryCard({ summary, realityScore }) {
  if (!summary || !realityScore) return null;

  return (
    <article 
      className="bg-white mb-8 relative animate-fade-in-up flex flex-col"
      style={{ 
        borderTop: "4px solid var(--color-rule-heavy)",
        borderBottom: "1px solid var(--color-rule-heavy)",
        background: "var(--color-bg-surface)"
      }}
    >
      {/* ── Broadsheet Header ── */}
      <div className="flex flex-col sm:flex-row items-center border-b pt-4 pb-5 px-6 gap-6" style={{ borderColor: "var(--color-rule-line)" }}>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span 
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-accent-kicker)", fontFamily: "var(--font-ui)" }}
            >
              Editorial Summary
            </span>
            {summary.method === "ai" && (
              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-gray-300 text-gray-500">
                AI Synthesis
              </span>
            )}
          </div>
          <h2 
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-none" 
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
          >
            The Consensus
          </h2>
        </div>

        {/* ── Reality Score Emblem ── */}
        <div className="flex-shrink-0 flex items-center justify-center border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6" style={{ borderColor: "var(--color-rule-line)" }}>
          <div className="flex flex-col items-center">
            <div 
              className="text-[10px] uppercase font-bold tracking-widest mb-1"
              style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-muted)" }}
            >
              Reality Score
            </div>
            <div className="flex items-center gap-3">
              <span 
                className="text-5xl font-bold" 
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
              >
                {realityScore.overall}
              </span>
              <div className="flex flex-col justify-center h-full">
                <span className="text-xl leading-none font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>/100</span>
                <span 
                  className="text-[10px] uppercase font-bold mt-1 tracking-widest"
                  style={{ 
                    color: realityScore.overall >= 70 ? "var(--color-credibility-high)" : realityScore.overall >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)",
                    fontFamily: "var(--font-ui)"
                  }}
                >
                  {realityScore.label || "Verified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* ── Main Left Column (Summary + Drop Cap) ── */}
        <div className="md:w-2/3">
          {/* Summary Text acting as lead paragraph with Drop Cap */}
          <div 
            className="text-base sm:text-lg leading-relaxed text-justify mb-8"
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
          >
            {/* The first letter drop cap simulation (assuming summary is a simple string) */}
            <span 
              className="float-left text-7xl leading-[0.8] mr-3 mt-1 font-bold" 
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              {summary.summary ? summary.summary.charAt(0) : ""}
            </span>
            {summary.summary ? summary.summary.substring(1) : ""}
          </div>

          {/* Narrative Analysis Section */}
          {summary.narrative && (
            <div className="border-t-2 border-black pt-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} style={{ color: "var(--color-text-primary)" }} />
                <h3 
                  className="text-lg font-bold"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
                >
                  Narrative Analysis
                </h3>
              </div>
              <p 
                className="text-base leading-relaxed text-justify columns-1 sm:columns-2 gap-6" 
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
              >
                {summary.narrative}
              </p>
            </div>
          )}
        </div>

        {/* ── Right Column (Sidebar / Takeaways) ── */}
        <div className="md:w-1/3 flex flex-col gap-6 md:border-l md:pl-8 border-t md:border-t-0 pt-6 md:pt-0" style={{ borderColor: "var(--color-rule-line)" }}>
          
          {summary.takeaways && summary.takeaways.length > 0 && (
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <h3 
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
                >
                  Key Takeaways
                </h3>
              </div>
              <ul className="space-y-4">
                {summary.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span 
                      className="mt-0.5 text-black font-bold" 
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {i + 1}.
                    </span>
                    <span 
                      className="text-sm leading-snug"
                      style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                    >
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.watchStatement && (
            <div className="mt-auto border p-4 bg-gray-50" style={{ borderColor: "var(--color-rule-line)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Eye size={16} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-ui)" }}>
                  What To Watch
                </span>
              </div>
              <p className="text-sm italic leading-snug" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
                {summary.watchStatement}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
