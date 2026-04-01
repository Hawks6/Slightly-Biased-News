import { Globe2 } from "lucide-react";

export default function PerspectivesPanel({ perspectives }) {
  if (!perspectives) return null;

  const panels = [
    { data: perspectives.left, color: "var(--color-bias-left)", icon: "←" },
    { data: perspectives.center, color: "var(--color-bias-center)", icon: "◆" },
    { data: perspectives.right, color: "var(--color-bias-right)", icon: "→" },
  ];

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-5">
        <Globe2 size={18} style={{ color: "var(--color-accent-violet)" }} />
        <h2 className="text-lg font-semibold">Perspective Analysis</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {panels.map(({ data, color, icon }) => (
          <div
            key={data?.label || icon}
            className="p-4 rounded-xl border transition-all duration-200 hover:border-opacity-50"
            style={{
              background: "var(--color-bg-tertiary)",
              borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{icon}</span>
              <h3 className="text-sm font-semibold" style={{ color }}>
                {data.label}
              </h3>
              {data.count !== undefined && (
                <span
                  className="ml-auto px-2 py-0.5 text-[10px] rounded-full font-mono"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
                >
                  {data.count} source{data.count !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed mb-3"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-family-serif)" }}>
              {data.narrative}
            </p>
            {data.sources && data.sources.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(data.sources)).map((s) => (
                  <span key={s} className="px-2 py-0.5 text-[10px] rounded-full"
                    style={{ background: "var(--color-bg-card)", color: "var(--color-text-tertiary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Balance indicator */}
      {perspectives.balance && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Coverage Balance:
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden flex" style={{ background: "var(--color-bg-tertiary)" }}>
            {perspectives.balance.left > 0 && (
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(perspectives.balance.left / perspectives.balance.total) * 100}%`,
                  background: "var(--color-bias-left)",
                }}
              />
            )}
            {perspectives.balance.center > 0 && (
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(perspectives.balance.center / perspectives.balance.total) * 100}%`,
                  background: "var(--color-bias-center)",
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
      )}
    </div>
  );
}
