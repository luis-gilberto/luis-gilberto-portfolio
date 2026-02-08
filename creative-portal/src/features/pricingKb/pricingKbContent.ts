export interface PricingTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  breakdown: string;
  quotingGuidance: string;
}

export interface ObjectionScript {
  id: string;
  objection: string;
  response: string;
  technique: string;
}

export interface ReadyScript {
  id: string;
  scenario: string;
  script: string;
  purpose: string;
}

export interface MarketComparison {
  category: string;
  traditional: string;
  strategyIq: string;
}

export interface MethodologyJustification {
  id: string;
  title: string;
  category: string;
  pain: string;
  antidote: string;
}

export interface RoiLogicBriefing {
  id: string;
  title: string;
  content: string;
  consultantScript?: string;
}

export interface PriceJustificationRationale {
  id: string;
  title: string;
  content: string;
  talkingPoint: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'quick-start',
    name: 'Quick-Start Sprint',
    price: '$4k:$8k',
    duration: '2:4 weeks',
    description: 'Positioning audit, lightweight customer inputs, GTM roadmap you can run tomorrow.',
    features: [
      'Strategic audit',
      'Campaign roadmap',
      'Messaging framework',
      '2:4 weeks duration'
    ],
    breakdown: 'Week 1: Stakeholder interviews and asset audit. Week 2: Strategic mapping and roadmap delivery.',
    quotingGuidance: 'Position this for early-stage startups or specific campaign launches where speed is the primary value driver.'
  },
  {
    id: 'fractional',
    name: 'Strategic Planning',
    price: '$10k:$20k',
    duration: 'Full cycle',
    description: 'Comprehensive GTM strategy, brand intelligence, and full-funnel campaign orchestration.',
    features: [
      'Full GTM strategy',
      'Brand intelligence',
      'Campaign orchestration',
      'Content architecture'
    ],
    breakdown: 'Month 1: Diagnostic and positioning. Month 2: Campaign architecture and content development. Month 3: Soft-signal testing and optimization.',
    quotingGuidance: 'Ideal for Series A+ companies looking to professionalize their marketing function and scale through a proven system.'
  },
  {
    id: 'launch',
    name: 'Intelligence Engine',
    price: 'Custom',
    duration: 'Strategic partnership',
    description: 'Long-term strategic alliance with real-time optimization, fractional leadership, and equity options.',
    features: [
      'Fractional CMO leadership',
      'Equity + Cash hybrid model',
      'Intelligence dashboard access',
      'Unlimited advisory'
    ],
    breakdown: 'Continuous strategic monitoring, quarterly roadmap resets, and direct involvement in high-stakes board decisions.',
    quotingGuidance: 'Reserved for high-growth founders who need a long-term strategic ally, not just a service provider.'
  }
];

export const objectionScripts: ObjectionScript[] = [
  {
    id: 'price',
    objection: 'That\'s more expensive than I expected.',
    response: 'I get it. Let\'s talk about what you expected and why there\'s a gap. What were you thinking budget-wise? We have options: reduce scope, phase the project, or pass for now while you implement the brief yourself.',
    technique: 'Price Reframing'
  },
  {
    id: 'think',
    objection: 'I need to think about it.',
    response: 'Of course: this is a real investment. What specifically do you need to think through? Budget, scope, timing, something else? I\'ll send you a resource that addresses that concern specifically.',
    technique: 'The Specificity Probe'
  },
  {
    id: 'discount',
    objection: 'Can you do this for less?',
    response: 'I don\'t discount because that devalues the work. But here\'s what I can do: reduce the scope to fit your budget or set up a payment plan. Which would work better for you?',
    technique: 'Value Integrity'
  },
  {
    id: 'sales-pitch',
    objection: 'Is this going to be a sales pitch?',
    response: 'Not at all. This is a diagnostic. You\'ll see exactly how I arrive at my recommendation. If it makes sense for you, great. If not, you still leave with actionable insights.',
    technique: 'Transparency Reset'
  },
  {
    id: 'unknown',
    objection: 'What if I don\'t know the answer to something?',
    response: 'That\'s valuable information too. Not knowing is a data point: it tells me exactly where you need support.',
    technique: 'The Data Point Flip'
  }
];

