import { useState } from "react";
import { Newspaper, ExternalLink, Building2, Clock } from "lucide-react";
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
              <div className="flex items-center gap-2">
                <span className={clsx("px-2 py-0.5 text-[10px] rounded-full font-semibold", BIAS_TAG_CLASS[card.bias] || "bias-center")}>
                  {card.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {card.source}
                </span>
              </div>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
              </a>
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
