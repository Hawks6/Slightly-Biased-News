import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Newspaper } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={32} className="agent-spinner mb-4 text-indigo-500" />
        <h2 className="text-xl font-bold font-display">Clustering Live Events...</h2>
        <p className="text-sm text-gray-500">Connecting data points across the news cycle</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 border-l-4 border-rose-500 flex items-center gap-4">
        <AlertTriangle size={24} className="text-rose-500" />
        <div>
          <h3 className="font-bold text-rose-500">Event Feed Offline</h3>
          <p className="text-sm text-gray-600">{error}. Please try again.</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
        <Newspaper size={32} className="mx-auto mb-4 opacity-20" />
        <h3 className="font-bold text-gray-400">No Multi-Source Events Found</h3>
        <p className="text-sm text-gray-500 mt-1">Try another topic or search directly.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: "var(--color-rule-line)" }}>
        <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          The Today Edition: {topic.charAt(0).toUpperCase() + topic.slice(1)}
        </h2>
        <span className="text-xs uppercase tracking-widest font-bold opacity-40">
          Showing {events.length} Signal Clusters
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {events.map((event, idx) => (
          <EventCard 
            key={event.id || idx} 
            event={event} 
            onClick={onEventSelect} 
          />
        ))}
      </div>
    </div>
  );
}
