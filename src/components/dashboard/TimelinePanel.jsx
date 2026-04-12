import { Clock } from "lucide-react";
import { BIAS_COLORS } from "../Constants";

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
      <div className="relative">
        {/* Newspaper stylized vertical line - centered between metadata and content */}
        <div 
          className="absolute left-[90px] md:left-[110px] top-2 bottom-2 w-[2px]" 
          style={{ background: "var(--color-rule-heavy)" }} 
        />

        <div className="space-y-8">
          {timeline.events.map((event, i) => {
            const rawBias = event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
            const accentColor = BIAS_COLORS[rawBias] || "var(--color-rule-heavy)";
            const isFirst = i === 0;
            
            return (
              <div 
                key={event.id} 
                className="relative grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-6 md:gap-10 items-start animate-fade-in-up" 
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Timeline node - positioned absolutely relative to the grid item, centered on the line */}
                <div
                  className="absolute left-[85.5px] md:left-[105.5px] top-1.5 w-2.5 h-2.5 border-2 z-10 bg-white"
                  style={{
                    borderColor: accentColor,
                    ...(isFirst && { background: accentColor })
                  }}
                />
                
                {/* Metadata column - Right aligned before the line */}
                <div className="flex flex-col items-end text-right pt-0.5">
                  <span 
                    className="text-[11px] font-bold whitespace-nowrap" 
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
                  >
                    {event.timeLabel}
                  </span>
                  
                  {/* Outlet Badge */}
                  <span 
                    className="mt-1.5 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider inline-block border leading-tight"
                    style={{ 
                      borderColor: accentColor,
                      color: "var(--color-text-primary)",
                      borderRightWidth: "3px",
                      borderLeftWidth: "1px",
                      fontFamily: "var(--font-ui)",
                      maxWidth: "100%",
                      wordBreak: "break-word"
                    }}
                  >
                    {event.source}
                  </span>
                </div>

                {/* Content body - Left of the line */}
                <div className="flex-1 pt-0.5">
                  <p 
                    className="text-base md:text-lg leading-tight font-bold" 
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
