import { Clock } from "lucide-react";
import clsx from "clsx";
import { BIAS_COLORS, BIAS_TAG_CLASS } from "../Constants";

export default function TimelinePanel({ timeline }) {
  if (!timeline || !timeline.events) return null;

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: "var(--color-accent-amber)" }} />
          <h2 className="text-lg font-semibold">Coverage Timeline</h2>
        </div>
        {timeline.firstReporter && (
          <span className="px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            First: {timeline.firstReporter.source}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--color-border-secondary)" }} />

        <div className="space-y-4 ml-8">
          {timeline.events.map((event, i) => (
            <div key={event.id} className="relative flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Dot */}
              <div
                className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: BIAS_COLORS[event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())] || "var(--color-accent-indigo)",
                  background: i === 0 ? BIAS_COLORS[event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())] || "var(--color-accent-indigo)" : "var(--color-bg-primary)",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx("px-2 py-0.5 text-[10px] rounded-full font-medium", BIAS_TAG_CLASS[event.bias] || "bias-center")}>
                    {event.source}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                    {event.timeLabel}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {timeline.coverageSpanHours > 0 && (
        <div className="mt-4 pt-3 border-t text-xs" style={{ borderColor: "var(--color-border-primary)", color: "var(--color-text-tertiary)" }}>
          Coverage span: <strong>{timeline.coverageSpanHours}h</strong> from first to latest report
        </div>
      )}
    </div>
  );
}
