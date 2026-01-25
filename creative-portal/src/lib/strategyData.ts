
export interface AssessmentOption {
  value: string;
  label: string;
  score: number;
}

export interface CopilotGuide {
  script?: string;
  context?: string;
  redFlags?: string[];
  upsellSignals?: string[];
  probes?: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: AssessmentOption[];
  copilotText?: Record<string, string>; // Maps option value to insight text
  consultantGuide?: CopilotGuide;
}

export type AssessmentCategory = 'gtm' | 'brand' | 'campaign' | 'creative';

export interface ServiceTier {
  name: string;
  description: string;
  basePrice: number;
  confidence: number;
}

// Consultant insights from the backup
const consultantInsights: Record<string, Record<string, string>> = {
  'gtm.market_readiness': {
    emerging: "Emerging markets require significant education and category creation. Consider thought leadership content and strategic partnerships.",
    early: "Early markets show promise but need validation. Focus on proof points and early adopter testimonials.",
    developing: "Growing demand indicates market timing. Accelerate with competitive positioning and market share capture.",
    established: "Clear demand exists. Optimize for efficiency and differentiation in established channels.",
    mature: "Saturated markets require innovation or niche positioning. Consider adjacent markets or service evolution."
  },
  'brand.brand_maturity': {
    startup: "No established brand presents both opportunity and challenge. Foundation work is critical for long-term success.",
    early: "Basic brand elements exist but lack cohesion. Strategic brand development will accelerate market recognition.",
    developing: "Some consistency exists but gaps remain. Brand optimization can significantly improve market position.",
    established: "Strong brand presence provides competitive advantage. Focus on evolution and market expansion.",
    mature: "Well-known brand status enables premium positioning. Consider brand extension opportunities."
  }
};

