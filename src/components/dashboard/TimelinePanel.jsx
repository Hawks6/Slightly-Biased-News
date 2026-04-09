import { Clock } from "lucide-react";
import clsx from "clsx";
import { BIAS_COLORS, BIAS_TAG_CLASS } from "../Constants";

export default function TimelinePanel({ timeline }) {
  if (!timeline || !timeline.events) return null;

  return (
    <article 
      className="bg-white p-6 relative mb-8 animate-fade-in-up"
      style={{ 
        borderTop: "3px solid var(--color-rule-heavy)",
        borderBottom: "1px solid var(--color-rule-line)",
        borderLeft: "1px solid var(--color-rule-line)",
        borderRight: "1px solid var(--color-rule-line)",
        background: "var(--color-bg-surface)"
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 mb-6 gap-4" style={{ borderColor: "var(--color-rule-line)" }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center bg-gray-50 border"
            style={{ borderColor: "var(--color-rule-line)" }}
          >
            <Clock size={16} style={{ color: "var(--color-text-primary)" }} />
          </div>
          <h2 
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Coverage Timeline
          </h2>
        </div>
        
        {timeline.firstReporter && (
          <div className="text-right">
            <span 
              className="block text-[9px] uppercase font-bold tracking-widest"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
            >
              Story Broken By
            </span>
            <span 
              className="text-sm font-bold uppercase tracking-wider" 
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
            >
              {timeline.firstReporter.source}
            </span>
          </div>
        )}
      </div>

      {/* ── Timeline Track ── */}
      <div className="relative pl-3 md:pl-6">
        {/* Newspaper stylized vertical line */}
        <div 
          className="absolute left-[15px] md:left-[27px] top-2 bottom-2 w-[2px]" 
          style={{ background: "var(--color-rule-heavy)" }} 
        />

        <div className="space-y-6">
          {timeline.events.map((event, i) => {
            const rawBias = event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
            const accentColor = BIAS_COLORS[rawBias] || "var(--color-rule-heavy)";
            const isFirst = i === 0;
            
            return (
              <div 
                key={event.id} 
                className="relative flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 animate-fade-in-up" 
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Timeline node */}
                <div
                  className="absolute -left-[20.5px] md:-left-[20.5px] top-1.5 sm:top-1 w-3 h-3 border-2 z-10 bg-white"
                  style={{
                    borderColor: accentColor,
                    ...(isFirst && { background: accentColor })
                  }}
                />
                
                {/* Metadata column */}
                <div className="sm:w-28 flex-shrink-0 pt-0.5 sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                  <span 
                    className="text-xs font-bold" 
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
                  >
                    {event.timeLabel}
                  </span>
                  
                  {/* Outlet Badge */}
                  <span 
                    className="mt-1 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider inline-block border"
                    style={{ 
                      borderColor: accentColor,
                      color: "var(--color-text-primary)",
                      borderLeftWidth: "3px",
                      fontFamily: "var(--font-ui)"
                    }}
                  >
                    {event.source}
                  </span>
                </div>

                {/* Content body */}
                <div className="flex-1 pt-0.5 pb-2 border-b sm:border-b-0 sm:pl-2" style={{ borderColor: 'var(--color-rule-line)' }}>
                  <p 
                    className="text-base leading-snug font-medium" 
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
                  >
                    {event.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {timeline.coverageSpanHours > 0 && (
        <div 
          className="mt-6 pt-4 border-t text-center" 
          style={{ borderColor: "var(--color-rule-line)" }}
        >
          <span 
            className="text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-2"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
          >
            <span className="w-8 h-px bg-current opacity-30" />
            Span: {timeline.coverageSpanHours} hours from inception
            <span className="w-8 h-px bg-current opacity-30" />
          </span>
        </div>
      )}
    </article>
  );
}
