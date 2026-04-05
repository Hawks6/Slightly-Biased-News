import { useState } from "react";
import { Newspaper, ExternalLink, Building2, Clock, Binary } from "lucide-react";
import clsx from "clsx";
import { BIAS_TAG_CLASS } from "../Constants";

export default function SourceCards({ sourceCards }) {
  const [expanded, setExpanded] = useState(null);

  if (!sourceCards) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Newspaper size={18} style={{ color: "var(--color-accent-sky)" }} />
        <h2 className="text-lg font-semibold">Source Intelligence</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {sourceCards.map((card) => (
          <div
            key={card.id}
            className="glass-card glass-card-hover p-5 cursor-pointer transition-all duration-200"
            onClick={() => setExpanded(expanded === card.id ? null : card.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={clsx("px-2 py-0.5 text-[10px] rounded-full font-semibold inline-flex items-center gap-1", BIAS_TAG_CLASS[card.bias] || "bias-center")}>
                  {card.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                  {card.framing && card.framing.label !== "Neutral" && (
                    <span className={clsx("ml-0.5", card.framing.confidence < 0.5 && "opacity-50")}>
                      &middot; {card.framing.label}
                    </span>
                  )}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {card.source}
                </span>
                {card.valence?.intensity > 7 && (
                  <span className="px-2 py-0.5 text-[10px] rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold uppercase tracking-tighter animate-pulse">
                    High Intensity
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <ExternalLink size={14} />
                </a>
                {card.valence && (
                  <div className="flex flex-col items-end">
                    <div className="w-12 h-1 rounded-full bg-black/5 overflow-hidden flex">
                      <div 
                        className={clsx(
                          "h-full",
                          card.valence.valence < -0.2 ? "bg-rose-500" : card.valence.valence > 0.2 ? "bg-emerald-500" : "bg-gray-400"
                        )}
                        style={{ 
                          width: `${Math.abs(card.valence.valence) * 100}%`,
                          marginLeft: card.valence.valence < 0 ? "auto" : "0",
                          marginRight: card.valence.valence > 0 ? "auto" : "0"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm font-medium mb-2 leading-snug" style={{ color: "var(--color-text-primary)" }}>
              {card.title}
            </h3>
            <p className="text-xs line-clamp-2" style={{ color: "var(--color-text-tertiary)" }}>
              {card.description}
            </p>

            {expanded === card.id && (
              <div className="mt-4 pt-3 border-t space-y-2 animate-fade-in-up" style={{ borderColor: "var(--color-border-primary)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Reliability</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-bg-tertiary)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${card.reliability}%`,
                          background: card.reliability >= 75 ? "var(--color-credibility-high)" : card.reliability >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>{card.reliability}%</span>
                  </div>
                </div>
                {card.valence && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Emotional Tone</span>
                    <span className={clsx(
                      "px-2 py-0.5 text-[10px] rounded font-medium",
                      card.valence.intensity > 7 ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" : "bg-gray-100 text-gray-600 border border-gray-200"
                    )}>
                      {card.valence.toneLabel} ({card.valence.intensity}/10)
                    </span>
                  </div>
                )}
                {card.valence?.chargedLanguage && card.valence.chargedLanguage.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.valence.chargedLanguage.slice(0, 5).map((word, i) => (
                      <span key={i} className="px-1.5 py-0.5 text-[9px] bg-black/5 text-gray-500 rounded font-mono lowercase border border-black/5">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
                {card.framing && card.framing.reasoning && (
                  <div className="flex items-start gap-2 bg-[rgba(0,0,0,0.02)] p-2 rounded border-l-2 border-gray-300">
                    <Binary size={12} className="mt-1 flex-shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
                    <p className="text-[11px] leading-tight italic" style={{ color: "var(--color-text-secondary)" }}>
                      <span className="font-semibold not-italic">Framing:</span> {card.framing.reasoning}
                    </p>
                  </div>
                )}
                {card.ownership && (
                  <div className="flex items-center gap-2">
                    <Building2 size={12} style={{ color: "var(--color-text-tertiary)" }} />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {card.ownership.owner} ({card.ownership.type})
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  <Clock size={12} />
                  <span>{card.readTime} min read · {card.contentLength}</span>
                  <span className="ml-auto text-[10px] font-mono">
                    Bias score: {card.biasScore > 0 ? "+" : ""}{card.biasScore}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