export const assessmentQuestions: Record<AssessmentCategory, AssessmentQuestion[]> = {
  gtm: [
    {
      id: 'gtm_segmentation',
      question: 'How defined is your target segment for this launch?',
      type: 'single',
      consultantGuide: {
        script: "Let's look at the target. Are we going after 'everyone', or do we have a specific 'Beachhead Segment' that we know we can dominate immediately?",
        context: "Launch failure usually comes from dilution. If they target everyone, they reach no one. We must sell the 'Segmentation Workshop'.",
        redFlags: ["'Our product is for everyone'", "No specific persona defined"],
        probes: ["Who is the 'Early Adopter'?", "Who is explicitly NOT your customer?"]
      },
      options: [
        { value: 'broad_undefined', label: 'Broad / Undefined', score: 0, insight: "HIGH RISK: 'Spray and Pray' approach. We must narrow the focus to a Minimum Viable Segment (MVS) before spending ad dollars." },
        { value: 'demographic', label: 'Demographic only', score: 30, insight: "WEAK TARGETING: Demographics don't predict buying behavior. We need to layer in Psychographics and Intent data." },
        { value: 'beachhead', label: 'Validated Beachhead', score: 70, insight: "STRONG START: They know who to attack first. We can focus budget on high-intent channels." },
        { value: 'icp', label: 'ICP + Account Lists', score: 100, insight: "ABM READY: If B2B, they are ready for Account-Based Marketing. If B2C, they are ready for Lookalike scaling." }
      ]
    },
    {
      id: 'gtm_validation',
      question: 'Have you validated the offer with real customers?',
      type: 'single',
      consultantGuide: {
        script: "Before we scale, do we know people actually want this? Do we have pre-orders, beta users, or just a gut feeling?",
        context: "Marketing cannot fix a product nobody wants. If validation is low, we pitch a 'Smoke Test' campaign (low budget) before the full launch.",
        redFlags: ["'We know they'll love it'", "Zero pre-orders"],
        probes: ["What is your current conversion rate?", "Do you have a waiting list?"]
      },
      options: [
        { value: 'internal', label: 'Internal assumption only', score: 0, insight: "GAMBLING: We are betting the budget on a guess. Recommend a 'Validation Sprint' first." },
        { value: 'qualitative', label: 'Qualitative feedback', score: 40, insight: "ANECDOTAL: Friendly feedback isn't sales. Be conservative with ad spend until we see CPA data." },
        { value: 'pre_orders', label: 'Paid Alpha / Pre-orders', score: 80, insight: "VALIDATED: People are voting with their wallets. We can aggressively scale spend." },
        { value: 'pmf', label: 'Product-Market Fit', score: 100, insight: "SCALE MODE: The fire is burning; we just need to pour gasoline (budget) on it." }
      ]
    },
    {
      id: 'gtm_channel',
      question: 'What is your primary acquisition channel?',
      type: 'single',
      consultantGuide: {
        script: "Where will the first 1,000 customers come from? Are we betting everything on Facebook Ads, or do we have an organic engine building up?",
        context: "Single-channel dependency is dangerous. If they say 'Ads', check their CAC tolerance. If 'Organic', check their content velocity.",
        redFlags: ["'We'll just go viral'", "No budget for paid"],
        probes: ["What is your CAC target?", "Do you have an email list?"]
      },
      options: [
        { value: 'viral', label: 'Undecided / "Viral"', score: 0, insight: "FANTASY LAND: 'Viral' is not a strategy. We need to build a 'Paid + Owned' engine immediately." },
        { value: 'paid_social', label: 'Paid Social Dependent', score: 50, insight: "EXPENSIVE: Fast but fragile. We need to diversify into Email/SMS retention to offset high ad costs." },
        { value: 'seo', label: 'SEO / Organic Lead', score: 70, insight: "SUSTAINABLE: Slower payoff but higher margin. We should layer Retargeting ads on top of this traffic." },
        { value: 'diversified', label: 'Diversified Mix', score: 100, insight: "RESILIENT: They have a healthy ecosystem. We can optimize for LTV rather than just first-click attribution." }
      ]
    },
    {
      id: 'gtm_pricing',
      question: 'How was pricing determined?',
      type: 'single',
      consultantGuide: {
        script: "Is the price based on value, or just 'cost plus margin'? Does the price support the marketing budget we need?",
        context: "Low price points ($10-20) make paid acquisition very hard. We need to check if their Unit Economics support the campaign.",
        redFlags: ["'Cheaper than competitors'", "No margin for ads"],
        probes: ["What is your LTV?", "Can you afford a $50 CPA?"]
      },
      options: [
        { value: 'gut_feeling', label: 'Gut feeling / Low cost', score: 10, insight: "MARGIN SQUEEZE: Risk of losing money on every sale. We might need a 'Pricing Strategy' review." },
        { value: 'parity', label: 'Competitor parity', score: 50, insight: "COMMODITY PRICING: Hard to differentiate. We need to sell on 'Brand Value' to justify the price." },
        { value: 'value_based', label: 'Value-based / Premium', score: 80, insight: "HEALTHY MARGINS: Supports aggressive marketing. We can out-spend competitors to acquire customers." },
        { value: 'dynamic', label: 'Dynamic / Tiered', score: 100, insight: "SOPHISTICATED: Allows for upselling and LTV expansion. Great for 'Land and Expand' strategies." }
      ]
    },
    {
      id: 'gtm_readiness',
      question: 'Is the sales/support team ready for volume?',
      type: 'single',
      consultantGuide: {
        script: "If we turn on the faucet today and get 500 leads, does the bucket leak? Who answers the tickets? Who closes the deals?",
        context: "Marketing success can kill a company if Ops aren't ready. We must verify 'Operational Readiness' before launch.",
        redFlags: ["'We'll figure it out'", "Solo founder doing support"],
        probes: ["Do you have a CRM?", "What is your SLA for new leads?"]
      },
      options: [
        { value: 'not_ready', label: 'Not ready', score: 0, insight: "OPERATIONAL BOTTLENECK: Do not launch. Fix the pipes before turning on the water." },
        { value: 'manual', label: 'Manual processes', score: 40, insight: "LEAKY BUCKET: Leads will slip through cracks. We need to implement 'Marketing Automation' (CRM/Email)." },
        { value: 'basic_crm', label: 'Basic CRM / Automation', score: 80, insight: "READY: Core systems are in place. We can scale confidently." },
        { value: 'revops', label: 'Full RevOps Stack', score: 100, insight: "SCALE MACHINE: Sales and Marketing are aligned. We can implement advanced 'Lead Scoring' models." }
      ]
    }
  ],
  brand: [
    // QUESTION 1: POSITIONING
    {
      id: 'brand_positioning',
      question: 'How clearly defined is your brand positioning?',
      type: 'single',
      consultantGuide: {
        script: "The 'Elevator Pitch' test: If I asked five different employees what this company stands for, would I get the same answer, or five different versions?",
        context: "Internal misalignment is the root cause of weak marketing. If the team isn't aligned, the market won't be either. We must sell the 'Alignment Workshop' first.",
        redFlags: ["'We try to be everything to everyone'", "Long, jargon-filled mission statements"],
        probes: ["What is the one thing you want to be famous for?", "Who is your enemy?"]
      },
      options: [
        { label: 'Undefined / Vague', value: 'undefined', score: 0, insight: "IDENTITY CRISIS: Do not start tactical work. Mandatory Upsell: 'Core Values & Positioning Workshop' ($8k)." },
        { label: 'Loose Internal Consensus', value: 'loose_consensus', score: 30, insight: "CONSISTENCY RISK: Positioning exists but isn't codified. We need to create a 'Brand Manifesto' to lock it in." },
        { label: 'Documented but Ignored', value: 'ignored', score: 60, insight: "EXECUTION GAP: They have the strategy but aren't living it. Focus on 'Brand Activation' and internal culture." },
        { label: 'Crystal Clear & Operationalized', value: 'clear', score: 100, insight: "MARKET LEADER: Strong foundation. We can move immediately to 'Authority Building' and high-level thought leadership." }
      ]
    },

    // QUESTION 2: AUDIENCE
    {
      id: 'brand_audience',
      question: 'How deep is your understanding of your target audience?',
      type: 'single',
      consultantGuide: {
        script: "Who are we fighting for? Are we targeting broad demographics like 'Women 25-45', or do we have psychographic profiles that tell us what keeps them up at night?",
        context: "If they don't know who they are talking to, media spend is wasted. We cannot build a brand without a target. 'Persona Development' is non-negotiable here.",
        redFlags: ["'Everyone is our customer'", "Relies solely on assumptions, no data"],
        probes: ["Show me your customer avatar.", "What is their biggest fear?"]
      },
      options: [
        { label: 'Broad Demographics Only', value: 'broad', score: 10, insight: "GUESSWORK RISK: We are shooting in the dark. Must include 'Audience Research & Segmentation' phase." },
        { label: 'Basic Personas', value: 'basic', score: 50, insight: "BASELINE: Good enough for general awareness, but needs refinement for high-conversion performance marketing." },
        { label: 'Deep Psychographics', value: 'psychographics', score: 80, insight: "HIGH POTENTIAL: They know the customer's pain. We can write very sharp, emotionally resonant copy immediately." },
        { label: 'Validated Community / Tribe', value: 'community', score: 100, insight: "CULT BRAND: Rare. Focus strategy on 'Community Mobilization' and UGC rather than traditional ads." }
      ]
    },

    // QUESTION 3: VOICE & MESSAGING
    {
      id: 'brand_voice',
      question: 'Do you have a defined Tone of Voice?',
      type: 'single',
      consultantGuide: {
        script: "Does the brand sound like a human being, or a corporation? Does the voice change depending on who is writing the social post that day?",
        context: "Inconsistent voice dilutes trust. If they lack guidelines, every piece of content we produce will get stuck in 'Subjective Review' hell.",
        redFlags: ["'We want to sound professional but fun' (Generic)", "Content sounds like different people wrote it"],
        probes: ["If your brand walked into a bar, what would it drink?", "Do you have a 'Words We Don't Use' list?"]
      },
      options: [
        { label: 'No defined voice', value: 'none', score: 0, insight: "SCHIZOPHRENIC BRAND: Copy is inconsistent. Sell 'Verbal Identity Guide' ($5k) before writing any web copy." },
        { label: 'Loose guidelines', value: 'loose', score: 40, insight: "RISK OF BLANDNESS: They likely sound like everyone else. We need to sharpen the 'Brand Personality' to cut through noise." },
        { label: 'Distinct, documented voice', value: 'distinct', score: 80, insight: "STRONG ASSET: We can scale content production quickly using their existing style guide." },
        { label: 'Ownable, recognizeable character', value: 'character', score: 100, insight: "CATEGORY KING: The voice itself is a differentiator (e.g., Wendy's, Liquid Death). Protect this at all costs." }
      ]
    },

    // QUESTION 4: VISUAL SYSTEM
    {
      id: 'brand_visuals',
      question: 'How consistent is your visual identity across touchpoints?',
      type: 'single',
      consultantGuide: {
        script: "The 'Thumb Test': If I covered your logo on your website and your Instagram, would I still know it's you? Or does it look like two different companies?",
        context: "Visual fragmentation creates cognitive load. Customers won't remember them. We pitch 'Visual Unification' not just 'Redesign'.",
        redFlags: ["Using different fonts on different decks", "Website looks 5 years older than social"],
        probes: ["Do you use a master slide deck?", "Are social templates locked?"]
      },
      options: [
        { label: 'Inconsistent / Messy', value: 'inconsistent', score: 10, insight: "BRAND EROSION: Every impression is wasted if they don't recognize the brand next time. Urgent 'Visual System Update' needed." },
        { label: 'Consistent Logo/Colors only', value: 'basic', score: 50, insight: "AVERAGE: It looks clean but generic. We need to develop a 'Secondary Visual Language' (patterns, photography style)." },
        { label: 'Comprehensive Design System', value: 'comprehensive', score: 80, insight: "SCALE READY: We can move fast. Ensure our creative team gets access to their Figma libraries immediately." },
        { label: 'Iconic / Ownable Aesthetic', value: 'iconic', score: 100, insight: "DESIGN LED: The aesthetic is a competitive moat. Focus on keeping it fresh without breaking the rules." }
      ]
    },

    // QUESTION 5: DIFFERENTIATION
    {
      id: 'brand_differentiation',
      question: 'Can you articulate your competitive advantage?',
      type: 'single',
      consultantGuide: {
        script: "Why do you win? Is it price, speed, quality, or innovation? If you say 'we do all of them', that's a red flag. What is the one thing you do better than anyone else?",
        context: "If they can't answer this, they are a commodity. Commodities compete on price (race to the bottom). Brands compete on value. We must find their 'Moat'.",
        redFlags: ["'We offer better service'", "'We are a one-stop-shop'", "Can't name a competitor"],
        probes: ["Why do you lose deals?", "What does your competitor say about you?"]
      },
      options: [
        { label: 'Unclear / Commodity', value: 'commodity', score: 0, insight: "COMMODITY TRAP: They are fighting a price war. We must pivot the strategy to find a 'Blue Ocean' or niche." },
        { label: 'Better Service / Features', value: 'service', score: 40, insight: "WEAK MOAT: Features can be copied. We need to elevate the brand story to emotional benefits." },
        { label: 'Unique Methodology / IP', value: 'methodology', score: 80, insight: "STRONG POSITION: They own a way of doing things. We should package this IP (e.g., name their process) in marketing." },
        { label: 'Radical Differentiation', value: 'disruptor', score: 100, insight: "DISRUPTOR: They are changing the category rules. The strategy is 'Challenger Brand'—aggressive and loud." }
      ]
    }
  ],
  campaign: [
    {
      id: 'campaign_objective',
      question: 'What is the primary objective of this campaign?',
      type: 'single',
      consultantGuide: {
        script: "Are we trying to make noise (Brand Awareness) or make money (Direct Response)? We can't optimize for both efficiently at the same time.",
        context: "Unclear objectives lead to failed expectations. If they say 'Both', we must split the budget into separate 'Brand' and 'Performance' buckets.",
        redFlags: ["'We want viral sales'", "Unrealistic ROAS targets on cold traffic"],
        probes: ["What is the primary KPI?", "Is this top or bottom of funnel?"]
      },
      options: [
        { value: 'unclear', label: 'Unclear / "Everything"', score: 0, insight: "STRATEGIC FOG: High risk of failure. We must enforce the 'One Goal per Campaign' rule." },
        { value: 'awareness', label: 'Pure Awareness', score: 40, insight: "LONG TERM: Good for brand equity, but set expectations that ROI won't be immediate." },
        { value: 'lead_gen', label: 'Lead Gen / Sales', score: 80, insight: "PERFORMANCE FOCUSED: We can measure this daily. Focus on CPA and Conversion Rate." },
        { value: 'retention', label: 'Customer Retention / LTV', score: 100, insight: "HIGH VALUE: Targeting existing customers is the most profitable campaign type." }
      ]
    },
    {
      id: 'campaign_integration',
      question: 'How integrated is the campaign across channels?',
      type: 'single',
      consultantGuide: {
        script: "Does the email match the ad? Does the landing page match the email? Or are these 'Random Acts of Marketing' running in silos?",
        context: "Disjointed campaigns confuse users and tank conversion. We pitch 'Omnichannel Orchestration' to align the message.",
        redFlags: ["Social team doesn't talk to Email team", "Different offers on different channels"],
        probes: ["Do you have a campaign calendar?", "Is the visual ID consistent?"]
      },
      options: [
        { value: 'siloed', label: 'Siloed / Disconnected', score: 10, insight: "FRAGMENTED: User experience is broken. Immediate 'Channel Integration' audit required." },
        { value: 'visual', label: 'Visual Consistency only', score: 40, insight: "SURFACE LEVEL: It looks the same, but the user journey might still be disjointed." },
        { value: 'sequencing', label: 'Cross-channel sequencing', score: 80, insight: "ORCHESTRATED: They are retelling the story across touchpoints. This drives high conversion." },
        { value: 'omnichannel', label: 'Full Omnichannel Journey', score: 100, insight: "ECOSYSTEM: User is surrounded by the narrative. Ideal for high-ticket complex sales." }
      ]
    },
    {
      id: 'campaign_journey',
      question: 'Do you have specific creative for each stage of the funnel?',
      type: 'single',
      consultantGuide: {
        script: "Are we showing the same 'Buy Now' ad to cold traffic and warm leads? Or do we have a sequence: Educate -> Engage -> Convert?",
        context: "Asking for marriage on the first date (Sales ads to cold traffic) is expensive. We need a 'Full Funnel Content Strategy'.",
        redFlags: ["One ad for everyone", "No retargeting strategy"],
        probes: ["What is your retargeting hook?", "Do you use exclusions?"]
      },
      options: [
        { value: 'one_message', label: 'One message for all', score: 0, insight: "INEFFICIENT: Wasting budget on cold traffic. We need to build a 'Top of Funnel' content layer." },
        { value: 'retargeting', label: 'Basic Retargeting', score: 50, insight: "STANDARD: Better, but likely repetitive. Frequency fatigue is a risk." },
        { value: 'segmented', label: 'Segmented Funnel', score: 80, insight: "OPTIMIZED: Right message, right time. We can scale spend efficiently here." },
        { value: 'dynamic', label: 'Dynamic Personalization', score: 100, insight: "ADVANCED: Using data to tailor the narrative. Highest conversion potential." }
      ]
    },
    {
      id: 'campaign_attribution',
      question: 'How will we track the results?',
      type: 'single',
      consultantGuide: {
        script: "When a sale happens, will we know came from? Are we relying on Facebook's reported numbers, or do we have a source of truth?",
        context: "Platform data (FB/Google) lies. They over-claim credit. We need to establish a 'Single Source of Truth' (GA4, TripleWhale, etc.).",
        redFlags: ["'We just look at total sales'", "Blind trust in platform ROAS"],
        probes: ["Is GA4 set up correctly?", "Do you use UTM parameters?"]
      },
      options: [
        { value: 'no_tracking', label: 'No tracking plan', score: 0, insight: "BLIND FLYING: We cannot optimize what we cannot measure. Setup 'Tracking Infrastructure' immediately." },
        { value: 'platform', label: 'Platform Native only', score: 40, insight: "INFLATED DATA: Platforms will double-count sales. We need an independent verification tool." },
        { value: 'ga4', label: 'Google Analytics / UTMs', score: 80, insight: "RELIABLE: Standard best practice. We can trust these numbers." },
        { value: 'multi_touch', label: 'Multi-touch Attribution', score: 100, insight: "GRANULAR: Allows for complex budget optimization across the entire ecosystem." }
      ]
    },
    {
      id: 'campaign_budget',
      question: 'Is the budget allocated based on testing or fixed assumption?',
      type: 'single',
      consultantGuide: {
        script: "Is the budget set in stone, or is it fluid based on performance? If an ad is winning, can we double the spend tomorrow?",
        context: "Fixed budgets kill agility. We want 'Uncapped Budget at Efficiency'. If the machine prints money, don't turn it off.",
        redFlags: ["'Use it or lose it' budget", "Annual fixed allocation"],
        probes: ["What is the approval process to increase spend?", "Do you have a testing slush fund?"]
      },
      options: [
        { value: 'fixed', label: 'Fixed / Rigid', score: 20, insight: "HANDCUFFED: We can't react to market feedback. Try to negotiate a 20% 'Flex Fund'." },
        { value: 'buffers', label: 'Fixed with buffers', score: 50, insight: "STANDARD: Workable, but limits upside scaling." },
        { value: 'fluid', label: 'Fluid / Performance based', score: 90, insight: "AGILE: We can chase performance. This is how you scale 10x." },
        { value: 'uncapped', label: 'Uncapped (ROAS constraint)', score: 100, insight: "SCALING MODE: The holy grail. If we hit the ROAS target, we spend infinity. Ideal client." }
      ]
    }
  ],
  creative: [
    {
      id: 'creative_audit',
      question: 'What is the state of your existing creative assets?',
      type: 'single',
      consultantGuide: {
        script: "Let's start with what you have. Do you have a centralized library of approved assets, or are we hunting for logos on hard drives?",
        context: "Asset fragmentation is the #1 killer of velocity. Missing library = Mandatory 'Audit' upsell ($5k).",
        redFlags: ["'I think our designer has them'", "Using screenshots of logos"],
        probes: ["Do you have a Brand Guidelines PDF?", "Is there a DAM system?"]
      },
      options: [
        { value: 'scattered', label: 'Scattered / Non-existent', score: 0, insight: "CRITICAL RISK: We cannot start campaign work. Immediate Upsell: 'Asset Consolidation Sprint' ($5k)." },
        { value: 'basic', label: 'Basic logo files only', score: 25, insight: "FOUNDATIONAL GAP: Lacking typography/color standards means every asset takes 3x longer to design. Recommendation: Sell 'Visual Identity Polish'." },
        { value: 'outdated', label: 'Centralized but outdated', score: 50, insight: "EFFICIENCY DRAG: Assets exist but may damage brand perception. Recommendation: Include a 'Brand Refresh' phase." },
        { value: 'guidelines', label: 'Brand Guidelines & Asset Library', score: 75, insight: "GREEN LIGHT: Foundation is solid. We can move straight to high-volume production." },
        { value: 'system', label: 'Full Design System / DAM', score: 100, insight: "ADVANCED MATURITY: Client is ready for complex dynamic creative optimization (DCO) at scale." }
      ]
    },
    {
      id: 'creative_velocity',
      question: 'How often does your team ship new creative?',
      type: 'single',
      consultantGuide: {
        script: "Are you running a few big 'hero' campaigns a year, or an always-on engine that ships fresh creative every week?",
        context: "Low velocity = Retainer Model. High velocity = Dedicated Studio Team. High ambition + low budget = Scope Risk.",
        redFlags: ["High ambition, low resources", "Bottlenecked by one person"],
        probes: ["How long does it take to approve a post?", "Who is the bottleneck?"]
      },
      options: [
        { value: 'adhoc', label: 'Ad-hoc / Rarely', score: 0, insight: "LOW MOMENTUM: Client lacks a testing culture. We must sell the value of 'Iterative Testing' before promising results." },
        { value: 'quarterly', label: 'Quarterly Campaigns', score: 30, insight: "TRADITIONAL MODEL: Risk of ad fatigue. We need to transition them to a monthly 'Flight' model to keep performance up." },
        { value: 'monthly', label: 'Monthly Updates', score: 60, insight: "HEALTHY BASELINE: Good cadence. We can optimize this workflow for better performance without restructuring their team." },
        { value: 'always_on', label: 'Weekly / Always-on Testing', score: 100, insight: "PERFORMANCE READY: Ideal state. This client is ready for a 'Creative Performance Retainer' with high volume." }
      ]
    },
    {
      id: 'creative_approval',
      question: 'Who provides final approval on creative work?',
      type: 'single',
      consultantGuide: {
        script: "Walk me through the approval process. Does it go to a marketing lead, or does the CEO/Founder need to sign off on every pixel?",
        context: "Founder involvement = Delays. Set strict 'Review Rounds' in contract. Identify the 'Tie-Breaker' decision maker.",
        redFlags: ["'Everyone weighs in'", "CEO changes colors personally"],
        probes: ["Has a campaign ever died in approval?", "Do you trust your marketing lead?"]
      },
      options: [
        { value: 'committee', label: 'Committee / Consensus', score: 20, insight: "SCOPE HAZARD: 'Design by Committee' kills ROI. We must enforce a 'Single Point of Contact' clause in the SOW." },
        { value: 'founder', label: 'CEO / Founder', score: 40, insight: "BOTTLENECK RISK: Expect delays. We need to pre-schedule approval meetings to force decisions." },
        { value: 'director', label: 'Marketing Director', score: 80, insight: "STANDARD PROCESS: Manageable. Ensure we align on the creative brief to avoid subjective feedback later." },
        { value: 'autonomy', label: 'Creative Director / Autonomy', score: 100, insight: "IDEAL PARTNER: We can move fast. Focus the pitch on 'Agility' and 'Speed to Market'." }
      ]
    },
    {
      id: 'creative_production',
      question: 'How is creative currently produced?',
      type: 'single',
      consultantGuide: {
        script: "Who is actually making the files? Do you have an in-house team, freelancers, or are we inheriting this from another agency?",
        context: "In-house teams often resent consultants. Frame us as 'Force Multipliers' not replacements. Freelancers mean no process exists.",
        redFlags: ["'My nephew does it'", "Burned out in-house designer"],
        probes: ["What is your current cost per asset?", "Are source files organized?"]
      },
      options: [
        { value: 'diy', label: 'No resources / DIY', score: 0, insight: "FULL SERVICE NEEDED: We must price for full execution capability. Do not offer 'Strategy Only'—they can't execute it." },
        { value: 'freelancers', label: 'Freelancer Network', score: 40, insight: "STABILITY RISK: Freelancers are inconsistent. Position our studio as the 'Reliable, Scalable' alternative." },
        { value: 'in_house', label: 'In-House Team', score: 60, insight: "PARTNERSHIP PLAY: Do not threaten the internal team. Position as 'overflow support' or 'specialized strike team'." },
        { value: 'agency', label: 'External Agency', score: 80, insight: "DISPLACEMENT PLAY: Find out where the current agency is failing (Speed? Cost? Quality?) and attack that gap." }
      ]
    },
    {
      id: 'creative_performance',
      question: 'How do you measure creative success?',
      type: 'single',
      consultantGuide: {
        script: "At the end of the month, how do you know if the creative worked? Are we looking at vanity metrics like 'Likes', or hard revenue data?",
        context: "If they don't measure revenue, we can't prove ROI. We must install a 'Creative Reporting Dashboard' as part of the onboarding.",
        redFlags: ["'We just want it to look cool'", "No access to ad account data"],
        probes: ["Do you tag your creatives?", "What is your CPA target?"]
      },
      options: [
        { value: 'subjective', label: 'Subjective ("Does it look good?")', score: 10, insight: "EDUCATION GAP: Client needs to be taught 'Performance Creative'. Sell the 'Data-Driven Design' methodology." },
        { value: 'vanity', label: 'Vanity Metrics (Likes/Shares)', score: 40, insight: "MISALIGNED KPI: Move the conversation to business impact. Shift focus to CTR and Engagement Rate." },
        { value: 'conversion', label: 'Conversion / CPA', score: 80, insight: "MATURE BUYER: Speak their language. Focus on 'Iterative Testing' and 'ROAS optimization'." },
        { value: 'attribution', label: 'Full Attribution / LTV', score: 100, insight: "UNICORN CLIENT: Rare. Focus on high-level strategy and 'Incrementality Testing'. They will pay for premium insights." }
      ]
    }
  ]
};

