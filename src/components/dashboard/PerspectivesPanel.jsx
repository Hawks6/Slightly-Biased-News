import { Globe2 } from "lucide-react";

export default function PerspectivesPanel({ perspectives }) {
  if (!perspectives) return null;

  const panels = [
    { data: perspectives.left, color: "var(--color-bias-left)", align: "Left", icon: "«" },
    { data: perspectives.center, color: "var(--color-bias-center)", align: "Center", icon: "—" },
    { data: perspectives.right, color: "var(--color-bias-right)", align: "Right", icon: "»" },
  ];

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
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "var(--color-rule-line)" }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center bg-gray-50 border"
            style={{ borderColor: "var(--color-rule-line)" }}
          >
            <Globe2 size={16} style={{ color: "var(--color-text-primary)" }} />
          </div>
          <h2 
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Perspective Analysis
          </h2>
        </div>
      </div>

      {/* ── 3-Column Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {panels.map(({ data, color, align, icon }, index) => (
          <div
            key={data?.label || align}
            className={`flex flex-col ${index !== 2 ? 'md:border-r md:pr-8' : ''}`}
            style={{ borderColor: "var(--color-rule-line)" }}
          >
            <div className="flex flex-col justify-end mb-4 border-b-2 pb-2 h-20" style={{ borderColor: color }}>
              {data.count !== undefined && (
                <span 
                  className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
                >
                  {data.count} source{data.count !== 1 ? "s" : ""}
                </span>
              )}
              <h3 
                className="text-xl font-bold leading-tight" 
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
              >
                {data.label}
              </h3>
            </div>
            
            {/* Drop letter for narrative */}
            <p 
              className="text-sm leading-relaxed mb-4 flex-1 text-justify"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
            >
              {data.narrative && (
                <span className="float-left text-3xl leading-[0.8] mr-2 mt-1 font-bold" style={{ fontFamily: "var(--font-display)", color }}>
                  {icon}
                </span>
              )}
              {data.narrative}
            </p>
            
            {/* Sources list */}
            {data.sources && data.sources.length > 0 && (
              <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--color-rule-line)" }}>
                <span 
                  className="block text-[9px] uppercase font-bold tracking-widest mb-1.5"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
                >
                  Outlets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(data.sources)).map((s) => (
                    <span 
                      key={s} 
                      className="px-1.5 py-0.5 text-[10px] font-medium border"
                      style={{ 
                        borderColor: "var(--color-rule-line)", 
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-ui)" 
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Coverage Balance Bar ── */}
      {perspectives.balance && perspectives.balance.total > 0 && (
        <div className="mt-8 pt-4 border-t" style={{ borderColor: "var(--color-rule-line)" }}>
          <div className="flex items-center gap-4">
            <span 
              className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" 
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
            >
              Coverage Balance
            </span>
            <div className="flex-1 h-3 flex border" style={{ borderColor: "var(--color-rule-heavy)" }}>
              {perspectives.balance.left > 0 && (
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(perspectives.balance.left / perspectives.balance.total) * 100}%`,
                    background: "var(--color-bias-left)",
                    borderRight: "1px solid var(--color-rule-heavy)"
                  }}
                />
              )}
              {perspectives.balance.center > 0 && (
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(perspectives.balance.center / perspectives.balance.total) * 100}%`,
                    background: "var(--color-bias-center)",
                    borderRight: "1px solid var(--color-rule-heavy)"
                  }}
                />
              )}
              {perspectives.balance.right > 0 && (
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(perspectives.balance.right / perspectives.balance.total) * 100}%`,
                    background: "var(--color-bias-right)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
