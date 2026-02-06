
export interface AssessmentOption {
  value: string;
  label: string;
  score: number;
  insight?: string;
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
        { value: 'broad_undefined', label: 'Broad / Undefined', score: 0, insight: "Alignment opportunity: 'Broad' approach identified. Narrowing focus to a Minimum Viable Segment (MVS) is recommended." },
        { value: 'demographic', label: 'Demographic only', score: 30, insight: "Targeting gap: Demographics alone don't predict behavior. Consider layering psychographic data." },
        { value: 'beachhead', label: 'Validated Beachhead', score: 70, insight: "Market resonance: Specific segment identified. Ready for focused resource allocation." },
        { value: 'icp', label: 'ICP + Account Lists', score: 100, insight: "B2B readiness: Prepared for Account-Based Marketing or lookalike scaling." }
      ]
    },
    {
      id: 'gtm_validation',
      question: 'Have you validated the offer with real customers?',
      type: 'single',
      consultantGuide: {
        script: "Before we scale, do we know people actually want this? Do we have pre-orders, beta users, or just a gut feeling?",
        context: "Marketing cannot fix a product nobody wants. If validation is low, we suggest a 'Smoke Test' campaign before full launch.",
        redFlags: ["'We know they'll love it'", "Zero pre-orders"],
        probes: ["What is your current conversion rate?", "Do you have a waiting list?"]
      },
      options: [
        { value: 'internal', label: 'Internal assumption only', score: 0, insight: "Validation opportunity: Market assumptions identified. Recommend a validation phase first." },
        { value: 'qualitative', label: 'Qualitative feedback', score: 40, insight: "Data potential: Friendly feedback noted. Recommend CPA validation before scaling." },
        { value: 'pre_orders', label: 'Paid Alpha / Pre-orders', score: 80, insight: "Market traction: Direct validation observed. Ready for confident scaling." },
        { value: 'pmf', label: 'Product-Market Fit', score: 100, insight: "Growth alignment: Clear market fit observed. Ready for increased investment." }
      ]
    },
    {
      id: 'gtm_channel',
      question: 'What is your primary acquisition channel?',
      type: 'single',
      consultantGuide: {
        script: "Where will the first 1,000 customers come from? Are we betting everything on Facebook Ads, or do we have an organic engine building up?",
        context: "Single-channel dependency is noted. If they say 'Ads', check their CAC tolerance. If 'Organic', check their content velocity.",
        redFlags: ["'We'll just go viral'", "No budget for paid"],
        probes: ["What is your CAC target?", "Do you have an email list?"]
      },
      options: [
        { value: 'viral', label: 'Undecided / "Viral"', score: 0, insight: "Strategic gap: 'Viral' focus identified. Recommend building a sustainable engine." },
        { value: 'paid_social', label: 'Paid Social Dependent', score: 50, insight: "Efficiency potential: High channel dependency. Recommend diversifying into retention channels." },
        { value: 'seo', label: 'SEO / Organic Lead', score: 70, insight: "Long-term resonance: Sustainable payoff noted. Recommend layering retargeting for optimization." },
        { value: 'diversified', label: 'Diversified Mix', score: 100, insight: "Systemic strength: Healthy ecosystem observed. Ready for LTV optimization." }
      ]
    },
    {
      id: 'gtm_pricing',
      question: 'How was pricing determined?',
      type: 'single',
      consultantGuide: {
        script: "Is the price based on value, or just 'cost plus margin'? Does the price support the marketing budget we need?",
        context: "Low price points ($10-20) make paid acquisition harder. Check if Unit Economics support the campaign.",
        redFlags: ["'Cheaper than competitors'", "No margin for ads"],
        probes: ["What is your LTV?", "Can you afford a $50 CPA?"]
      },
      options: [
        { value: 'gut_feeling', label: 'Gut feeling / Low cost', score: 10, insight: "Pricing opportunity: Margin constraints identified. Recommend a pricing strategy review." },
        { value: 'parity', label: 'Competitor parity', score: 50, insight: "Value differentiation potential: Commodity positioning noted. Focus on brand value to differentiate." },
        { value: 'value_based', label: 'Value-based / Premium', score: 80, insight: "Margin health: Strong margins support growth. Ready for confident market acquisition." },
        { value: 'dynamic', label: 'Dynamic / Tiered', score: 100, insight: "Strategic maturity: Advanced pricing observed. Ready for LTV expansion." }
      ]
    },
    {
      id: 'gtm_readiness',
      question: 'Is the sales/support team ready for volume?',
      type: 'single',
      consultantGuide: {
        script: "If we turn on the faucet today and get 500 leads, does the bucket leak? Who answers the tickets? Who closes the deals?",
        context: "Marketing success depends on operations. Verify readiness before launch.",
        redFlags: ["'We'll figure it out'", "Solo founder doing support"],
        probes: ["Do you have a CRM?", "What is your SLA for new leads?"]
      },
      options: [
        { value: 'not_ready', label: 'Not ready', score: 0, insight: "Operational gap: Capacity constraints identified. Resolve before increasing volume." },
        { value: 'manual', label: 'Manual processes', score: 40, insight: "Conversion potential: Manual processes identified. Recommend implementing automation." },
        { value: 'basic_crm', label: 'Basic CRM / Automation', score: 80, insight: "Operational readiness: Core systems identified. Ready for scaling." },
        { value: 'revops', label: 'Full RevOps Stack', score: 100, insight: "Scalability potential: Aligned systems observed. Ready for advanced lead scoring." }
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
        context: "Internal alignment is key. If the team isn't aligned, the market won't be either. Alignment work is recommended first.",
        redFlags: ["'We try to be everything to everyone'", "Long, jargon-filled mission statements"],
        probes: ["What is the one thing you want to be famous for?", "Who is your enemy?"]
      },
      options: [
        { label: 'Undefined / Vague', value: 'undefined', score: 0, insight: "Positioning observation: Alignment opportunity identified. Core Values & Positioning alignment is recommended." },
        { label: 'Loose Internal Consensus', value: 'loose_consensus', score: 30, insight: "Brand alignment opportunity: Positioning exists but lacks codification. Recommend a Brand Manifesto." },
        { label: 'Documented but Ignored', value: 'ignored', score: 60, insight: "Activation potential: Strategic gap identified between strategy and execution." },
        { label: 'Crystal Clear & Operationalized', value: 'clear', score: 100, insight: "Market resonance: Strong foundation observed. Ready for authority building." }
      ]
    },

    // QUESTION 2: AUDIENCE
    {
      id: 'brand_audience',
      question: 'How deep is your understanding of your target audience?',
      type: 'single',
      consultantGuide: {
        script: "Who are we fighting for? Are we targeting broad demographics like 'Women 25-45', or do we have psychographic profiles that tell us what keeps them up at night?",
        context: "Specificity is key for media spend efficiency. Audience research is recommended.",
        redFlags: ["'Everyone is our customer'", "Relies solely on assumptions, no data"],
        probes: ["Show me your customer avatar.", "What is their biggest fear?"]
      },
      options: [
        { label: 'Broad Demographics Only', value: 'broad', score: 10, insight: "Research opportunity: Demographic focus identified. Recommend deeper audience research." },
        { label: 'Basic Personas', value: 'basic', score: 50, insight: "Foundational state: Baseline identified. Ready for conversion optimization." },
        { label: 'Deep Psychographics', value: 'psychographics', score: 80, insight: "Resonance potential: Emotional pain points identified. Ready for resonant copy development." },
        { label: 'Validated Community / Tribe', value: 'community', score: 100, insight: "Brand authority: Community focus observed. Ready for mobilization strategies." }
      ]
    },

    // QUESTION 3: VOICE & MESSAGING
    {
      id: 'brand_voice',
      question: 'Do you have a defined Tone of Voice?',
      type: 'single',
      consultantGuide: {
        script: "Does the brand sound like a human being, or a corporation? Does the voice change depending on who is writing the social post that day?",
        context: "Inconsistent voice affects trust. Guidelines are recommended to streamline review.",
        redFlags: ["'We want to sound professional but fun' (Generic)", "Content sounds like different people wrote it"],
        probes: ["If your brand walked into a bar, what would it drink?", "Do you have a 'Words We Don't Use' list?"]
      },
      options: [
        { label: 'No defined voice', value: 'none', score: 0, insight: "Voice alignment opportunity: Inconsistent voice identified. Recommend a Verbal Identity alignment." },
        { label: 'Loose guidelines', value: 'loose', score: 40, insight: "Differentiation potential: Standard voice identified. Recommend sharpening personality." },
        { label: 'Distinct, documented voice', value: 'distinct', score: 80, insight: "Brand strength: Solid asset identified. Ready for scaled production." },
        { label: 'Ownable, recognizeable character', value: 'character', score: 100, insight: "Category authority: Differentiated voice observed. Protecting this asset is key." }
      ]
    },

    // QUESTION 4: VISUAL SYSTEM
    {
      id: 'brand_visuals',
      question: 'How consistent is your visual identity across touchpoints?',
      type: 'single',
      consultantGuide: {
        script: "The 'Thumb Test': If I covered your logo on your website and your Instagram, would I still know it's you? Or does it look like two different companies?",
        context: "Visual fragmentation affects recognition. Visual unification is recommended.",
        redFlags: ["Using different fonts on different decks", "Website looks 5 years older than social"],
        probes: ["Do you use a master slide deck?", "Are social templates locked?"]
      },
      options: [
        { label: 'Inconsistent / Messy', value: 'inconsistent', score: 10, insight: "Visual alignment gap: Fragmented identity identified. Visual system update is recommended." },
        { label: 'Consistent Logo/Colors only', value: 'basic', score: 50, insight: "Standard state: Clean but generic identity. Recommend developing a secondary visual language." },
        { label: 'Comprehensive Design System', value: 'comprehensive', score: 80, insight: "Visual maturity: Solid foundation observed. Ready for rapid scaling." },
        { label: 'Iconic / Ownable Aesthetic', value: 'iconic', score: 100, insight: "Design authority: Competitive aesthetic observed. Ready for continued refinement." }
      ]
    },

    // QUESTION 5: DIFFERENTIATION
    {
      id: 'brand_differentiation',
      question: 'Can you articulate your competitive advantage?',
      type: 'single',
      consultantGuide: {
        script: "Why do you win? Is it price, speed, quality, or innovation? If you say 'we do all of them', that's a red flag. What is the one thing you do better than anyone else?",
        context: "Differentiation is key to value. We focus on finding your 'Moat'.",
        redFlags: ["'We offer better service'", "'We are a one-stop-shop'", "Can't name a competitor"],
        probes: ["Why do you lose deals?", "What does your competitor say about you?"]
      },
      options: [
        { label: 'Unclear / Commodity', value: 'commodity', score: 0, insight: "Differentiation opportunity: Commodity focus identified. Recommend a strategic pivot." },
        { label: 'Better Service / Features', value: 'service', score: 40, insight: "Defensibility gap: Feature-based focus identified. Recommend elevating to emotional benefits." },
        { label: 'Unique Methodology / IP', value: 'methodology', score: 80, insight: "Positioning strength: Proprietary methodology identified. Ready for IP packaging." },
        { label: 'Radical Differentiation', value: 'disruptor', score: 100, insight: "Market disruptor: Category-changing rules identified. Ready for challenger positioning." }
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
        { value: 'unclear', label: 'Unclear / "Everything"', score: 0, insight: "Strategic gap: Alignment opportunity identified. Recommend a single-goal campaign structure." },
        { value: 'awareness', label: 'Pure Awareness', score: 40, insight: "Long-term resonance: Focus on brand equity noted. ROI expectations should be calibrated for the long term." },
        { value: 'lead_gen', label: 'Lead Gen / Sales', score: 80, insight: "Market traction: Performance focus observed. Ready for daily CPA and conversion optimization." },
        { value: 'retention', label: 'Customer Retention / LTV', score: 100, insight: "Systemic strength: High-value retention focus observed. Ideal for profitable growth." }
      ]
    },
    {
      id: 'campaign_integration',
      question: 'How integrated is the campaign across channels?',
      type: 'single',
      consultantGuide: {
        script: "Does the email match the ad? Does the landing page match the email? Or are these 'Random Acts of Marketing' running in silos?",
        context: "Disjointed campaigns affect conversion. Omnichannel alignment is recommended.",
        redFlags: ["Social team doesn't talk to Email team", "Different offers on different channels"],
        probes: ["Do you have a campaign calendar?", "Is the visual ID consistent?"]
      },
      options: [
        { value: 'siloed', label: 'Siloed / Disconnected', score: 10, insight: "Systemic gap: Fragmented user experience identified. Recommend a channel integration audit." },
        { value: 'visual', label: 'Visual Consistency only', score: 40, insight: "Foundational state: Visual alignment noted, but user journey may require deeper integration." },
        { value: 'sequencing', label: 'Cross-channel sequencing', score: 80, insight: "Market resonance: Orchestrated narrative observed. Ready for high-conversion scaling." },
        { value: 'omnichannel', label: 'Full Omnichannel Journey', score: 100, insight: "Design authority: Integrated ecosystem observed. Ideal for complex, high-value journeys." }
      ]
    },
    {
      id: 'campaign_journey',
      question: 'Do you have specific creative for each stage of the funnel?',
      type: 'single',
      consultantGuide: {
        script: "Are we showing the same 'Buy Now' ad to cold traffic and warm leads? Or do we have a sequence: Educate -> Engage -> Convert?",
        context: "Cold traffic sales focus is noted. Full-funnel content alignment is recommended.",
        redFlags: ["One ad for everyone", "No retargeting strategy"],
        probes: ["What is your retargeting hook?", "Do you use exclusions?"]
      },
      options: [
        { value: 'one_message', label: 'One message for all', score: 0, insight: "Differentiation potential: Broad messaging identified. Recommend building a multi-layered content funnel." },
        { value: 'retargeting', label: 'Basic Retargeting', score: 50, insight: "Standard state: Retargeting identified. Recommend diversifying creative to avoid frequency fatigue." },
        { value: 'segmented', label: 'Segmented Funnel', score: 80, insight: "Strategic maturity: Optimized funnel observed. Ready for efficient spend scaling." },
        { value: 'dynamic', label: 'Dynamic Personalization', score: 100, insight: "Market resonance: Advanced personalization observed. Highest conversion potential." }
      ]
    },
    {
      id: 'campaign_attribution',
      question: 'How will we track the results?',
      type: 'single',
      consultantGuide: {
        script: "When a sale happens, will we know came from? Are we relying on Facebook's reported numbers, or do we have a source of truth?",
        context: "Platform data dependency is noted. Establishing an independent source of truth is recommended.",
        redFlags: ["'We just look at total sales'", "Blind trust in platform ROAS"],
        probes: ["Is GA4 set up correctly?", "Do you use UTM parameters?"]
      },
      options: [
        { value: 'no_tracking', label: 'No tracking plan', score: 0, insight: "Operational gap: Tracking constraints identified. Recommend setting up infrastructure immediately." },
        { value: 'platform', label: 'Platform Native only', score: 40, insight: "Data potential: Platform dependency noted. Recommend independent verification tools for accuracy." },
        { value: 'ga4', label: 'Google Analytics / UTMs', score: 80, insight: "Foundational state: Reliable tracking identified. Ready for standard optimization." },
        { value: 'multi_touch', label: 'Multi-touch Attribution', score: 100, insight: "Strategic maturity: Granular attribution observed. Ready for complex budget optimization." }
      ]
    },
    {
      id: 'campaign_budget',
      question: 'Is the budget allocated based on testing or fixed assumption?',
      type: 'single',
      consultantGuide: {
        script: "Is the budget set in stone, or is it fluid based on performance? If an ad is winning, can we double the spend tomorrow?",
        context: "Fixed budgets may affect agility. A flexible allocation model is recommended.",
        redFlags: ["'Use it or lose it' budget", "Annual fixed allocation"],
        probes: ["What is the approval process to increase spend?", "Do you have a testing slush fund?"]
      },
      options: [
        { value: 'fixed', label: 'Fixed / Rigid', score: 20, insight: "Strategic gap: Rigid budget identified. Recommend negotiating a flexible 'test and scale' fund." },
        { value: 'buffers', label: 'Fixed with buffers', score: 50, insight: "Standard state: Workable structure identified, though upside scaling may be constrained." },
        { value: 'fluid', label: 'Fluid / Performance based', score: 90, insight: "Growth alignment: Agile budget observed. Ready for performance-driven scaling." },
        { value: 'uncapped', label: 'Uncapped (ROAS constraint)', score: 100, insight: "Market resonance: Performance-first model observed. Ideal for rapid market capture." }
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
        context: "Asset fragmentation affects velocity. Asset consolidation is recommended.",
        redFlags: ["'I think our designer has them'", "Using screenshots of logos"],
        probes: ["Do you have a Brand Guidelines PDF?", "Is there a DAM system?"]
      },
      options: [
        { value: 'scattered', label: 'Scattered / Non-existent', score: 0, insight: "Systemic gap: Fragmented assets identified. Immediate asset consolidation is recommended." },
        { value: 'basic', label: 'Basic logo files only', score: 25, insight: "Foundational state: Limited standards identified. Recommend a visual identity alignment to improve efficiency." },
        { value: 'outdated', label: 'Centralized but outdated', score: 50, insight: "Differentiation potential: Legacy assets identified. Recommend a refresh to align with market expectations." },
        { value: 'guidelines', label: 'Brand Guidelines & Asset Library', score: 75, insight: "Visual maturity: Solid foundation observed. Ready for high-volume production." },
        { value: 'system', label: 'Full Design System / DAM', score: 100, insight: "Design authority: Advanced maturity observed. Ready for dynamic creative optimization." }
      ]
    },
    {
      id: 'creative_velocity',
      question: 'How often does your team ship new creative?',
      type: 'single',
      consultantGuide: {
        script: "Are you running a few big 'hero' campaigns a year, or an always-on engine that ships fresh creative every week?",
        context: "Velocity dictates the delivery model. Iterative testing is recommended to maintain momentum.",
        redFlags: ["High ambition, low resources", "Bottlenecked by one person"],
        probes: ["How long does it take to approve a post?", "Who is the bottleneck?"]
      },
      options: [
        { value: 'adhoc', label: 'Ad-hoc / Rarely', score: 0, insight: "Alignment opportunity: Low momentum identified. Recommend establishing an iterative testing culture." },
        { value: 'quarterly', label: 'Quarterly Campaigns', score: 30, insight: "Foundational state: Traditional cadence noted. Recommend transitioning to more frequent delivery cycles." },
        { value: 'monthly', label: 'Monthly Updates', score: 60, insight: "Standard state: Healthy cadence observed. Ready for workflow optimization." },
        { value: 'always_on', label: 'Weekly / Always-on Testing', score: 100, insight: "Market resonance: Performance-ready cadence observed. Ideal for high-volume retention models." }
      ]
    },
    {
      id: 'creative_approval',
      question: 'Who provides final approval on creative work?',
      type: 'single',
      consultantGuide: {
        script: "Walk me through the approval process. Does it go to a marketing lead, or does the CEO/Founder need to sign off on every pixel?",
        context: "Complex approvals may cause delays. Streamlining the review process is recommended.",
        redFlags: ["'Everyone weighs in'", "CEO changes colors personally"],
        probes: ["Has a campaign ever died in approval?", "Do you trust your marketing lead?"]
      },
      options: [
        { value: 'committee', label: 'Committee / Consensus', score: 20, insight: "Operational gap: Consensus-based review identified. Recommend a single point of contact for efficiency." },
        { value: 'founder', label: 'CEO / Founder', score: 40, insight: "Strategic maturity: Founder-led review noted. Recommend pre-scheduled review cycles to maintain velocity." },
        { value: 'director', label: 'Marketing Director', score: 80, insight: "Standard state: Professional review process observed. Ready for collaborative scaling." },
        { value: 'autonomy', label: 'Creative Director / Autonomy', score: 100, insight: "Design authority: High autonomy observed. Ideal for rapid market testing." }
      ]
    },
    {
      id: 'creative_production',
      question: 'How is creative currently produced?',
      type: 'single',
      consultantGuide: {
        script: "Who is actually making the files? Do you have an in-house team, freelancers, or are we inheriting this from another agency?",
        context: "Resource model affects delivery. Partnership alignment is recommended.",
        redFlags: ["'My nephew does it'", "Burned out in-house designer"],
        probes: ["What is your current cost per asset?", "Are source files organized?"]
      },
      options: [
        { value: 'diy', label: 'No resources / DIY', score: 0, insight: "Alignment opportunity: Resource constraints identified. Full execution support is recommended." },
        { value: 'freelancers', label: 'Freelancer Network', score: 40, insight: "Differentiation potential: Freelance model noted. Recommend a more centralized, reliable studio approach." },
        { value: 'in_house', label: 'In-House Team', score: 60, insight: "Foundational state: Internal team identified. Recommend specialized support to multiply output." },
        { value: 'agency', label: 'External Agency', score: 80, insight: "Market resonance: External agency model noted. Ready for specialized gap analysis and support." }
      ]
    },
    {
      id: 'creative_performance',
      question: 'How do you measure creative success?',
      type: 'single',
      consultantGuide: {
        script: "At the end of the month, how do you know if the creative worked? Are we looking at vanity metrics like 'Likes', or hard revenue data?",
        context: "Metric alignment is key for ROI. Performance-based reporting is recommended.",
        redFlags: ["'We just want it to look cool'", "No access to ad account data"],
        probes: ["Do you tag your creatives?", "What is your CPA target?"]
      },
      options: [
        { value: 'subjective', label: 'Subjective ("Does it look good?")', score: 10, insight: "Education gap: Subjective focus identified. Recommend a data-driven creative methodology." },
        { value: 'vanity', label: 'Vanity Metrics (Likes/Shares)', score: 40, insight: "Alignment opportunity: Awareness focus noted. Recommend shifting to business impact metrics." },
        { value: 'conversion', label: 'Conversion / CPA', score: 80, insight: "Strategic maturity: Conversion focus observed. Ready for ROAS optimization." },
        { value: 'attribution', label: 'Full Attribution / LTV', score: 100, insight: "Market resonance: Advanced attribution observed. Ready for high-level incrementality testing." }
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
