import { TrendingUp, Globe2, Building2, Zap, Thermometer, FlaskConical, Palette, MessageSquare } from "lucide-react";

export default function TopicTabs({ onSelect, isLoading }) {
  const topics = [
    { id: "world", label: "World", icon: <Globe2 size={14} /> },
    { id: "politics", label: "Politics", icon: <Building2 size={14} /> },
    { id: "business", label: "Business", icon: <TrendingUp size={14} /> },
    { id: "tech", label: "Tech", icon: <Zap size={14} /> },
    { id: "climate", label: "Climate", icon: <Thermometer size={14} /> },
    { id: "science", label: "Science", icon: <FlaskConical size={14} /> },
    { id: "culture", label: "Culture", icon: <Palette size={14} /> },
    { id: "opinion", label: "Opinion", icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide py-2 mb-6 border-b" style={{ borderColor: "var(--color-rule-line)" }}>
      {topics.map(t => (
        <button
          key={t.id}
          disabled={isLoading}
          onClick={() => onSelect(t.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap"
          style={{
            background: "var(--color-bg-tertiary)",
            borderColor: "var(--color-border-primary)",
            color: "var(--color-text-primary)",
          }}
          onMouseOver={(e) => {
            if(!isLoading) {
              e.currentTarget.style.borderColor = "var(--color-accent-indigo)";
              e.currentTarget.style.color = "var(--color-accent-indigo)";
            }
          }}
          onMouseOut={(e) => {
            if(!isLoading) {
              e.currentTarget.style.borderColor = "var(--color-border-primary)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }
          }}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}