export const readyScripts: ReadyScript[] = [
  {
    id: 'creative-assets',
    scenario: 'Checking creative foundation',
    script: 'Let\'s talk about your creative assets. When your team needs to create something: a social post, a presentation, a one-pager: do they have a playbook to follow, or is everyone winging it?',
    purpose: 'Identify asset fragmentation'
  },
  {
    id: 'brand-consistency',
    scenario: 'Probing brand standards',
    script: 'Okay, so you have basic assets. When was the last time someone on your team created something without asking "Is this on-brand?" or "Does this look right?"',
    purpose: 'Reveal efficiency drag'
  },
  {
    id: 'data-action',
    scenario: 'Spotting measurement gaps',
    script: 'Interesting: so you\'re collecting the data, you\'re just not actioning it. That\'s a common gap I see. We\'ll talk about how to fix that when we review your results.',
    purpose: 'Plant seed for analytics upsell'
  },
  {
    id: 'benchmark',
    scenario: 'Contextualizing scores',
    script: 'I work with many clients in your industry. Your score puts you in the bottom third. Companies at the top are doing X. That\'s the gap we\'re going to close.',
    purpose: 'The Benchmark Reveal'
  }
];

export const marketComparison: MarketComparison[] = [
  {
    category: 'Methodology',
    traditional: 'Winging it or guessing',
    strategyIq: 'Systematic and data-driven'
  },
  {
    category: 'Transparency',
    traditional: 'Opaque processes',
    strategyIq: 'Totally transparent scoring'
  },
  {
    category: 'Outcome',
    traditional: 'Generic advice',
    strategyIq: 'Diagnosed specific roadmap'
  },
  {
    category: 'Confidence',
    traditional: 'Based on gut feel',
    strategyIq: 'Based on Strategic Intelligence'
  }
];

export const methodologyJustification: MethodologyJustification[] = [
  {
    id: 'seniority-trap',
    title: 'The Seniority Trap',
    category: 'Methodology',
    pain: 'Traditional agencies rely on specific senior individuals: if they leave or are busy, quality drops. Clients pay for a person, not a process.',
    antidote: 'StrategyIQ: system-dependency. The intelligence is in the methodology, not just the operator. Consistent, scalable, and elite results regardless of bandwidth.'
  },
  {
    id: 'black-box',
    title: 'The Black Box Effect',
    category: 'Transparency',
    pain: 'Traditional decks lack visible logic. Strategies are presented as "the truth" with no audit trail of how decisions were reached.',
    antidote: 'Transparent scoring. Every strategic pillar is scored and justified. Clients see the raw intelligence behind every recommendation.'
  },
  {
    id: 'template-mill',
    title: 'The Template Mill',
    category: 'Outcome',
    pain: 'One-size-fits-all tactics disguised as strategy. Agencies push the same "standard package" to every client regardless of actual need.',
    antidote: 'Diagnostic-first roadmaps. We don\'t sell services: we fix gaps revealed by the assessment. Every roadmap is unique to the score.'
  },
  {
    id: 'confidence-gap',
    title: 'The Confidence Gap',
    category: 'Confidence',
    pain: 'The anxiety of subjective "gut feel." Marketing feels like a gamble because there is no objective measure of strategic maturity.',
    antidote: 'Strategic Intelligence. Security through objectivity. We replace guesswork with a calculated Strategic Intelligence Score (SIS).'
  }
];

