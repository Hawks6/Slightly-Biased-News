import { Shield, Sparkles } from "lucide-react";

export default function RealityScoreBreakdown({ realityScore }) {
  if (!realityScore) return null;
  
  const breakdown = realityScore.breakdown || {};
  const metrics = [
    { 
      label: "Source Reliability", 
      value: breakdown.sourceReliability || 0, 
      color: "var(--color-accent-indigo)",
      desc: "Trustworthiness of reporting outlets"
    },
    { 
      label: "Source Diversity", 
      value: breakdown.sourceDiversity || 0, 
      color: "var(--color-accent-cyan)",
      desc: "Spread across political spectrum"
    },
    { 
      label: "Cross-Reference", 
      value: breakdown.crossReferenceAgreement || 0, 
      color: "var(--color-accent-emerald)",
      desc: "Fact consensus among sources"
    },
  ];

  return (
    <div 
      className="p-6 flex flex-col h-full bg-white relative group transition-all duration-300"
      style={{ 
        borderTop: "3px solid var(--color-rule-heavy)",
        borderBottom: "1px solid var(--color-rule-line)",
        borderLeft: "1px solid var(--color-rule-line)",
        borderRight: "1px solid var(--color-rule-line)",
        background: "var(--color-bg-surface)"
      }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50"
            style={{ border: "1px solid var(--color-rule-line)" }}
          >
            <Shield size={14} style={{ color: "var(--color-text-primary)" }} />
          </div>
          <h2 
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Reality Score
          </h2>
        </div>
        
        {/* Overall score badge */}
        <div className="text-right">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold"
            style={{ 
              background: "rgba(5, 41, 98, 0.05)", 
              color: "var(--color-accent-brand)",
              border: "1px solid rgba(5, 41, 98, 0.1)"
            }}
          >
            <Sparkles size={14} />
            <span style={{ fontFamily: "var(--font-ui)" }}>{realityScore.overall || 0} / 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {metrics.map((m) => (
          <div key={m.label} className="group/meter">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span 
                  className="text-[13px] font-bold uppercase tracking-wide" 
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
                >
                  {m.label}
                </span>
                <span 
                  className="text-[10px] italic mt-0.5" 
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}
                >
                  {m.desc}
                </span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span 
                  className="text-xl font-bold leading-none transition-transform duration-300 group-hover/meter:-translate-y-0.5 inline-block" 
                  style={{ color: m.color, fontFamily: "var(--font-display)" }}
                >
                  {m.value}
                </span>
                <span 
                  className="text-[10px] font-bold" 
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
                >
                  %
                </span>
              </div>
            </div>
            
            {/* Meter Bar */}
            <div className="relative pt-1">
              <div 
                className="w-full h-1.5 rounded-full overflow-hidden" 
                style={{ background: "rgba(0,0,0,0.04)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${m.value}%`,
                    background: `linear-gradient(90deg, ${m.color}, color-mix(in srgb, ${m.color} 80%, black))`,
                  }}
                />
              </div>
              
              {/* Tick marks on hover */}
              <div className="absolute inset-0 top-1 h-1.5 w-full flex justify-between px-0.5 opacity-0 group-hover/meter:opacity-20 transition-opacity duration-300 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-black/50" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
