import { Sparkles, ChevronRight, Eye, FileText } from "lucide-react";

export default function SummaryCard({ summary, realityScore }) {
  if (!summary || !realityScore) return null;

  return (
    <div className="glass-card gradient-border p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: "var(--color-accent-violet)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Editorial Summary
          </h2>
          {summary.method === "ai" && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-mono">
              AI Powered
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: realityScore.overall >= 70
                ? "rgba(52, 211, 153, 0.15)"
                : realityScore.overall >= 50
                ? "rgba(251, 191, 36, 0.15)"
                : "rgba(251, 113, 133, 0.15)",
              color: realityScore.overall >= 70
                ? "var(--color-credibility-high)"
                : realityScore.overall >= 50
                ? "var(--color-credibility-medium)"
                : "var(--color-credibility-low)",
            }}
          >
            {realityScore.overall}
          </div>
          <div className="text-right">
            <div className="text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
              Reality Score
            </div>
            <div
              className="text-xs font-medium"
              style={{
                color: realityScore.overall >= 70
                  ? "var(--color-credibility-high)"
                  : realityScore.overall >= 50
                  ? "var(--color-credibility-medium)"
                  : "var(--color-credibility-low)",
              }}
            >
              {realityScore.label}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-family-serif)" }}
        >
          {summary.summary}
        </p>
      </div>

      {summary.narrative && (
        <div className="mb-6 p-4 border-l-4" style={{ background: "rgba(5, 41, 98, 0.05)", borderColor: "var(--color-accent-brand)" }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} style={{ color: "var(--color-accent-brand)" }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-accent-kicker)" }}>
              Narrative Analysis
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
            {summary.narrative}
          </p>
        </div>
      )}

      {summary.takeaways && summary.takeaways.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-text-tertiary)" }}>
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {summary.takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"
                style={{ color: "var(--color-text-secondary)" }}>
                <ChevronRight size={14} className="mt-0.5 flex-shrink-0"
                  style={{ color: "var(--color-accent-indigo)" }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.watchStatement && (
        <div className="quote-highlight text-sm mt-3">
          <Eye size={14} className="inline mr-2" style={{ color: "var(--color-accent-indigo)" }} />
          {summary.watchStatement}
        </div>
      )}
    </div>
  );
}