export const roiLogicBriefing: RoiLogicBriefing[] = [
  {
    id: 'leverage-multiplier',
    title: 'The High:Leverage Multiplier',
    content: 'StrategyIQ is a Force Multiplier. A $15k investment to optimize a $100k budget is common, but optimizing a $1M budget with the same $15k creates a 10x higher yield. We focus on the leverage points where small strategic shifts create massive revenue deltas.',
    consultantScript: 'When you optimize the strategy first, every dollar you spend afterward works harder. You aren\'t just buying a project: you are buying a multiplier for your entire marketing budget.'
  },
  {
    id: 'conservative-benchmarking',
    title: 'Conservative Benchmarking',
    content: 'We target 10:20% improvements because they are defensible. It is easier to defend a 10% lift in a system than a 100% "miracle" promise. Small, systematic gains across multiple pillars (GTM, Brand, Campaign) compound into significant net profit.',
    consultantScript: 'I\'d rather promise a 10% lift that we can prove through data than a 50% jump that feels like a gamble. These numbers are conservative by design.'
  },
  {
    id: 'cost-of-inaction',
    title: 'The Cost of Inaction (COI)',
    content: 'The inverse math: if we don\'t fix the Leaky Bucket (GTM or Campaign gaps), the client continues to lose X amount of dollars every month. Delaying strategy is not a "savings," it is a recurring monthly loss of potential revenue.',
    consultantScript: 'The question isn\'t just "what does this cost?" but "what is it costing you every month to keep the current gaps open?"'
  },
  {
    id: 'payback-period',
    title: 'The Payback Period',
    content: 'Move the conversation from "Total Cost" to "Months to Break Even." By calculating the net profit delta, we can often show a payback period of less than 90 days, making the project self-funding.',
    consultantScript: 'If this project pays for itself in the first 3 months through increased efficiency, the remaining 9 months of the year are pure profit.'
  }
];

export const priceJustificationRationale: PriceJustificationRationale[] = [
  {
    id: 'gps-analogy',
    title: 'The "GPS" Analogy',
    content: 'A Framework is just a high:fidelity GPS. Most agencies are "wandering in the woods" trying to find the path. We already have the map because we\'ve walked it for 15 years.',
    talkingPoint: 'We don\'t guess where your customers are; we use a diagnostic system to prove where they are.'
  },
  {
    id: 'microsoft-proof',
    title: 'The Microsoft Proof',
    content: 'This isn\'t theory. This is the same logic used to launch products at Microsoft that reached 50 million people. We are bringing "Global Enterprise Rigor" to your specific project.',
    talkingPoint: 'You are getting the same strategic rigor used by the world\'s largest software company, tailored for your scale.'
  },
  {
    id: 'four-pillar-system',
    title: 'The 4:Pillar System',
    content: 'Our 4 assessment areas (GTM, Brand, Campaign, Creative) are the "Four Vital Organs" of a business. If one fails, the whole body (the business) suffers. Our framework ensures all four are healthy.',
    talkingPoint: 'We look at your business as a whole system: if your Brand is strong but your GTM is weak, you still lose.'
  },
  {
    id: 'shortcut-value',
    title: 'The "Shortcut" Value',
    content: 'You aren\'t paying for my time; you are paying for the 15 years it took me to learn how to do in 1 week what takes others 3 months. You are buying a Shortcut to Clarity.',
    talkingPoint: 'We aren\'t billing for hours; we are billing for the months of trial and error we are helping you skip.'
  }
];

export const kbSearchIndex = [
  ...pricingTiers.map(t => ({ title: t.name, key: 'service-tiers', content: t.description })),
  ...objectionScripts.map(o => ({ title: o.objection, key: 'sales-intelligence', content: o.response })),
  ...readyScripts.map(s => ({ title: s.scenario, key: 'sales-intelligence', content: s.script })),
  ...marketComparison.map(c => ({ title: c.category, key: 'strategic-rationale', content: `${c.traditional} vs ${c.strategyIq}` })),
  ...methodologyJustification.map(j => ({ title: j.title, key: 'strategic-rationale', content: `${j.pain} vs ${j.antidote}` })),
  ...roiLogicBriefing.map(r => ({ title: r.title, key: 'roi', content: `${r.content} ${r.consultantScript || ''}` })),
  ...priceJustificationRationale.map(p => ({ title: p.title, key: 'strategic-rationale', content: `${p.content} ${p.talkingPoint}` }))
];
