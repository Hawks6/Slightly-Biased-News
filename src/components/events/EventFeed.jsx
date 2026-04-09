import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Newspaper, Radio, Zap } from "lucide-react";
import EventCard from "./EventCard";

export default function EventFeed({ topic, onEventSelect }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topic) return;

    async function fetchEvents() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events?topic=${encodeURIComponent(topic)}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [topic]);

  const topicLabel = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "";
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
        {/* Pulsing ring loader */}
        <div className="relative mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(5,41,98,0.06)", border: "2px solid rgba(5,41,98,0.12)" }}
          >
            <Loader2 size={30} className="agent-spinner" style={{ color: "var(--color-accent-brand)" }} />
          </div>
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "rgba(5,41,98,0.15)" }}
          />
        </div>

        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          Clustering Live Events
        </h2>
        <p className="text-sm max-w-xs" style={{ color: "var(--color-text-muted)" }}>
          Connecting data points across the news cycle…
        </p>

        {/* Skeleton cards hint */}
        <div className="grid grid-cols-3 gap-4 mt-12 w-full max-w-3xl opacity-30">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded shimmer"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div
        className="glass-card p-8 border-l-4 flex items-start gap-5 animate-fade-in-up"
        style={{
          borderLeftColor: "var(--color-accent-red)",
          boxShadow: "0 2px 12px rgba(153,0,0,0.08)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(153,0,0,0.1)", border: "1px solid rgba(153,0,0,0.15)" }}
        >
          <AlertTriangle size={20} style={{ color: "var(--color-accent-red)" }} />
        </div>
        <div>
          <h3
            className="font-bold mb-1 text-base"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-accent-red)" }}
          >
            Event Feed Offline
          </h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {error}. Please try again.
          </p>
        </div>
      </div>
    );
  }

  /* ── Empty State ── */
  if (events.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-28 text-center border-2 border-dashed rounded-lg animate-fade-in-up"
        style={{ borderColor: "var(--color-rule-line)" }}
      >
        <Newspaper size={40} className="mb-5 opacity-20" style={{ color: "var(--color-text-primary)" }} />
        <h3
          className="font-bold text-lg mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          No Multi-Source Events Found
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Try another topic or use Expert Search to dig deeper.
        </p>
      </div>
    );
  }

  /* ── Feed ── */
  return (
    <div className="animate-fade-in-up">

      {/* ── Editorial Masthead ── */}
      <div className="mb-8">

        {/* Live Coverage kicker */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-2"
            style={{ color: "var(--color-accent-kicker)", fontFamily: "var(--font-ui)" }}
          >
            {/* Animated live dot */}
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: "var(--color-accent-kicker)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--color-accent-kicker)" }}
              />
            </span>
            <Radio size={11} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              Live Coverage
            </span>
          </div>

          {/* Cluster count badge — right side */}
          <span
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest
                       px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(5,41,98,0.07)",
              color: "var(--color-accent-brand)",
              fontFamily: "var(--font-ui)",
              border: "1px solid rgba(5,41,98,0.12)",
            }}
          >
            <Zap size={9} />
            {events.length} Signal Cluster{events.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Heavy rule */}
        <div className="h-[3px] w-full mb-3" style={{ background: "var(--color-rule-heavy)" }} />

        {/* Title row */}
        <div className="flex items-end justify-between">
          <h2
            className="text-3xl font-bold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {topicLabel}{" "}
            <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>Edition</span>
          </h2>
          <span
            className="text-[10px] font-medium hidden sm:block"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-ui)" }}
          >
            {todayStr}
          </span>
        </div>

        {/* Thin rule */}
        <div className="h-px w-full mt-3" style={{ background: "var(--color-rule-line)" }} />
      </div>

      {/* ── Event Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 stagger-children">
        {events.map((event, idx) => (
          <EventCard
            key={event.id || idx}
            event={event}
            index={idx}
            onClick={onEventSelect}
          />
        ))}
      </div>
    </div>
  );
}
