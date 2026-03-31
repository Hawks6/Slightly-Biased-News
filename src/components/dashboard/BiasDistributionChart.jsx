import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { BIAS_COLORS } from "../Constants";

export default function BiasDistributionChart({ biasChart }) {
  if (!biasChart) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
            {payload[0].payload.fullName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {payload[0].value} source{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} style={{ color: "var(--color-accent-cyan)" }} />
        <h2 className="text-lg font-semibold">Bias Distribution</h2>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={biasChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="fullName"
              tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {biasChart.map((entry, i) => (
                <Cell
                  key={i}
                  fill={BIAS_COLORS[entry.fullName] || "#6366f1"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
