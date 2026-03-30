import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function AgentStatusBar({ isLoading }) {
  const agents = [
    "News Fetcher", "Normalizer", "Bias Classifier", "Ownership Resolver",
    "Summarizer", "Reality Scorer", "Perspective Builder", "Timeline Builder",
    "Diff Highlighter", "Payload Builder",
  ];

  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setActiveAgent(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading, agents.length]);

  if (!isLoading) return null;

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 size={18} className="agent-spinner" style={{ color: "var(--color-accent-indigo)" }} />
        <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Multi-Agent Pipeline Active
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {agents.map((agent, i) => (
          <span
            key={agent}
            className={clsx(
              "px-3 py-1 text-xs rounded-full font-mono transition-all duration-300",
              i < activeAgent
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : i === activeAgent
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 scale-105"
                : "bg-white/5 text-gray-500 border border-white/5"
            )}
          >
            {i < activeAgent ? "✓" : i === activeAgent ? "⟳" : "○"} {agent}
          </span>
        ))}
      </div>
    </div>
  );
}
