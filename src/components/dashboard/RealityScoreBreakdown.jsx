import { Shield } from "lucide-react";

export default function RealityScoreBreakdown({ realityScore }) {
  if (!realityScore) return null;
  
  const breakdown = realityScore.breakdown || {};
  const metrics = [
    { label: "Source Reliability", value: breakdown.sourceReliability || 0, color: "var(--color-accent-indigo)" },
    { label: "Source Diversity", value: breakdown.sourceDiversity || 0, color: "var(--color-accent-cyan)" },
    { label: "Cross-Reference", value: breakdown.crossReferenceAgreement || 0, color: "var(--color-accent-emerald)" },
  ];

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} style={{ color: "var(--color-accent-emerald)" }} />
        <h2 className="text-lg font-semibold">Reality Score Breakdown</h2>
      </div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {m.label}
              </span>
              <span className="text-xs font-mono" style={{ color: m.color }}>
                {m.value}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-tertiary)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${m.value}%`,
                  background: `linear-gradient(90deg, ${m.color}, color-mix(in srgb, ${m.color} 60%, transparent))`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
