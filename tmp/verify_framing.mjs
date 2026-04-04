import { detectFraming } from "../src/lib/agents/12_framing_detector.js";

async function test() {
  console.log("🚀 Testing Agent 12: Framing Detector...");
  
  const mockArticles = [
    {
      id: "art-1",
      title: "New Tax Bill Proposes 5% Increase on Corporate Earnings",
      description: "Lawmakers debated the financial implications of the new revenue measure, focusing on GDP impact and market volatility."
    },
    {
      id: "art-2",
      title: "Families Struggle as Local Hospital Faces Budget Cuts",
      description: "Heartbreaking stories from patients who can no longer afford life-saving medication due to recent administrative decisions."
    },
    {
      id: "art-3",
      title: "Opposition Leader Accuses Government of 'Political Theater'",
      description: "A heated exchange in parliament today as both sides traded insults over the handling of the recent infrastructure project."
    }
  ];

  try {
    const results = await detectFraming(mockArticles);
    
    console.log("\n🧪 Analysis Results:");
    results.forEach(a => {
      console.log(`\n[${a.title}]`);
      console.log(`   - Lens: ${a.framing?.label || "N/A"}`);
      console.log(`   - Reasoning: ${a.framing?.reasoning || "N/A"}`);
    });
    
    console.log("\n✅ Verification Complete.");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

test();
