import { ChevronRight, Users, Zap } from "lucide-react";

// Derive a stable hue accent per card based on source count (gives each card
// a subtle tinted glow without being random / jarring)
const CARD_ACCENTS = [
  { glow: "rgba(5,41,98,0.07)",   dot: "#052962" },  // deep navy
  { glow: "rgba(161,29,33,0.07)", dot: "#A11D21" },  // editorial red
  { glow: "rgba(46,125,50,0.07)", dot: "#2E7D32" },  // credibility green
  { glow: "rgba(91,60,184,0.07)", dot: "#5B3CB8" },  // indigo-purple
  { glow: "rgba(230,81,0,0.07)",  dot: "#E65100" },  // amber
];

export default function EventCard({ event, onClick, index = 0 }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const publishedDate = new Date(event.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Recency label
  const minsAgo = Math.floor((Date.now() - new Date(event.publishedAt)) / 60000);
  const recencyLabel =
    minsAgo < 60
      ? `${minsAgo}m ago`
      : minsAgo < 1440
      ? `${Math.floor(minsAgo / 60)}h ago`
      : publishedDate;

  const isRecent = minsAgo < 120;

  return (
    <article
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(event); } }}
      className="group cursor-pointer flex flex-col h-full overflow-hidden transition-all duration-300
                 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-rule-line)",
        borderRadius: "2px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Vivid top accent bar (always visible, brand colour per-card) ── */}
      <div
        className="h-[3px] w-full flex-shrink-0"
        style={{ background: accent.dot }}
      />

      <div className="p-5 flex flex-col flex-1 relative">

        {/* ── Subtle tinted wash behind card body on hover ── */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: accent.glow }}
        />

        {/* ── Kicker row ── */}
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-1.5">
            {isRecent && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm"
                style={{
                  background: "rgba(161,29,33,0.10)",
                  color: "var(--color-accent-kicker)",
                  fontFamily: "var(--font-ui)",
                }}
              >
                <Zap size={8} />
                Live
              </span>
            )}
            <span
              className="text-[9px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent-kicker)", fontFamily: "var(--font-ui)" }}
            >
              {isRecent ? "" : "Breaking Event"}
            </span>
          </div>

          {/* Recency timestamp */}
          <span
            className="text-[10px] tabular-nums font-medium"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
          >
            {recencyLabel}
          </span>
        </div>

        {/* ── Headline ── */}
        <h3
          className="text-xl font-bold leading-snug mb-3 relative transition-colors duration-200"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {/* Animated left-border accent appears on hover */}
          <span
            className="absolute -left-5 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r"
            style={{ background: accent.dot }}
          />
          {event.title}
        </h3>

        {/* ── Standfirst ── */}
        {event.articles?.[0]?.description && (
          <p
            className="text-sm italic line-clamp-3 flex-grow leading-relaxed relative"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}
          >
            {event.articles[0].description}
          </p>
        )}

        {/* ── Footer ── */}
        <div
          className="mt-4 pt-3 border-t flex items-center justify-between relative"
          style={{ borderColor: "var(--color-rule-line)" }}
        >
          <div className="flex items-center gap-2">
            {/* Stacked source monogram avatars */}
            <div className="flex -space-x-1.5">
              {event.articles?.slice(0, 4).map((a, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold
                             transition-transform duration-200 hover:scale-110 hover:z-10 relative"
                  style={{
                    borderColor: "var(--color-bg-surface)",
                    background: accent.glow.replace("0.07", "0.18"),
                    color: accent.dot,
                    fontFamily: "var(--font-ui)",
                    zIndex: 4 - i,
                  }}
                  title={a.source?.name}
                >
                  {a.source?.name?.charAt(0) ?? "?"}
                </div>
              ))}
            </div>

            {/* Source count pill */}
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
                         transition-all duration-200 group-hover:shadow-sm"
              style={{
                background: accent.glow,
                color: accent.dot,
                fontFamily: "var(--font-ui)",
                border: `1px solid ${accent.dot}22`,
              }}
            >
              <Users size={10} />
              {event.sourceCount} Sources
            </span>
          </div>

          {/* Animated CTA arrow */}
          <div
            className="flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100
                       transition-all duration-200 translate-x-1 group-hover:translate-x-0"
            style={{ color: accent.dot, fontFamily: "var(--font-ui)" }}
          >
            <span>Analyze</span>
            <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
