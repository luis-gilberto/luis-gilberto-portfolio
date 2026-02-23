export interface ArtifactTemplate {
  id: string;
  title: string;
  type: 'GTM' | 'BRAND' | 'CAMPAIGN' | 'CREATIVE';
  requiredIntelligence: string[];
  clarificationQuestions: string[];
  unitCost: number;
}

export const artifactLibrary: ArtifactTemplate[] = [
  {
    id: 'gtm-operating-model',
    title: 'GTM Operating Model',
    type: 'GTM',
    requiredIntelligence: ['Market segments', 'Sales cycle data', 'Channel performance'],
    clarificationQuestions: [
      'What is the current customer acquisition cost (CAC) baseline?',
      'Which sales channel has the highest conversion rate currently?'
    ],
    unitCost: 4500
  },
  {
    id: 'messaging-architecture',
    title: 'Messaging Architecture',
    type: 'BRAND',
    requiredIntelligence: ['Customer personas', 'Competitive positioning', 'Value propositions'],
    clarificationQuestions: [
      'What is the single biggest misconception customers have about your brand?',
      'Who is the primary decision-maker in the purchasing process?'
    ],
    unitCost: 3500
  },
  {
    id: 'campaign-blueprint',
    title: 'Campaign Blueprint',
    type: 'CAMPAIGN',
    requiredIntelligence: ['Budget allocation', 'Target KPIs', 'Creative assets inventory'],
    clarificationQuestions: [
      'What is the primary objective of the next 90 days? (Awareness vs Conversion)',
      'What are the key seasonal triggers for your audience?'
    ],
    unitCost: 2500
  },
  {
    id: 'visual-identity-system',
    title: 'Visual Identity System',
    type: 'CREATIVE',
    requiredIntelligence: ['Brand values', 'Visual references', 'Existing brand assets'],
    clarificationQuestions: [
      'Are there any specific "forbidden" colors or styles?',
      'How would you describe the brand personality in three adjectives?'
    ],
    unitCost: 5500
  },
  {
    id: 'motion-7-identity-quickstart',
    title: 'Motion 7: Identity Quickstart',
    type: 'BRAND',
    requiredIntelligence: ['GTM Validation', 'Brand Narrative'],
    clarificationQuestions: [
      'What is the single most important message for the next 48 hours?',
      'Who is the primary audience for this immediate narrative?'
    ],
    unitCost: 1500
  }
];
