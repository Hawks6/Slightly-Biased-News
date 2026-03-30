"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import {
  Search, TrendingUp, Shield, Eye, Clock, AlertTriangle,
  ChevronRight, ExternalLink, Newspaper, Activity,
  Loader2, Sparkles, BarChart3, Globe2, Zap,
  Building2, Scale, FileWarning, Quote,
} from "lucide-react";
import clsx from "clsx";

// Bias color mapping
const BIAS_COLORS = {
  "Left": "#3b82f6",
  "Center Left": "#60a5fa",
  "Center": "#a78bfa",
  "Center Right": "#f97316",
  "Right": "#ef4444",
};

const BIAS_TAG_CLASS = {
  "left": "bias-left",
  "center-left": "bias-center-left",
  "center": "bias-center",
  "center-right": "bias-center-right",
  "right": "bias-right",
};

// ======================= SUB-COMPONENTS =======================

function AgentStatusBar({ isLoading }) {
  const agents = [
    "News Fetcher", "Normalizer", "Bias Classifier", "Ownership Resolver",
    "Summarizer", "Reality Scorer", "Perspective Builder", "Timeline Builder",
    "Diff Highlighter", "Payload Builder",
  ];

  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading]);

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

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const suggestions = [
    "Interest rate cuts",
    "AI regulation",
    "Climate policy",
    "Immigration reform",
    "Tech layoffs",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="mb-10">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card gradient-border flex items-center overflow-hidden">
          <Search
            size={20}
            className="ml-5 flex-shrink-0"
            style={{ color: "var(--color-text-tertiary)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a news topic to analyze across sources…"
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-gray-500"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-family-sans)" }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={clsx(
              "px-6 py-2 mr-3 rounded-lg text-sm font-semibold transition-all duration-200",
              isLoading || !query.trim()
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
            )}
          >
            {isLoading ? (
              <Loader2 size={16} className="agent-spinner" />
            ) : (
              <>Analyze</>
            )}
          </button>
        </div>
      </form>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          Try:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              onSearch(s);
            }}
            disabled={isLoading}
            className="px-3 py-1 text-xs rounded-full border transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-300"
            style={{
              background: "var(--color-bg-tertiary)",
              borderColor: "var(--color-border-primary)",
              color: "var(--color-text-secondary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetaStrip({ meta, coverageHealth }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 stagger-children">
      {[
        {
          icon: <Newspaper size={16} />,
          label: "Sources Analyzed",
          value: meta.articleCount,
          color: "var(--color-accent-indigo)",
        },
        {
          icon: <Activity size={16} />,
          label: "Agents Executed",
          value: meta.processingAgents.length,
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
      ].map((item) => (
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

function SummaryCard({ summary, realityScore }) {
  return (
    <div className="glass-card gradient-border p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: "var(--color-accent-violet)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Editorial Summary
          </h2>
          {summary.method === "ai" && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-mono">
              AI Powered
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: realityScore.overall >= 70
                ? "rgba(52, 211, 153, 0.15)"
                : realityScore.overall >= 50
                ? "rgba(251, 191, 36, 0.15)"
                : "rgba(251, 113, 133, 0.15)",
              color: realityScore.overall >= 70
                ? "var(--color-credibility-high)"
                : realityScore.overall >= 50
                ? "var(--color-credibility-medium)"
                : "var(--color-credibility-low)",
            }}
          >
            {realityScore.overall}
          </div>
          <div className="text-right">
            <div className="text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
              Reality Score
            </div>
            <div
              className="text-xs font-medium"
              style={{
                color: realityScore.overall >= 70
                  ? "var(--color-credibility-high)"
                  : realityScore.overall >= 50
                  ? "var(--color-credibility-medium)"
                  : "var(--color-credibility-low)",
              }}
            >
              {realityScore.label}
            </div>
          </div>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-family-serif)" }}
      >
        {summary.summary}
      </p>

      {summary.takeaways && summary.takeaways.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-text-tertiary)" }}>
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {summary.takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"
                style={{ color: "var(--color-text-secondary)" }}>
                <ChevronRight size={14} className="mt-0.5 flex-shrink-0"
                  style={{ color: "var(--color-accent-indigo)" }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.watchStatement && (
        <div className="quote-highlight text-sm mt-3">
          <Eye size={14} className="inline mr-2" style={{ color: "var(--color-accent-indigo)" }} />
          {summary.watchStatement}
        </div>
      )}
    </div>
  );
}

function BiasDistributionChart({ biasChart }) {
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

function RealityScoreBreakdown({ realityScore }) {
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

function PerspectivesPanel({ perspectives }) {
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
            key={data.label}
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
                {data.sources.map((s) => (
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
    </div>
  );
}

function TimelinePanel({ timeline }) {
  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: "var(--color-accent-amber)" }} />
          <h2 className="text-lg font-semibold">Coverage Timeline</h2>
        </div>
        {timeline.firstReporter && (
          <span className="px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            First: {timeline.firstReporter.source}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--color-border-secondary)" }} />

        <div className="space-y-4 ml-8">
          {timeline.events.map((event, i) => (
            <div key={event.id} className="relative flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Dot */}
              <div
                className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: BIAS_COLORS[event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())] || "var(--color-accent-indigo)",
                  background: i === 0 ? BIAS_COLORS[event.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())] || "var(--color-accent-indigo)" : "var(--color-bg-primary)",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx("px-2 py-0.5 text-[10px] rounded-full font-medium", BIAS_TAG_CLASS[event.bias] || "bias-center")}>
                    {event.source}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                    {event.timeLabel}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {timeline.coverageSpanHours > 0 && (
        <div className="mt-4 pt-3 border-t text-xs" style={{ borderColor: "var(--color-border-primary)", color: "var(--color-text-tertiary)" }}>
          Coverage span: <strong>{timeline.coverageSpanHours}h</strong> from first to latest report
        </div>
      )}
    </div>
  );
}

function DiffsPanel({ diffs }) {
  return (
    <div className="glass-card p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileWarning size={18} style={{ color: "var(--color-accent-rose)" }} />
          <h2 className="text-lg font-semibold">Framing & Language Analysis</h2>
        </div>
        <span
          className={clsx(
            "px-3 py-1 text-xs rounded-full font-mono",
            diffs.overallFramingDivergence === "high"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : diffs.overallFramingDivergence === "moderate"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          )}
        >
          {diffs.overallFramingDivergence} divergence
        </span>
      </div>

      {/* Contradictions */}
      {diffs.contradictions.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-tertiary)" }}>
            Framing Contrasts
          </h3>
          <div className="space-y-3">
            {diffs.contradictions.map((c, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {c.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400">
                    &quot;{c.left.keyword}&quot;
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>vs</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-red-500/10 text-red-400">
                    &quot;{c.right.keyword}&quot;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loaded Language */}
      {diffs.loadedLanguage.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-tertiary)" }}>
            Loaded Language Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {diffs.loadedLanguage.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={clsx("px-2 py-0.5 text-[10px] rounded-full", BIAS_TAG_CLASS[item.bias] || "bias-center")}>
                  {item.source}
                </span>
                {item.words.slice(0, 3).map((w) => (
                  <span key={w} className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-500/8 text-rose-300 border border-rose-500/15">
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SourceCards({ sourceCards }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Newspaper size={18} style={{ color: "var(--color-accent-sky)" }} />
        <h2 className="text-lg font-semibold">Source Intelligence</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {sourceCards.map((card) => (
          <div
            key={card.id}
            className="glass-card glass-card-hover p-5 cursor-pointer transition-all duration-200"
            onClick={() => setExpanded(expanded === card.id ? null : card.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={clsx("px-2 py-0.5 text-[10px] rounded-full font-semibold", BIAS_TAG_CLASS[card.bias] || "bias-center")}>
                  {card.bias?.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {card.source}
                </span>
              </div>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            <h3 className="text-sm font-medium mb-2 leading-snug" style={{ color: "var(--color-text-primary)" }}>
              {card.title}
            </h3>
            <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {card.description}
            </p>

            {expanded === card.id && (
              <div className="mt-4 pt-3 border-t space-y-2 animate-fade-in-up" style={{ borderColor: "var(--color-border-primary)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>Reliability</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-bg-tertiary)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${card.reliability}%`,
                          background: card.reliability >= 75 ? "var(--color-credibility-high)" : card.reliability >= 50 ? "var(--color-credibility-medium)" : "var(--color-credibility-low)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>{card.reliability}%</span>
                  </div>
                </div>
                {card.ownership && (
                  <div className="flex items-center gap-2">
                    <Building2 size={12} style={{ color: "var(--color-text-tertiary)" }} />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {card.ownership.owner} ({card.ownership.type})
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  <Clock size={12} />
                  <span>{card.readTime} min read · {card.contentLength}</span>
                  <span className="ml-auto text-[10px] font-mono">
                    Bias score: {card.biasScore > 0 ? "+" : ""}{card.biasScore}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================= MAIN COMPONENT =======================

export default function NewsLensApp() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Analysis failed");
      }
      const payload = await res.json();
      setData(payload);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-primary)" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--color-border-primary)" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--color-accent-indigo), var(--color-accent-violet))" }}>
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight gradient-text">
                Slightly Biased
              </h1>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-tertiary)" }}>
                Editorial Intelligence Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="font-mono">10 agents online</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <AgentStatusBar isLoading={isLoading} />

        {error && (
          <div className="glass-card p-5 mb-8 border-l-4 animate-fade-in-up"
            style={{ borderLeftColor: "var(--color-accent-rose)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: "var(--color-accent-rose)" }} />
              <span className="text-sm" style={{ color: "var(--color-accent-rose)" }}>
                {error}
              </span>
            </div>
          </div>
        )}

        {data && (
          <div className="animate-fade-in-up">
            <MetaStrip meta={data.meta} coverageHealth={data.coverageHealth} />
            <SummaryCard summary={data.summary} realityScore={data.realityScore} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <BiasDistributionChart biasChart={data.biasChart} />
              <RealityScoreBreakdown realityScore={data.realityScore} />
            </div>

            <PerspectivesPanel perspectives={data.perspectives} />
            <TimelinePanel timeline={data.timeline} />
            <DiffsPanel diffs={data.diffs} />
            <SourceCards sourceCards={data.sourceCards} />

            {/* Footer meta */}
            <div className="glass-card p-4 text-center mb-16">
              <p className="text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                Analyzed &quot;{data.meta.query}&quot; · {data.meta.articleCount} sources ·{" "}
                {data.meta.processingAgents.length} agents · Data via {data.meta.fetchSource} ·{" "}
                {new Date(data.meta.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !isLoading && !error && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))" }}>
              <Search size={28} style={{ color: "var(--color-accent-indigo)" }} />
            </div>
            <h2 className="text-xl font-semibold mb-2 gradient-text">
              Analyze Any News Topic
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Enter a topic above to see how it&apos;s covered across the political spectrum.
              Our 10-agent pipeline analyzes bias, credibility, and framing in real time.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              {[
                { icon: <Shield size={14} />, label: "Bias Detection" },
                { icon: <TrendingUp size={14} />, label: "Credibility Analysis" },
                { icon: <Globe2 size={14} />, label: "Multi-Perspective" },
                { icon: <Activity size={14} />, label: "Framing Analysis" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  <span style={{ color: "var(--color-accent-indigo)" }}>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
