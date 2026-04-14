import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Rectangle } from "recharts";
import { BarChart3 } from "lucide-react";
import { BIAS_COLORS } from "../Constants";

export default function BiasDistributionChart({ biasChart }) {
  if (!biasChart) return null;

  // Custom polished tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fillColor = payload[0].fill;

      return (
        <div 
          className="bg-white p-3 border rounded shadow-lg animate-fade-in-up"
          style={{ 
            borderColor: "var(--color-rule-line)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fillColor }} />
            <p 
              className="text-[13px] font-bold uppercase tracking-wider" 
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-ui)" }}
            >
              {data.fullName}
            </p>
          </div>
          <p 
            className="text-[11px] font-medium" 
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-ui)" }}
          >
            <span className="font-bold text-gray-800">{payload[0].value}</span> source{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

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
      <div className="flex items-center gap-2 mb-6">
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50"
          style={{ border: "1px solid var(--color-rule-line)" }}
        >
          <BarChart3 size={14} style={{ color: "var(--color-text-primary)" }} />
        </div>
        <h2 
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          Bias Distribution
        </h2>
      </div>

      <div className="w-full h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={biasChart} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="var(--color-rule-line)" 
              opacity={0.6}
            />
            <XAxis
              dataKey="fullName"
              tick={{ fill: "var(--color-text-muted)", fontSize: 10, fontFamily: "var(--font-ui)", fontWeight: 600 }}
              axisLine={{ stroke: "var(--color-rule-line)" }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: "var(--color-text-muted)", fontSize: 10, fontFamily: "var(--font-ui)", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              dx={-8}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />
            <Bar 
              dataKey="count" 
              radius={[3, 3, 0, 0]} 
              maxBarSize={40}
              activeBar={<Rectangle stroke="black" strokeWidth={1} strokeOpacity={0.1} />}
              animationDuration={800}
            >
              {biasChart.map((entry, i) => (
                <Cell
                  key={i}
                  fill={BIAS_COLORS[entry.fullName] || "var(--color-text-secondary)"}
                  fillOpacity={0.9}
                  className="transition-all duration-300 hover:opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
