'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import KnowledgeBaseModal from '@/components/ui/knowledge-base-modal';
import { ConsultantCopilot } from '@/components/strategy/consultant-copilot';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Icon = ({ name, color }: { name: string, color: string }) => (
  <i className={`fas fa-${name} mr-2`} style={{ color: `var(--${color})` }} />
);

const serviceTiers = {
    'quick-start': { name: 'Quick-Start Sprint', price: '$2K-$5K', duration: '2-4 weeks', description: 'Rapid diagnostic and tactical playbook to establish foundational systems.', complexity: 1 },
    'strategic-planning': { name: 'Strategic Planning', price: '$8K-$15K', duration: '6-10 weeks', description: 'Comprehensive roadmap, strategic frameworks, multi-phase plans.', complexity: 2 },
    'strategic-intelligence': { name: 'Strategic Intelligence', price: '$15K-$25K', duration: '3-6 months', description: 'Embedded partnerships, end-to-end strategy + execution, transformation.', complexity: 3 },
    'creative-campaign': { name: 'Creative Campaign', price: '$8K-$18K', duration: '6-12 weeks', description: 'Integrated campaign strategy, creative development, and optimization.', complexity: 2 },
    'integrated-program': { name: 'Integrated Program', price: '$15K-$35K', duration: '3-6 months', description: 'End-to-end campaign execution and long-term embedded partnership.', complexity: 4 }
};

