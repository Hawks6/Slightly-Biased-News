import { FileWarning } from "lucide-react";
import clsx from "clsx";
import { BIAS_TAG_CLASS } from "../Constants";

export default function DiffsPanel({ diffs }) {
  if (!diffs) return null;

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileWarning size={18} style={{ color: "var(--color-accent-rose)" }} />
          <h2 className="text-lg font-semibold">Framing & Language Analysis</h2>
        </div>
        <span
          className={clsx(
            "px-3 py-1 text-xs rounded-full font-mono",
            diffs.overallFramingDivergence === "high"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : diffs.overallFramingDivergence === "moderate"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          )}
        >
          {diffs.overallFramingDivergence} divergence
        </span>
      </div>

      {/* Contradictions */}
      {diffs.contradictions && diffs.contradictions.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-tertiary)" }}>
            Framing Contrasts
          </h3>
          <div className="space-y-3">
            {diffs.contradictions.map((c, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {c.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400">
                    &quot;{c.left?.keyword || "Left"}&quot;
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>vs</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-red-500/10 text-red-400">
                    &quot;{c.right?.keyword || "Right"}&quot;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loaded Language */}
      {diffs.loadedLanguage && diffs.loadedLanguage.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-tertiary)" }}>
            Loaded Language Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {diffs.loadedLanguage.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={clsx("px-2 py-0.5 text-[10px] rounded-full", BIAS_TAG_CLASS[item.bias] || "bias-center")}>
                  {item.source}
                </span>
                {item.words?.slice(0, 3).map((w) => (
                  <span key={w} className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-500/8 text-rose-300 border border-rose-500/15">
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
