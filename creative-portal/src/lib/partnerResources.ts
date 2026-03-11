export interface PartnerResource {
  id: string;
  title: string;
  subtext: string;
  content: {
    overview: string;
    keyTakeaways: string[];
    actionItems: string[];
    quote?: string;
  };
}

export const partnerResources: PartnerResource[] = [
  {
    id: "deciphering-strategy-iq",
    title: "Deciphering StrategyIQ",
    subtext: "How to read your results and turn them into market action.",
    content: {
      overview: "The StrategyIQ score is not a traditional grade; it is a 'Friction Diagnostic.' It measures the alignment between your current business intent and market readiness. While our AI Narrative captures the 'Business Soul' of your inputs, the Luis Gilberto Consultant Review adds the necessary 'Market Reality': layering in the volatility, risks, and specific opportunities that algorithms alone cannot see.",
      keyTakeaways: [
        "High scores indicate efficiency and readiness; low scores highlight strategic friction.",
        "The AI synthesis is your baseline intelligence, not the final word.",
        "Use the diagnostic to identify which business vectors require immediate intervention."
      ],
      actionItems: [
        "Review your 'Intelligence Score' as a measure of execution risk.",
        "Compare AI insights against your internal quarterly goals.",
        "Prepare questions for the human-led verification phase."
      ],
      quote: "AI unlocks the door. The soul must walk through it."
    }
  },
  {
    id: "the-24-hour-review",
    title: "The 24-Hour Review",
    subtext: "What our strategists are looking for during the human-led verification phase.",
    content: {
      overview: "This is the 'Human Handoff.' Every AI-generated finding is vetted by Luis Gilberto senior strategists. We don't just verify data; we stress-test it against current real-world market volatility. Our goal is to ensure that every strategic recommendation is 'execution-ready': meaning it is technically feasible, financially sound, and strategically sound for your specific industry vertical.",
      keyTakeaways: [
        "We filter out algorithmic hallucinations and generic advice.",
        "Your brief is tailored to current market conditions (updated every 24 hours).",
        "The result is a certified 'Mini-Brief' ready for immediate team distribution."
      ],
      actionItems: [
        "Expect a status update in your War Room within one business day.",
        "Review the 'Consultant Analysis' layer once the session moves to PUBLISHED.",
        "Schedule a follow-up if specific market risks are identified."
      ],
      quote: "Data is the raw material; judgment is the final product."
    }
  },
  {
    id: "communication-protocol",
    title: "Communication Protocol",
    subtext: "How to get the most out of our messaging thread and project timeline.",
    content: {
      overview: "We operate on a 'War Room' philosophy. This means async-first messaging for maximum speed and minimal friction. We prioritize clarity over ceremony. The 'Vault' serves as the single source of truth for all deliverables, while the 'Pulse' timeline tracks every strategic pivot in real-time. We move fast, we pivot weekly, and we document everything.",
      keyTakeaways: [
        "Async-first messaging ensures decisions aren't trapped in meetings.",
        "The Vault is your permanent repository for certified assets.",
        "Weekly pivots allow us to adapt to market shifts without losing momentum."
      ],
      actionItems: [
        "Check the 'Comm Link' daily for tactical updates.",
        "Download certified briefs directly from 'The Vault.'",
        "Log strategic requests in the chat to ensure they are captured in the Pulse."
      ],
      quote: "Clarity is the ultimate competitive advantage."
    }
  },
  {
    id: "next-steps-roadmap",
    title: "Next Steps Roadmap",
    subtext: "A high-level overview of the transition from Strategy to Execution.",
    content: {
      overview: "Your journey through the LG Ecosystem is a structured evolution. It begins with the StrategyIQ Intake, which populates your Strategy Mini-Briefs. These briefs then coalesce into a Master Strategic Plan: a comprehensive roadmap for your entire business ecosystem. From there, we move into Execution Sprints, where strategy becomes tangible assets, campaigns, and market growth.",
      keyTakeaways: [
        "Strategy is iterative: Intake leads to Briefs, which lead to the Master Plan.",
        "Mini-Briefs are specialized diagnostics for GTM, Brand, Campaign, and Creative.",
        "Execution Sprints are high-intensity bursts of production and deployment."
      ],
      actionItems: [
        "Complete all 4 StrategyIQ dimensions to unlock the Master Plan.",
        "Review the 'Next Steps' card on each Mini-Brief.",
        "Prepare for the transition from 'Discovery' to 'Active' engagement."
      ],
      quote: "Vision without execution is just a hallucination."
    }
  }
];
