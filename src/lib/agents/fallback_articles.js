// Fallback articles used when all live news sources are unavailable.
// Loaded lazily by 01_news_fetcher.js to keep that module lightweight.

const FALLBACK_ARTICLES = [
  // ── Thread 1: Central bank rate decisions ─────────────────────────────
  {
    source: { id: "reuters", name: "Reuters" },
    author: "Reuters Staff",
    title: "Global markets rally as central banks signal rate cuts ahead",
    description: "Stock markets across the globe surged after several central banks indicated they would begin easing monetary policy, boosting investor confidence.",
    url: "https://reuters.com/markets/global-rally",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    content: "Markets surged globally as the Federal Reserve and European Central Bank both signaled potential rate cuts. The S&P 500 jumped 2.1% while European indices saw similar gains."
  },
  {
    source: { id: "bbc-news", name: "BBC News" },
    author: "Laura Kuenssberg",
    title: "Central banks offer cautious optimism on rate reductions",
    description: "Central banking authorities expressed measured confidence in the outlook, suggesting a careful approach to interest rate adjustments.",
    url: "https://bbc.com/news/business/rates",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    content: "The Bank of England's latest minutes reveal a committee divided on the pace of rate reductions, reflecting uncertainty about global economic conditions and persistent inflation."
  },
  {
    source: { id: "wsj", name: "The Wall Street Journal" },
    author: "Nick Timiraos",
    title: "Fed officials weigh timing of first rate cut amid mixed economic signals",
    description: "Federal Reserve policymakers are debating whether the economy has cooled enough to justify the first interest rate reduction.",
    url: "https://wsj.com/economy/fed-rate-cut-debate",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    content: "Fed minutes show officials remain divided. Doves warn of overtightening; hawks cite sticky services inflation. Market pricing implies three cuts this year."
  },
  {
    source: { id: "nyt", name: "The New York Times" },
    author: "Jeanna Smialek",
    title: "The great rate debate: When will the Fed finally cut?",
    description: "A deep analysis of the economic indicators that will determine the timing of Federal Reserve interest rate reductions.",
    url: "https://nytimes.com/economy/rate-debate",
    urlToImage: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=800",
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    content: "Inflation has fallen from its 9% peak but remains above 2%. The labor market shows signs of normalization. Housing inflation stays elevated as a wild card."
  },

  // ── Thread 2: AI regulation debate ────────────────────────────────────
  {
    source: { id: "the-verge", name: "The Verge" },
    author: "Nilay Patel",
    title: "Congress moves toward bipartisan AI regulation framework",
    description: "Lawmakers on both sides are negotiating the first comprehensive federal rules governing artificial intelligence development and deployment.",
    url: "https://theverge.com/ai/congress-ai-regulation",
    urlToImage: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800",
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    content: "Senate negotiators released a draft AI framework requiring safety testing for frontier models, mandatory incident reporting, and third-party audits for high-risk applications."
  },
  {
    source: { id: "wired", name: "Wired" },
    author: "Khari Johnson",
    title: "Tech giants lobby hard against proposed AI safety mandates",
    description: "Major technology companies are pushing back against federal AI oversight rules, warning that heavy regulation could stifle innovation.",
    url: "https://wired.com/ai/tech-lobby-ai-rules",
    urlToImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    publishedAt: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    content: "A coalition of AI companies including OpenAI, Google DeepMind, and Anthropic sent a joint letter arguing that proposed mandatory safety tests could delay model releases by years."
  },
  {
    source: { id: "axios", name: "Axios" },
    author: "Sara Fischer",
    title: "EU AI Act forces US companies to rethink global compliance strategies",
    description: "With Europe's sweeping AI rules taking effect, American firms face a regulatory patchwork that could reshape how they build and deploy AI products.",
    url: "https://axios.com/tech/eu-ai-act-compliance",
    urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    content: "The EU AI Act's risk-based tiering is forcing American companies to classify products and establish compliance infrastructure in Europe before US rules are finalized."
  },

  // ── Thread 3: Climate and energy policy ───────────────────────────────
  {
    source: { id: "guardian", name: "The Guardian" },
    author: "Damian Carrington",
    title: "Record global temperatures push climate emergency to center of G7 talks",
    description: "Leaders face pressure to accelerate climate commitments after data shows the past 12 months were the hottest on record.",
    url: "https://theguardian.com/environment/g7-climate",
    urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    content: "Copernicus data confirms the hottest 12-month period since records began. G7 nations face pressure to commit to faster coal phase-outs and higher renewable energy targets."
  },
  {
    source: { id: "bloomberg", name: "Bloomberg" },
    author: "Will Wade",
    title: "Solar and wind investment surges to record $1 trillion as fossil fuel costs rise",
    description: "Clean energy investment hit a milestone, with solar attracting more capital than oil and gas exploration for the first time.",
    url: "https://bloomberg.com/energy/renewables-record-investment",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    content: "Global clean energy investment reached $1 trillion, driven by falling solar costs and government subsidy programs, marking a structural shift away from fossil fuels."
  },
  {
    source: { id: "fox-news", name: "Fox News" },
    author: "Shannon Bream",
    title: "Energy industry warns green transition threatens grid reliability and jobs",
    description: "Oil and gas companies argue that the rapid push toward renewable energy is outpacing grid infrastructure and risks blackouts.",
    url: "https://foxnews.com/energy/green-grid-risks",
    urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    content: "The American Petroleum Institute released a report warning that premature retirement of gas power plants could leave the US grid vulnerable to capacity shortfalls during peak demand."
  },

  // ── Thread 4: Tech layoffs and AI labor impact ─────────────────────────
  {
    source: { id: "ft", name: "Financial Times" },
    author: "Hannah Murphy",
    title: "Tech sector cuts 50,000 jobs in first quarter as AI reshapes workforce",
    description: "Major technology companies have eliminated tens of thousands of positions as AI automates software engineering and data analysis roles.",
    url: "https://ft.com/tech/layoffs-ai-workforce",
    urlToImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    publishedAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    content: "Meta, Microsoft, and Google each announced significant headcount reductions tied to AI-driven productivity gains and the ability of coding assistants to handle work requiring entire engineering teams."
  },
  {
    source: { id: "cnn-tech", name: "CNN" },
    author: "Matt Egan",
    title: "Former tech workers struggle to find roles as AI closes entry-level doors",
    description: "Thousands of recently laid-off software engineers find their skills are now replicated by AI tools they helped build.",
    url: "https://cnn.com/tech/layoffs-entry-level",
    urlToImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    publishedAt: new Date(Date.now() - 5.5 * 3600000).toISOString(),
    content: "A survey of 2,000 laid-off tech workers found 60% had been searching for new positions for more than six months. Job postings now seek fewer, more senior engineers to direct AI tools."
  },
  {
    source: { id: "npr", name: "NPR" },
    author: "Alina Selyukh",
    title: "Labor unions push for AI transition agreements to protect tech workers",
    description: "Workers' rights groups demand companies negotiating AI deployment include severance guarantees, retraining programs, and advance notice.",
    url: "https://npr.org/tech/ai-labor-unions",
    urlToImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    publishedAt: new Date(Date.now() - 11 * 3600000).toISOString(),
    content: "The Communications Workers of America filed a request with the NLRB arguing that AI deployment decisions affecting worker headcount constitute a mandatory subject of collective bargaining."
  },

  // ── Thread 5: Immigration policy ──────────────────────────────────────
  {
    source: { id: "ap", name: "Associated Press" },
    author: "Elliot Spagat",
    title: "Border crossings drop sharply after new immigration enforcement measures",
    description: "US CBP data shows a significant decline in irregular crossings following a package of executive actions targeting asylum processing.",
    url: "https://apnews.com/immigration/border-crossings-drop",
    urlToImage: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800",
    publishedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    content: "Border encounters fell 40% month-over-month — the largest single-month drop in three years — following expanded rapid deportation operations and transit-country agreements."
  },
  {
    source: { id: "msnbc", name: "MSNBC" },
    author: "Jacob Soboroff",
    title: "Asylum seekers say new immigration rules make legal pathway nearly impossible",
    description: "Advocates warn that expedited removal procedures create due process violations and leave migrants with no meaningful way to claim protection.",
    url: "https://msnbc.com/immigration/asylum-access",
    urlToImage: "https://images.unsplash.com/photo-1554265352-d7fd5129be15?w=800",
    publishedAt: new Date(Date.now() - 4.5 * 3600000).toISOString(),
    content: "Immigration attorneys report clients are given credible-fear interviews within hours of crossing, often without counsel, raising concerns that genuine refugees are expelled without a fair hearing."
  },
  {
    source: { id: "wsj-2", name: "The Wall Street Journal" },
    author: "Michelle Hackman",
    title: "Business groups press Congress to expand legal immigration for skilled workers",
    description: "Employer associations say current visa caps are creating critical labor shortages in healthcare, engineering, and agriculture sectors.",
    url: "https://wsj.com/immigration/work-visa-expansion",
    urlToImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    content: "A coalition of 300 companies including major hospital systems and agricultural producers urged expansion of H-2A, H-1B, and EB-2 visa categories, noting backlogs now stretch more than a decade."
  },

  // ── Thread 6: US Election & political landscape ───────────────────────
  {
    source: { id: "politico", name: "Politico" },
    author: "Jonathan Martin",
    title: "Swing-state polling tightens as election enters final stretch",
    description: "New surveys show razor-thin margins in Pennsylvania, Michigan, and Arizona, with both campaigns redoubling ground-game efforts in critical counties.",
    url: "https://politico.com/election/swing-state-polls",
    urlToImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800",
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    content: "Aggregated polling across six major firms puts the leading candidates within 1.5 points in all three must-win states. Turnout modeling suggests the outcome hinges on suburban college-educated voters who split their tickets in 2022."
  },
  {
    source: { id: "fox-politics", name: "Fox News" },
    author: "Bret Baier",
    title: "Republican base energized by economic message heading into election",
    description: "GOP strategists say rising inflation concerns are driving record enthusiasm among working-class voters in Rust Belt states.",
    url: "https://foxnews.com/politics/gop-economic-message",
    urlToImage: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=800",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    content: "Internal Republican polling shows the economy ranking as the top issue for 73% of likely GOP voters, above immigration and crime. Campaign officials are targeting union households in Ohio and Pennsylvania with a cost-of-living message."
  },
  {
    source: { id: "nyt-politics", name: "The New York Times" },
    author: "Reid Epstein",
    title: "Democrats intensify voter registration push in response to early polling",
    description: "The party is deploying field organizers to counties that underperformed in 2022, aiming to bank early votes before election day.",
    url: "https://nytimes.com/politics/dem-voter-registration",
    urlToImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
    publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    content: "Democratic operatives say they have registered 400,000 new voters in key states since January, targeting young voters and Latino communities. Early vote banking could prove decisive if day-of turnout is suppressed by weather or long lines."
  },

  // ── Thread 7: Healthcare & drug pricing ───────────────────────────────
  {
    source: { id: "stat-news", name: "STAT News" },
    author: "Rebecca Robbins",
    title: "Medicare drug price negotiations cut insulin costs by up to 80%",
    description: "The first round of federal drug pricing negotiations has produced landmark reductions on ten widely-used medications, affecting millions of seniors.",
    url: "https://statnews.com/medicare-drug-negotiations",
    urlToImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    content: "HHS announced negotiated prices for ten drugs including insulin, Eliquis, and Jardiance, with reductions averaging 60% off list price. The deals take effect in 2026 and are expected to save Medicare $6 billion annually."
  },
  {
    source: { id: "pharma-times", name: "Reuters" },
    author: "Ahmed Aboulenein",
    title: "Pharmaceutical industry sues to block Medicare drug price negotiation program",
    description: "Drug makers argue the new pricing rules amount to unconstitutional price controls and will devastate R&D investment in future medicines.",
    url: "https://reuters.com/health/pharma-medicare-lawsuit",
    urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    content: "A coalition of eight pharmaceutical companies filed suit in federal court, arguing the Inflation Reduction Act's negotiation provisions violate the First and Fifth Amendments. Industry groups warn reduced profitability will reduce investment in rare disease treatments."
  },
  {
    source: { id: "kff", name: "NPR" },
    author: "Pien Huang",
    title: "Out-of-pocket drug costs still rising despite new negotiation law, patients say",
    description: "Despite legislative action on list prices, patients report insurance formularies and pharmacy benefit managers continue to drive high costs at the counter.",
    url: "https://npr.org/health/drug-costs-patients",
    urlToImage: "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800",
    publishedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    content: "A KFF survey found 32% of adults say they skipped doses or split pills in the past year due to cost, nearly unchanged from the prior year. Experts say savings from negotiated prices will take years to reach patients due to insurance contract lags."
  },

  // ── Thread 8: Housing market & mortgage rates ─────────────────────────
  {
    source: { id: "cnbc-housing", name: "CNBC" },
    author: "Diana Olick",
    title: "Mortgage rates hit 7.5% as housing affordability reaches historic low",
    description: "The average 30-year fixed rate climbed again this week, pushing monthly payments on a median-priced home to more than $2,800 — a record.",
    url: "https://cnbc.com/housing/mortgage-rates-record",
    urlToImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    content: "Freddie Mac's weekly survey showed 30-year fixed mortgage rates at 7.52%, the highest since 2000. First-time buyers are being squeezed out of most major markets as the combination of high rates and elevated home prices makes ownership unattainable for median earners."
  },
  {
    source: { id: "marketwatch-housing", name: "MarketWatch" },
    author: "Aarthi Swaminathan",
    title: "Housing inventory rises but prices stay stubbornly high in most markets",
    description: "More homes are coming onto the market, but sellers are resisting price cuts, extending the stalemate between buyers and sellers.",
    url: "https://marketwatch.com/housing/inventory-prices",
    urlToImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    publishedAt: new Date(Date.now() - 7.5 * 3600000).toISOString(),
    content: "Active listings rose 22% year-over-year but are still 35% below pre-pandemic norms. Sellers who bought before 2020 are reluctant to sell and give up sub-3% mortgages, creating a lock-in effect that constrains supply even as demand softens."
  },
  {
    source: { id: "the-atlantic-housing", name: "The Atlantic" },
    author: "Jerusalem Demsas",
    title: "America's housing crisis is a zoning problem, not just a financing problem",
    description: "Urban economists argue that restrictive land-use regulation is the root cause of the affordability crisis and that lower rates alone won't solve it.",
    url: "https://theatlantic.com/housing/zoning-crisis",
    urlToImage: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800",
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    content: "Research shows that cities with the most permissive zoning — like Minneapolis and Austin — have seen rents fall even as the national trend is upward. Experts argue federal housing aid tied to zoning reform could have a bigger impact than interest rate movements."
  },

  // ── Thread 9: Ukraine-Russia war developments ─────────────────────────
  {
    source: { id: "bbc-ukraine", name: "BBC News" },
    author: "Jeremy Bowen",
    title: "Ukraine launches long-range drone strikes deep inside Russian territory",
    description: "Ukrainian forces targeted fuel depots and military airfields in a coordinated overnight drone offensive, the most ambitious since the war began.",
    url: "https://bbc.com/news/ukraine-drone-strikes",
    urlToImage: "https://images.unsplash.com/photo-1655469436878-2ba7c24cb2ca?w=800",
    publishedAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    content: "Ukrainian military officials confirmed strikes on targets more than 1,000km inside Russia, including an oil refinery in Saratov. Russia's defense ministry acknowledged several drones were intercepted but admitted at least three caused significant damage."
  },
  {
    source: { id: "reuters-ukraine", name: "Reuters" },
    author: "Tom Balmforth",
    title: "Western allies debate lifting restrictions on weapons use inside Russia",
    description: "NATO members are divided over whether to allow Ukraine to use allied weapons to strike military targets on Russian soil without geographic limitations.",
    url: "https://reuters.com/world/ukraine-weapons-restrictions",
    urlToImage: "https://images.unsplash.com/photo-1662026911591-335639b11db6?w=800",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    content: "The debate inside NATO pits the UK and Baltic states, which favor lifting restrictions, against Germany and Hungary, which warn the move risks escalation. US officials are reviewing the policy but have signaled no imminent change."
  },
  {
    source: { id: "al-jazeera-ukraine", name: "Al Jazeera" },
    author: "Neave Barker",
    title: "Civilian casualties mount as Russia intensifies strikes on Ukrainian cities",
    description: "Russian missile and drone attacks on Kyiv, Kharkiv, and Odesa have killed dozens of civilians in the past week, according to Ukrainian officials.",
    url: "https://aljazeera.com/ukraine/civilian-casualties",
    urlToImage: "https://images.unsplash.com/photo-1635016154236-1b15f7d7b6e2?w=800",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    content: "UN human rights monitors report 47 civilian deaths and 130 injuries in the past seven days from Russian aerial attacks. A strike on a Kharkiv apartment block killed 12 people. Russia denied targeting civilian infrastructure."
  },

  // ── Thread 10: Cybersecurity & data breaches ──────────────────────────
  {
    source: { id: "krebs-security", name: "Wired" },
    author: "Andy Greenberg",
    title: "Massive data breach exposes personal records of 100 million Americans",
    description: "A breach at a major healthcare data broker allowed hackers to access Social Security numbers, medical histories, and financial information.",
    url: "https://wired.com/security/healthcare-data-breach",
    urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    content: "Security researchers discovered that a data aggregator operating in 40 states suffered an intrusion lasting nearly six months before detection. The stolen dataset includes names, addresses, SSNs, and insurance records, making it one of the largest healthcare breaches in US history."
  },
  {
    source: { id: "cisa", name: "The Verge" },
    author: "Lauren Feiner",
    title: "CISA orders federal agencies to patch critical infrastructure vulnerabilities within 48 hours",
    description: "The cybersecurity agency issued an emergency directive after evidence emerged that state-sponsored hackers were actively exploiting several zero-day flaws.",
    url: "https://theverge.com/security/cisa-emergency-directive",
    urlToImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    content: "CISA's emergency directive covers flaws in widely-used network management software from four vendors. Attribution points to APT groups linked to China's Ministry of State Security. Agencies that fail to patch face mandatory disconnection from federal networks."
  },
  {
    source: { id: "wapo-cyber", name: "The Washington Post" },
    author: "Joseph Menn",
    title: "Congress pushes for mandatory minimum cybersecurity standards after breach wave",
    description: "Lawmakers on both sides of the aisle say the latest string of attacks shows voluntary industry frameworks aren't working.",
    url: "https://washingtonpost.com/cybersecurity/mandatory-standards",
    urlToImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800",
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    content: "A bipartisan Senate bill would require companies in critical sectors to meet minimum security baselines certified by third-party auditors. Industry groups argue the compliance burden would hit smaller firms hardest and push auditing costs into the hundreds of millions annually."
  }
];

export default FALLBACK_ARTICLES;