const assessmentQuestions = {
    gtm: [
        {
            id: 'market_readiness',
            question: 'How ready is your market entry strategy?',
            type: 'single',
            consultantContext: {
                script: "Let's look at your GTM readiness. Are we talking pure concept right now, or is the plane on the runway waiting for clearance?",
                listeningCues: ["Red Flag: 'We build it and they will come'", "Green Flag: 'We have beta users'"],
                insight: "This reveals their strategic maturity and readiness for systematic GTM approach."
            },
            options: [
                { value: 'concept', label: 'Still in concept phase', score: 2 },
                { value: 'research', label: 'Market research underway', score: 3 },
                { value: 'planning', label: 'Planning phase, need execution', score: 4 },
                { value: 'launch_ready', label: 'Ready to launch, need optimization', score: 5 }
            ]
        },
        {
            id: 'competitive_position',
            question: 'How do you differentiate from competitors?',
            type: 'single',
            consultantContext: {
                script: "When a customer asks 'Why you vs the other guys?', do you have a killer answer, or does it get a bit fuzzy?",
                listeningCues: ["Red Flag: 'We have no competitors'", "Green Flag: 'We own this specific niche'"],
                insight: "Understanding their differentiation clarity helps scope positioning work needed."
            },
            options: [
                { value: 'unclear', label: 'Differentiation unclear', score: 3 },
                { value: 'feature_based', label: 'Feature-based differences', score: 2 },
                { value: 'value_based', label: 'Clear value proposition', score: 4 },
                { value: 'strategic', label: 'Strategic positioning advantage', score: 5 }
            ]
        },
        {
            id: 'target_clarity',
            question: 'How well-defined is your target market?',
            type: 'single',
            consultantContext: {
                script: "Who exactly is this for? Do we have specific personas defined, or are we casting a wide net?",
                listeningCues: ["Red Flag: 'Everyone is our customer'", "Green Flag: 'Our ICP is X'"],
                insight: "Audience definition directly impacts campaign complexity and resource allocation."
            },
            options: [
                { value: 'broad', label: 'Broad market approach', score: 1 },
                { value: 'segments', label: 'General market segments', score: 2 },
                { value: 'personas', label: 'Defined buyer personas', score: 3 },
                { value: 'validated', label: 'Validated target segments', score: 4 }
            ]
        },
        {
            id: 'launch_timeline',
            question: "What is your preferred launch timeline?",
            type: 'single',
            consultantContext: {
                script: "Realistically, when do we need to be live? Is this a fire drill or a strategic rollout?",
                listeningCues: ["Red Flag: 'Yesterday'", "Upsell: 'We have budget to speed this up'"],
                insight: "Timeline urgency affects engagement model and resource intensity."
            },
            options: [
                { value: 'urgent', label: 'Urgent - within 6 weeks', score: 3 },
                { value: 'standard', label: 'Standard - 2-3 months', score: 4 },
                { value: 'strategic', label: 'Strategic - 4-6 months', score: 2 },
                { value: 'flexible', label: 'Flexible timeline', score: 1 }
            ]
        }
    ],
    brand: [
        {
            id: 'brand_maturity',
            question: "What is your current brand development stage?",
            type: 'single',
            consultantContext: {
                script: "Where does the brand sit today? Are we building from scratch, or polishing something that's already working?",
                listeningCues: ["Red Flag: 'We just have a logo'", "Green Flag: 'We need to evolve'"],
                insight: "Brand stage determines foundation work vs. refinement approach needed."
            },
            options: [
                { value: 'startup', label: 'Early-stage brand development', score: 2 },
                { value: 'established', label: 'Established but needs refinement', score: 4 },
                { value: 'mature', label: 'Mature brand, need repositioning', score: 5 },
                { value: 'refresh', label: 'Brand refresh required', score: 3 }
            ]
        },
        {
            id: 'brand_challenges',
            question: "What is your primary brand challenge?",
            type: 'single',
            consultantContext: {
                script: "If you could wave a wand and fix one thing about how people perceive you, what would it be?",
                listeningCues: ["Red Flag: 'People don't know who we are'", "Green Flag: 'We want to go upmarket'"],
                insight: "Primary challenge focus helps prioritize strategic intervention points."
            },
            options: [
                { value: 'awareness', label: 'Low brand awareness', score: 3 },
                { value: 'differentiation', label: 'Lack of differentiation', score: 4 },
                { value: 'consistency', label: 'Inconsistent messaging', score: 2 },
                { value: 'perception', label: 'Negative brand perception', score: 5 }
            ]
        },
        {
            id: 'audience_understanding',
            question: 'How well do you understand your audience?',
            type: 'single',
            consultantContext: {
                script: "How much data do we have on the customer? Is it mostly gut feel, or do we have research?",
                listeningCues: ["Red Flag: 'We assume they like X'", "Green Flag: 'Our data shows...'"],
                insight: "Audience insights depth affects research vs. application approach."
            },
            options: [
                { value: 'assumptions', label: 'Based on assumptions', score: 1 },
                { value: 'basic_data', label: 'Basic demographic data', score: 2 },
                { value: 'research', label: 'Market research insights', score: 3 },
                { value: 'deep_insights', label: 'Deep behavioral insights', score: 4 }
            ]
        }
    ],
    campaign: [
        {
            id: 'campaign_objective',
            question: "What is your primary campaign objective?",
            type: 'single',
            consultantContext: {
                script: "At the end of this campaign, what does success look like? Leads? Sales? Or just getting the name out there?",
                listeningCues: ["Red Flag: 'We want everything'", "Green Flag: 'Revenue is the metric'"],
                insight: "Campaign focus determines strategy complexity and success metrics framework."
            },
            options: [
                { value: 'awareness', label: 'Brand awareness and reach', score: 3 },
                { value: 'leads', label: 'Lead generation', score: 4 },
                { value: 'sales', label: 'Direct sales conversion', score: 5 },
                { value: 'engagement', label: 'Audience engagement', score: 2 }
            ]
        },
        {
            id: 'campaign_budget',
            question: "What is your campaign budget range?",
            type: 'single',
            consultantContext: {
                script: "What kind of fuel are we putting in the tank? What's the realistic media spend range?",
                listeningCues: ["Red Flag: 'Zero budget, organic only'", "Green Flag: 'We have $10k/mo allocated'"],
                insight: "Budget level indicates scale possibilities and resource allocation approach."
            },
            options: [
                { value: 'under_50k', label: 'Under $50k', score: 2 },
                { value: '50k_100k', label: '$50k - $100k', score: 3 },
                { value: '100k_250k', label: '$100k - $250k', score: 4 },
                { value: 'over_250k', label: 'Over $250k', score: 5 }
            ]
        }
    ],
    creative: [
        {
            id: 'creative_maturity',
            question: "What is your current creative capability?",
            type: 'single',
            consultantContext: {
                script: "Do you have an in-house design team, or is it pretty ad-hoc right now?",
                listeningCues: ["Red Flag: 'My nephew uses Canva'", "Green Flag: 'We have a creative director'"],
                insight: "Creative capability assessment determines build vs. optimize approach needed."
            },
            options: [
                { value: 'none', label: 'No formal creative process', score: 3 },
                { value: 'basic', label: 'Basic creative assets', score: 2 },
                { value: 'structured', label: 'Structured creative approach', score: 4 },
                { value: 'advanced', label: 'Advanced creative operations', score: 1 }
            ]
        },
        {
            id: 'content_volume',
            question: "What are your content production needs?",
            type: 'single',
            consultantContext: {
                script: "Are we talking a few posts a week, or do you need a full-blown content factory?",
                listeningCues: ["Red Flag: 'We need 10 videos a day with no budget'", "Green Flag: 'Regular cadence'"],
                insight: "Production needs indicate scale and systematic approach requirements."
            },
            options: [
                { value: 'occasional', label: 'Occasional content needs', score: 1 },
                { value: 'regular', label: 'Regular content production', score: 2 },
                { value: 'high_volume', label: 'High-volume production', score: 3 },
                { value: 'enterprise', label: 'Enterprise-level needs', score: 4 }
            ]
        }
    ]
};

