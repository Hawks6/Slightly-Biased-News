import { Newspaper, ChevronRight, Users } from "lucide-react";
import clsx from "clsx";

export default function EventCard({ event, onClick }) {
  const publishedDate = new Date(event.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      onClick={() => onClick(event)}
      className="glass-card group p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/40 relative overflow-hidden flex flex-col h-full border"
      style={{ borderColor: "var(--color-rule-line)", background: "var(--color-bg-surface)" }}
    >
      {/* Kicker */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent-kicker)" }}>
          Breaking Event
        </span>
        <span className="text-[10px] font-mono opacity-50">
          {publishedDate}
        </span>
      </div>

      {/* Title */}
      <h3 
        className="text-2xl font-bold mb-4 leading-tight group-hover:text-indigo-400 transition-colors"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        {event.title}
      </h3>

      {/* Description fallback */}
      {event.articles && event.articles[0] && (
        <p className="text-sm italic line-clamp-2 mb-6 flex-grow" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
          {event.articles[0].description}
        </p>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-rule-line)" }}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {event.articles?.slice(0, 3).map((a, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold overflow-hidden bg-gray-100"
                style={{ borderColor: "var(--color-bg-surface)" }}
                title={a.source.name}
              >
                {a.source.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center gap-1">
            <Users size={12} /> {event.sourceCount} Sources
          </span>
        </div>
        
        <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
