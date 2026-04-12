"use client";

import { useState, useCallback } from "react";
import { Loader2, AlertTriangle, ChevronLeft } from "lucide-react";
import clsx from "clsx";

// Modular Components
import TrendingTicker from "./common/TrendingTicker";
import AgentStatusBar from "./common/AgentStatusBar";
import SearchBar from "./common/SearchBar";
import TopicSelector from "./TopicSelector";
import TopicTabs from "./TopicTabs";
import EventFeed from "./events/EventFeed";
import Footer from "./common/Footer";

// Dashboard Components
import SummaryCard from "./dashboard/SummaryCard";
import BiasDistributionChart from "./dashboard/BiasDistributionChart";
import PerspectivesPanel from "./dashboard/PerspectivesPanel";
import TimelinePanel from "./dashboard/TimelinePanel";
import DiffsPanel from "./dashboard/DiffsPanel";
import SourceCards from "./dashboard/SourceCards";

export default function SlightlyBiasedApp() {
  const [activeView, setActiveView] = useState("selector"); // "selector" | "events" | "analysis"
  const [activeTab, setActiveTab] = useState("perspectives"); // For deep dive right column
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Universal Analysis Fetcher (handles both GET search and POST event analysis)
   */
  const performAnalysis = useCallback(async (options) => {
    setActiveView("analysis");
    setActiveTab("perspectives");
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      let res;
      if (options.method === "POST") {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articles: options.articles,
            query: options.query
          }),
        });
      } else {
        res = await fetch(`/api/analyze?q=${encodeURIComponent(options.query)}`);
      }

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

  const handleTopicSelect = useCallback((topic) => {
    setSelectedTopic(topic);
    setActiveView("events");
    window.scrollTo(0, 0);
  }, []);

  const handleEventSelect = useCallback((event) => {
    performAnalysis({
      method: "POST",
      articles: event.articles,
      query: event.title
    });
  }, [performAnalysis]);

  const handleDirectSearch = useCallback((query) => {
    handleTopicSelect(query);
  }, [handleTopicSelect]);

  const goHome = useCallback(() => {
    setActiveView("selector");
    setSelectedTopic(null);
    setData(null);
    setError(null);
    window.scrollTo(0, 0);
  }, []);

  const backToEvents = useCallback(() => {
    setActiveView("events");
    setData(null);
    setError(null);
    window.scrollTo(0, 0);
  }, []);

  // Level 1: Topic Branding/Selector
  if (activeView === "selector") {
    return <TopicSelector onSelect={handleTopicSelect} />;
  }

  // Common Header for Levels 2 and 3
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg-page)" }}>
      <header className="border-b sticky top-0 z-50" style={{ borderColor: "var(--color-rule-line)", background: "var(--color-bg-nav)" }}>
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-3 cursor-pointer">
            <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              <i className="font-serif italic font-bold">Slightly</i> Biased News
            </h1>
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            {["World", "Politics", "Business", "Tech"].map(t => (
              <button 
                key={t} 
                onClick={() => handleTopicSelect(t.toLowerCase())} 
                className={clsx(
                  "text-sm font-medium transition-colors cursor-pointer",
                  selectedTopic === t.toLowerCase() ? "text-white underline decoration-indigo-400 underline-offset-8" : "text-white/70 hover:text-white"
                )}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             {activeView === "analysis" && (
                <button onClick={backToEvents} className="text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                   <ChevronLeft size={16} /> Back to {selectedTopic || "Feed"}
                </button>
             )}
            <button onClick={goHome} className="text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              &larr; All Topics
            </button>
          </div>
        </div>
      </header>

      <TrendingTicker />

      <main className="max-w-[1280px] mx-auto px-6 py-8 container flex-1">
        {/* Navigation Tabs (always visible in feed/analysis) */}
        <TopicTabs onSelect={handleTopicSelect} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Main Content Column */}
          <div className="main-col min-w-0">
            {/* View 2: Event Grid */}
            {activeView === "events" && (
              <EventFeed topic={selectedTopic} onEventSelect={handleEventSelect} />
            )}

            {/* View 3: Analysis Dashboard */}
            {activeView === "analysis" && (
              <div className="analysis-view min-w-0">
                <AgentStatusBar isLoading={isLoading} />

                {error && (
                  <div className="glass-card p-5 mb-8 border-l-4 animate-fade-in-up border-rose-500">
                    <div className="flex items-center gap-2">
                       <AlertTriangle size={16} className="text-rose-500" />
                       <span className="text-sm text-rose-500">{error}</span>
                    </div>
                  </div>
                )}

                {data && (
                  <div className="flex flex-col gap-6 animate-fade-in-up">
                    <TimelinePanel timeline={data.timeline} />
                    <SummaryCard 
                      summary={data.summary} 
                      realityScore={data.realityScore} 
                      coverageHealth={data.coverageHealth} 
                      query={data.meta?.query} 
                      onExploreClick={() => {
                        const el = document.getElementById("deep-dive-hub");
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }} 
                    />
                    
                    {/* Deep Dive Hub */}
                    <div id="deep-dive-hub" className="bg-white border mb-8" style={{ borderColor: 'var(--color-rule-line)' }}>
                      {/* Tabs Header */}
                      <div className="flex items-center border-b px-4 mt-2 overflow-x-auto no-scrollbar gap-2" style={{ borderColor: 'var(--color-rule-line)' }}>
                        <div className="flex items-center gap-2 py-3 pr-4 border-r" style={{ borderColor: 'var(--color-rule-line)' }}>
                           <span className="text-[12px] font-bold uppercase tracking-widest text-[#8b0000]" style={{ fontFamily: "var(--font-ui)" }}>
                             Deep Dive
                           </span>
                        </div>
                        {[
                          { id: "perspectives", label: "Perspective Analysis" },
                          { id: "framing", label: "Framing & Language" },
                          { id: "sources", label: "Source Intel" }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                              "px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap",
                              activeTab === tab.id 
                                ? "text-black border-b-[3px]" 
                                : "text-gray-500 hover:text-black hover:bg-gray-50 border-b-[3px] border-transparent"
                            )}
                            style={{ 
                              fontFamily: "var(--font-ui)",
                              borderBottomColor: activeTab === tab.id ? 'var(--color-accent-brand)' : 'transparent'
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="p-6 md:p-8">
                        {activeTab === "perspectives" && (
                          <div className="space-y-10 animate-fade-in-up">
                            <PerspectivesPanel perspectives={data.perspectives} />
                            <BiasDistributionChart biasChart={data.biasChart} />
                          </div>
                        )}

                        {activeTab === "framing" && (
                          <div className="animate-fade-in-up">
                            <DiffsPanel diffs={data.diffs} sourceCards={data.sourceCards} />
                          </div>
                        )}

                        {activeTab === "sources" && (
                          <div className="animate-fade-in-up">
                            <SourceCards sourceCards={data.sourceCards} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!data && isLoading && !error && (
                  <div className="text-center py-20 animate-fade-in-up border border-dashed rounded-lg mt-8" style={{ borderColor: "var(--color-rule-line)" }}>
                    <Loader2 size={32} className="agent-spinner mx-auto mb-4" style={{ color: "var(--color-accent-brand)" }} />
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
                      Performing Synthetic Analysis...
                    </h2>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      Aggregating perspectives and highlighting linguistic framing
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Persistent Sidebar */}
          <div className="sidebar-col hidden lg:block sticky top-32 space-y-8 self-start">
            <div className="glass-card p-6" style={{ background: "var(--color-bg-nav)" }}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 font-mono">Expert Search</h3>
              <SearchBar onSearch={handleDirectSearch} isLoading={isLoading} />
            </div>

            <div className="glass-card p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--color-accent-kicker)" }}>
                Editorial Standard
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
                <i className="italic font-bold">Slightly</i> Biased News uses a multi-agent AI pipeline to summarize framing contrasts across the political spectrum. 
              </p>
              <div className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 opacity-40">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Neutral Verified
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