const initialClientContext = {
  projectType: 'Brand Repositioning', budgetRange: '$25K - $50K', timeline: '3-6 months', companySize: '50-200 employees'
};

const mapScoreToTier = (score: number, type: string) => {
    if (type === 'creative' || type === 'campaign') {
        return score > 15 ? 'integrated-program' : 'creative-campaign';
    } else {
        return score > 15 ? 'strategic-intelligence' : 'strategic-planning';
    }
};

export default function StrategyIQDashboard() {
    const { data: session } = useSession();
    const consultantId = (session?.user as any)?.id || '';
    const [clientContext, setClientContext] = useState(initialClientContext);
    const [assessmentState, setAssessmentState] = useState({ 
      type: '', 
      index: 0, 
      active: false, 
      answers: {} as Record<string, { value: string, score: number }>, 
      score: 0,
      sessionId: ''
    });
    const [clientDropdownData, setClientDropdownData] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clientDisplayName, setClientDisplayName] = useState('Client Assessment');
    const [kbOpen, setKbOpen] = useState(false);

    const currentRecommendation = mapScoreToTier(assessmentState.score, assessmentState.type);
    const recommendedTier = serviceTiers[currentRecommendation as keyof typeof serviceTiers];

    useEffect(() => {
        if (session?.user?.email) {
            fetchClientDropdownData();
        }
    }, [session]);

    const fetchClientDropdownData = async () => {
        try {
            const res = await fetch('/api/admin/clients');
            if (!res.ok) throw new Error('Failed to fetch clients');
            const clients = await res.json();
            setClientDropdownData(clients);
        } catch (e) {
            console.error('Error loading client list:', e);
        }
    };

    const loadClientContext = async (clientId: string) => {
        try {
            const client = clientDropdownData.find(c => c.id === clientId);
            
            if (!client) throw new Error('Client context not found.');
            
            const loadedData = {
                projectType: client.projectType || 'Brand/GTM (Auto)',
                budgetRange: client.budgetRange || 'N/A',
                timeline: client.timeline || 'N/A',
                companySize: client.companySize || 'N/A',
            };
            setClientContext(loadedData);
            setClientDisplayName(`${client.name} - ${client.company || 'Private'}`);
        } catch (e: any) {
            console.error(`Error loading ScopeIQ data: ${e.message}`);
            setClientContext(initialClientContext); 
        }
    };

    const startAssessment = async (type: string) => {
        if (!selectedClientId) {
            alert('Please select a client from the dropdown before starting the assessment.');
            return;
        }

        try {
            const res = await fetch('/api/assessment/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_id: selectedClientId, consultant_id: consultantId, assessment_type: type })
            });
            const payload = await res.json();
            if (!res.ok || !payload?.id) throw new Error(payload?.error || 'Failed to start session');

            setAssessmentState({
                type,
                index: 0,
                active: true,
                answers: {},
                score: 0,
                sessionId: payload.id,
            });
        } catch (e: any) {
            alert(`Could not start assessment. Error: ${e.message}`);
            console.error(e);
        }
    };

    const handleOptionSelect = (qId: string, value: string, score: number) => {
      setAssessmentState(prev => {
        let currentScore = prev.score;
        const oldAnswer = prev.answers[qId];
        if (oldAnswer) currentScore -= oldAnswer.score;
        currentScore += score;
        return { 
          ...prev, 
          answers: { ...prev.answers, [qId]: { value, score } },
          score: currentScore
        };
      });
    };

    const nextQuestion = async () => {
      const questions = assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions];
      const currentQId = questions[assessmentState.index].id;
      if (!assessmentState.answers[currentQId]) {
        alert('Please select an option before proceeding.');
        return;
      }
      try {
        await fetch('/api/assessment/session/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: assessmentState.sessionId,
            responses: assessmentState.answers,
            intelligence_score: assessmentState.score,
            current_question: assessmentState.index + 1
          })
        });
      } catch (e) {
        console.error('Save failed:', e);
      }
      if (assessmentState.index < questions.length - 1) {
        setAssessmentState(prev => ({ ...prev, index: prev.index + 1 }));
      } else {
        setAssessmentState(prev => ({ ...prev, active: false }));
      }
    };

    const resetAssessment = () => {
        if (window.confirm('Reset current assessment? This will clear all progress.')) {
            setAssessmentState({ type: '', index: 0, active: false, answers: {}, score: 0, sessionId: '' });
        }
    };

    const renderAssessment = () => {
      const q = assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.[assessmentState.index];
      if (!q) return <div className="text-[var(--coral)]">Assessment Complete.</div>;
      return (
        <div className="space-y-4">
          <h3 className="font-big-shoulders text-3xl font-bold mb-2">{q.question}</h3>
          <p className="text-[var(--text-secondary)] mb-6">{q.insight}</p>
          {q.options.map((opt, i) => {
            const selected = assessmentState.answers[q.id]?.value === opt.label;
            return (
              <button
                key={i}
                aria-pressed={selected}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selected ? 'border-2 border-[var(--coral)] bg-[var(--bg-alt)]' : 'border-[var(--border-strong)] bg-[var(--bg-alt)] hover:border-[var(--coral)]'}`}
                onClick={() => handleOptionSelect(q.id, opt.label, opt.score)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-[var(--text-primary)]">{opt.label}</span>
                  {selected && (
                    <span className="inline-flex items-center text-[var(--coral)]">
                      <i className="fas fa-check mr-1" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      );
    };

    const formatPriceStart = (price: string) => {
      const rangeStart = price.replace('$', '').split('-')[0].trim();
      const match = rangeStart.match(/^(\d+)([a-zA-Z]+)?$/);
      if (match) {
        const [, num, suf] = match;
        return `$${num}${suf || ''}`;
      }
      return `$${rangeStart}`;
    };

    // Strategic assessment areas for UI with icons
    const assessmentAreas = [
        { key: 'gtm', name: 'Go-to-Market Sprint', description: 'Market entry strategy, positioning, and launch roadmap.', duration: '6-12 weeks', icon: 'rocket', color: 'coral' },
        { key: 'brand', name: 'Brand Intelligence', description: 'Positioning, messaging, and systematic brand development.', duration: '8-16 weeks', icon: 'bullhorn', color: 'teal' },
        { key: 'campaign', name: 'Strategic Campaigns', description: 'Integrated campaign strategy and optimization.', duration: '12-20 weeks', icon: 'chart-bar', color: 'coral' },
        { key: 'creative', name: 'Creative Strategy', description: 'Content frameworks and scalable creative systems.', duration: '4-12 weeks', icon: 'palette', color: 'teal' },
    ]

    const totalQuestions = (assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length || 0);
    const currentQuestionNumber = Math.min(assessmentState.index + 1, totalQuestions);
    const progressValue = totalQuestions ? Math.round(((currentQuestionNumber - 1) / totalQuestions) * 100) : 0;
    const canProceed = (() => {
      const questions = assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions];
      if (!questions || !questions[assessmentState.index]) return false;
      const qId = questions[assessmentState.index].id;
      return Boolean(assessmentState.answers[qId]);
    })();

    return (
        <div className="bg-[var(--bg-primary)] min-h-screen pt-12">
            <header className="bg-[var(--bg-alt)] border-b border-[var(--border-strong)] text-[var(--text-primary)] py-8 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-6">
                            <h1 className="font-big-shoulders text-3xl font-bold mb-2">
                                Strategy<span className="text-[var(--coral)]">IQ</span> Engine
                            </h1>
                            <div>
                                <p className="text-lg text-[var(--text-secondary)]">Live Consultation Assessment Framework</p>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Active Session</div>
                                <div className="text-xl font-semibold" aria-live="polite">{clientDisplayName}</div>
                            </div>
                        </div>
                        <Button 
                            className="bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--teal)] hover:text-white transition-all font-bold rounded-full px-4 h-10 shadow-lg hidden md:flex"
                            onClick={() => setKbOpen(true)}
                        >
                            <i className="fas fa-book-open mr-2" />
                            Consultant Playbook
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <section className="mb-8">
                    <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="font-big-shoulders text-xl font-semibold mb-2">Client Context</h2>
                                <p className="text-[var(--text-secondary)] text-sm">Select client to load ScopeIQ data and begin assessment</p>
                            </div>
                            <select 
                                className="p-2 rounded-lg bg-[var(--bg-alt)] border border-[var(--border-strong)] text-[var(--text-primary)] text-sm"
                                onChange={(e) => {
                                    setSelectedClientId(e.target.value);
                                    loadClientContext(e.target.value);
                                }}
                                value={selectedClientId}
                            >
                                <option value="">-- Select Client --</option>
                                {clientDropdownData.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - {client.company}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div id="clientContext" className="grid md:grid-cols-4 gap-4">
                            {Object.entries(clientContext).map(([key, value]) => (
                                <div key={key} className="bg-[var(--bg-alt)] rounded-lg p-3 border border-[var(--border-subtle)]">
                                    <div className="text-xs text-[var(--text-muted)] mb-1 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div className="font-semibold text-[var(--text-primary)] text-sm">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <section id="serviceSelection" className={`${assessmentState.active ? 'hidden' : ''} mb-8`}>
                            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <div className="mb-6">
                                    <h2 className="font-big-shoulders text-2xl font-semibold mb-3">
                                        Strategic <span className="text-[var(--coral)]">Assessment</span> Areas
                                    </h2>
                                    <p className="text-[var(--text-secondary)]">
                                        Select the primary strategic focus area to begin the intelligence assessment with your client.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {assessmentAreas.map(area => (
                                        <div key={area.key} className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--coral)] transition-all duration-300" onClick={() => startAssessment(area.key)}>
                                            <div className="flex items-start">
                                                <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)] shadow-inner">
                                                    <Icon name={area.icon} color={area.color} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-big-shoulders text-lg font-semibold mb-2">{area.name}</h3>
                                                    <p className="text-[var(--text-secondary)] text-sm mb-3">{area.description}</p>
                                                    <div className="text-xs text-[var(--coral)] font-medium">{area.duration}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section id="assessmentFlow" className={`${assessmentState.active ? '' : 'hidden'}`}>
                          <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                              <div className="mb-8">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                      <span className="font-medium text-[var(--text-primary)]">Strategic Assessment Progress</span>
                                      <span className="font-bold text-[var(--coral)]">{progressValue}%</span>
                                  </div>
                                  <Progress value={progressValue} />
                                  <div className="mt-2 text-xs text-[var(--text-secondary)]">Question {currentQuestionNumber} of {totalQuestions}</div>
                              </div>
                              <div id="questionContainer">
                                {renderAssessment()}
                              </div>
                              <div className="flex justify-between mt-8">
                                  <button className="bg-[var(--bg-alt)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--border-strong)] transition-all disabled:opacity-50" onClick={() => setAssessmentState(prev => ({ ...prev, index: Math.max(0, prev.index - 1) }))} disabled={assessmentState.index === 0}>
                                      <i className="fas fa-arrow-left mr-2"></i>Previous
                                  </button>
                                  <button className="bg-[var(--coral)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e55a5a] transition-all disabled:opacity-50" onClick={nextQuestion} disabled={!canProceed}>
                                      {assessmentState.index === assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length - 1 ? 'Complete' : 'Next'} <i className={`fas ${assessmentState.index === assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length - 1 ? 'fa-check' : 'fa-arrow-right'} ml-2`}></i>
                                  </button>
                              </div>
                          </div>
                        </section>
                        <section id="resultsSection" className={`${assessmentState.active === false && assessmentState.index > 0 ? '' : 'hidden'}`}>
                            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <h2 className="font-big-shoulders text-2xl font-semibold mb-3">
                                    Strategic <span className="text-[var(--teal)]">Recommendation</span>
                                </h2>
                                <p className="text-[var(--text-secondary)] mb-6">Intelligence-driven engagement recommendation based on systematic assessment.</p>
                                <div className="bg-[var(--bg-alt)] p-6 rounded-xl">
                                    <p className="text-[var(--text-primary)] font-semibold">Assessment Score: {assessmentState.score}</p>
                                    <p className="text-[var(--text-primary)] font-semibold mt-4">Recommended Tier: {recommendedTier.name}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="lg:col-span-1">
                        {((session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'CONSULTANT') && (
                            <div className="mb-6">
                                <ConsultantCopilot 
                                    assessmentType={assessmentState.type}
                                    currentQuestion={assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.[assessmentState.index]}
                                />
                            </div>
                        )}
                        <div className="live-scoring space-y-6">
                            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--coral)]">
                                    <i className="fas fa-brain mr-2"></i>Intelligence Score
                                </h3>
                                <div className="text-center mb-4">
                                    <div id="intelligenceScore" className="text-4xl font-bold text-[var(--coral)] mb-2">{assessmentState.score}</div>
                                    <div className="text-sm text-[var(--text-secondary)]">Complexity Assessment</div>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--teal)]">
                                    <i className="fas fa-target mr-2"></i>Service Match
                                </h3>
                                <div id="serviceMatch" className="space-y-3">
                                    <div className="text-center font-bold text-lg text-[var(--text-primary)]">
                                        {recommendedTier.name}
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">
                                        {recommendedTier.price} • {recommendedTier.duration}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <h3 className="font-big-shoulders text-lg font-semibold mb-4">
                                    <i className="fas fa-chart-line mr-2"></i>Revenue <span className="text-[var(--teal)]">Projection</span>
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                                        <span className="text-sm">Project Value</span>
                                        <span className="font-bold text-[var(--teal)]">{formatPriceStart(recommendedTier.price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                                        <span className="text-sm">Confidence Level</span>
                                        <span className="font-bold">0%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                                        <span className="text-sm">Close Probability</span>
                                        <span className="font-bold text-[var(--coral)]">0%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                                <h3 className="font-big-shoulders text-lg font-semibold mb-4">
                                    <i className="fas fa-bolt mr-2"></i>Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={resetAssessment}>
                                        <i className="fas fa-redo mr-2"></i>Reset Assessment
                                    </Button>
                                    <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={() => console.log('Save Progress')}>
                                        <i className="fas fa-save mr-2"></i>Save Progress
                                    </Button>
                                    <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={() => console.log('Export Notes')}>
                                        <i className="fas fa-file-export mr-2"></i>Export Notes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <KnowledgeBaseModal open={kbOpen} onClose={() => setKbOpen(false)} />
        </div>
    );
}
