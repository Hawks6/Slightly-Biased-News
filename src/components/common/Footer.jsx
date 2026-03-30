"use client";

export default function Footer() {
  return (
    <footer className="mt-20 pb-12 border-t pt-8" style={{ borderColor: "var(--color-rule-line)" }}>
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          <span className="italic font-bold" style={{ color: "var(--color-text-primary)" }}>Slightly</span> Biased News
          <span className="mx-3 opacity-30 text-white">|</span>
          <span className="text-xs uppercase tracking-widest opacity-60">News Bias Analyzer</span>
        </div>
        
        <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: "var(--color-accent-kicker)" }}>
          <a href="#" className="hover:text-white transition-colors">Methodology</a>
          <a href="#" className="hover:text-white transition-colors">Transparency</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>

        <div className="text-[10px] uppercase tracking-widest opacity-40 font-mono">
          © {new Date().getFullYear()} Slightly Biased News AI
        </div>
      </div>
    </footer>
  );
}
