import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function TrendingTicker() {
  const [tickerArticles, setTickerArticles] = useState([]);

  useEffect(() => {
    fetch('/api/news?q=world')
      .then(res => res.json())
      .then(data => {
        if(data?.articles) setTickerArticles(data.articles.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  if (tickerArticles.length === 0) return null;

  return (
    <div className="border-b text-xs py-2 px-6 flex items-center gap-4 overflow-hidden" style={{ background: "color-mix(in srgb, var(--color-bg-primary) 80%, var(--color-accent-indigo))", borderColor: "var(--color-border-primary)" }}>
      <div className="font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-2" style={{ color: "var(--color-accent-indigo)" }}>
        <Activity size={14} className="pulse-dot" /> Live
      </div>
      <div className="flex-1 overflow-hidden relative" style={{ whiteSpace: 'nowrap' }}>
        <div className="inline-block animate-marquee">
          {tickerArticles.map((a, i) => (
            <span key={i} className="mx-8">
              <span className="font-semibold mr-2" style={{ color: "var(--color-text-secondary)" }}>{a.source.name}</span>
              <span style={{ color: "var(--color-text-primary)" }}>{a.title}</span>
            </span>
          ))}
          {tickerArticles.map((a, i) => (
            <span key={`clone-${i}`} className="mx-8">
              <span className="font-semibold mr-2" style={{ color: "var(--color-text-secondary)" }}>{a.source.name}</span>
              <span style={{ color: "var(--color-text-primary)" }}>{a.title}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