// Enrich questions with copilot text
(Object.keys(assessmentQuestions) as AssessmentCategory[]).forEach(category => {
  assessmentQuestions[category].forEach(question => {
    const insightKey = `${category}.${question.id}`;
    if (consultantInsights[insightKey]) {
      question.copilotText = consultantInsights[insightKey];
    }
  });
});

export const determineServiceTier = (intelligenceScore: number): ServiceTier => {
  if (intelligenceScore >= 16) {
    return {
      name: 'Strategic Campaigns',
      description: 'Comprehensive campaign strategy with advanced analytics',
      basePrice: 75000,
      confidence: 95
    };
  } else if (intelligenceScore >= 12) {
    return {
      name: 'Brand Intelligence',
      description: 'Brand strategy and positioning optimization',
      basePrice: 45000,
      confidence: 85
    };
  } else if (intelligenceScore >= 8) {
    return {
      name: 'GTM Sprint',
      description: 'Go-to-market strategy and execution',
      basePrice: 25000,
      confidence: 75
    };
  } else {
    return {
      name: 'Creative Strategy',
      description: 'Creative direction and brand foundation',
      basePrice: 15000,
      confidence: 65
    };
  }
};

export const gtmQuestions = [
  {
    id: 'market_readiness',
    text: "How would you characterize the product's market readiness?",
    options: [
      { label: "MVP / Beta", score: 10, value: "beta", insight: "Focus on early adopter feedback loops." },
      { label: "Market Proven", score: 20, value: "proven", insight: "Scale acquisition channels immediately." },
      { label: "Legacy / Pivot", score: 15, value: "pivot", insight: "Re-frame value prop to avoid churn." }
    ],
    copilot: {
      ask: "Is the product completely new to the market, or are we relaunching an existing solution?",
      context: "Launch velocity depends entirely on product maturity.",
      redFlags: ["Scaling spend before product-market fit is confirmed."],
      upsell: "GTM Sprint"
    }
  },
  {
    id: 'audience_clarity',
    text: "How clearly defined is the Ideal Customer Profile (ICP)?",
    options: [
      { label: "Broad / Generic", score: 5, value: "broad", insight: "High risk of wasted ad spend." },
      { label: "Segmented", score: 15, value: "segmented", insight: "Good foundation, push for personalization." },
      { label: "Hyper-Targeted", score: 25, value: "targeted", insight: "Ready for ABM (Account Based Marketing)." }
    ],
    copilot: {
      ask: "Do we know exactly who buys this, or are we guessing?",
      context: "Specificity sells. Generalism kills.",
      redFlags: ["'Everyone is our customer' mindset."],
      upsell: "Audience Segmentation Workshop"
    }
  },
  {
    id: 'comp_advantage',
    text: "What is the primary competitive moat?",
    options: [
      { label: "Price / Speed", score: 10, value: "commodity", insight: "Vulnerable to 'race to the bottom'." },
      { label: "Brand / Trust", score: 20, value: "brand", insight: "Defensible, leverage social proof." },
      { label: "Proprietary Tech", score: 25, value: "tech", insight: "High barrier to entry. Emphasize IP." }
    ],
    copilot: {
      ask: "Why do customers choose us over the cheaper alternative?",
      context: "We need to identify the 'Unfair Advantage'.",
      redFlags: ["Competing solely on price."],
      upsell: "Brand Positioning"
    }
  },
  {
    id: 'sales_motion',
    text: "What is the primary sales motion?",
    options: [
      { label: "Product-Led (PLG)", score: 20, value: "plg", insight: "Focus on UX and onboarding friction." },
      { label: "Sales-Led (Outbound)", score: 15, value: "outbound", insight: "Requires strong collateral and scripts." },
      { label: "Partner / Channel", score: 15, value: "channel", insight: "Incentive structures are key." }
    ],
    copilot: {
      ask: "Does the product sell itself, or does it need a human to explain it?",
      context: "The funnel shape changes completely based on this answer.",
      redFlags: ["Using Enterprise sales tactics for a $10/mo product."],
      upsell: "Funnel Optimization"
    }
  },
  {
    id: 'launch_budget',
    text: "What is the committed launch budget runway?",
    options: [
      { label: "< 3 Months", score: 5, value: "short", insight: "Guerilla tactics required. High urgency." },
      { label: "3-6 Months", score: 15, value: "medium", insight: "Standard validation window." },
      { label: "6+ Months", score: 25, value: "long", insight: "Allows for brand building investment." }
    ],
    copilot: {
      ask: "How long can we sustain this push before we need ROI?",
      context: "Timeline dictates aggression level.",
      redFlags: ["High burn rate with short runway."],
      upsell: "Growth Partnership"
    }
  }
];
