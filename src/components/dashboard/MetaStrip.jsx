import { Newspaper, Activity, Scale, Shield } from "lucide-react";

export default function MetaStrip({ meta, coverageHealth }) {
  if (!meta || !coverageHealth) return null;

  const items = [
    {
      icon: <Newspaper size={16} />,
      label: "Sources Analyzed",
      value: meta.articleCount,
      color: "var(--color-accent-indigo)",
    },
    {
      icon: <Activity size={16} />,
      label: "Agents Executed",
      value: meta.processingAgents?.length || 0,
      color: "var(--color-accent-violet)",
    },
    {
      icon: <Scale size={16} />,
      label: "Diversity Rating",
      value: coverageHealth.diversityRating,
      color: coverageHealth.diversityRating === "Excellent"
        ? "var(--color-accent-emerald)"
        : coverageHealth.diversityRating === "Good"
        ? "var(--color-accent-cyan)"
        : "var(--color-accent-amber)",
    },
    {
      icon: <Shield size={16} />,
      label: "Avg. Reliability",
      value: `${coverageHealth.averageReliability}%`,
      color: coverageHealth.averageReliability >= 75
        ? "var(--color-accent-emerald)"
        : "var(--color-accent-amber)",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 stagger-children">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
          >
            <span style={{ color: item.color }}>{item.icon}</span>
          </div>
          <div>
            <div className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {item.label}
            </div>
            <div className="text-lg font-semibold" style={{ color: item.color }}>
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
