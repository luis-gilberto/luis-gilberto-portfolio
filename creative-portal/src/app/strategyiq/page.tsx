'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js'

// Service tiers aligned with ScopeIQ
const serviceTiers = {
  'creative': {
    name: 'Creative Strategy',
    price: 15000,
    duration: '4-12 weeks',
    description: 'Content strategy, creative frameworks, and asset development',
    deliverables: ['Creative Brief', 'Content Strategy', 'Asset Templates', 'Brand Guidelines'],
    complexity: 'medium'
  },
  'gtm': {
    name: 'Go-to-Market Sprint',
    price: 25000,
    duration: '6-12 weeks',
    description: 'Market mapping, positioning, and systematic launch approach',
    deliverables: ['Market Analysis', 'Go-to-Market Plan', 'Launch Strategy', 'Performance Framework'],
    complexity: 'high'
  },
  'brand': {
    name: 'Brand Intelligence',
    price: 35000,
    duration: '8-16 weeks',
    description: 'Positioning, messaging, and systematic brand development',
    deliverables: ['Brand Strategy', 'Messaging Framework', 'Brand Architecture', 'Implementation Guide'],
    complexity: 'high'
  },
  'campaign': {
    name: 'Strategic Campaigns',
    price: 45000,
    duration: '12-20 weeks',
    description: 'End-to-end campaign strategy, creative, and optimization',
    deliverables: ['Campaign Strategy', 'Creative Development', 'Media Planning', 'Performance Analytics'],
    complexity: 'very-high'
  }
};

// Assessment questions for different strategic areas
const assessmentQuestions = {
  'gtm': [
    {
      question: "What is your current market position?",
      options: [
        { text: "Market leader with established presence", score: 3 },
        { text: "Strong competitor with growing market share", score: 5 },
        { text: "Emerging player seeking market entry", score: 8 },
        { text: "New entrant with innovative approach", score: 10 }
      ],
      insight: "Market position determines the complexity of your go-to-market strategy and resource requirements."
    },
    {
      question: "How well-defined is your target audience?",
      options: [
        { text: "Clearly defined with detailed personas", score: 2 },
        { text: "Generally defined with some specifics", score: 4 },
        { text: "Broadly defined, needs refinement", score: 7 },
        { text: "Unclear or multiple undefined segments", score: 10 }
      ],
      insight: "Audience clarity directly impacts messaging effectiveness and channel selection strategy."
    },
    {
      question: "What is your competitive landscape complexity?",
      options: [
        { text: "Few direct competitors, clear differentiation", score: 3 },
        { text: "Moderate competition with some overlap", score: 5 },
        { text: "Highly competitive with similar offerings", score: 8 },
        { text: "Saturated market requiring breakthrough positioning", score: 10 }
      ],
      insight: "Competitive intensity determines the sophistication needed in your positioning and messaging strategy."
    }
  ],
  'brand': [
    {
      question: "How established is your brand identity?",
      options: [
        { text: "Strong, consistent brand with clear identity", score: 2 },
        { text: "Developing brand with some inconsistencies", score: 5 },
        { text: "Fragmented brand requiring alignment", score: 8 },
        { text: "No clear brand identity or positioning", score: 10 }
      ],
      insight: "Brand maturity determines whether you need evolution or complete brand development."
    },
    {
      question: "What is your brand's market perception?",
      options: [
        { text: "Positive, well-understood positioning", score: 3 },
        { text: "Mixed perception with some clarity", score: 5 },
        { text: "Unclear or inconsistent market perception", score: 8 },
        { text: "Negative or no market awareness", score: 10 }
      ],
      insight: "Market perception indicates the level of brand repositioning or reputation management needed."
    },
    {
      question: "How complex is your brand architecture?",
      options: [
        { text: "Single brand with clear hierarchy", score: 2 },
        { text: "Multiple brands with some organization", score: 5 },
        { text: "Complex portfolio needing structure", score: 8 },
        { text: "Fragmented brands requiring complete overhaul", score: 10 }
      ],
      insight: "Brand complexity determines the strategic framework needed for coherent brand management."
    }
  ],
  'campaign': [
    {
      question: "What is your campaign objective complexity?",
      options: [
        { text: "Single, clear objective with defined metrics", score: 3 },
        { text: "Multiple related objectives", score: 5 },
        { text: "Complex, multi-layered campaign goals", score: 8 },
        { text: "Unclear or conflicting objectives", score: 10 }
      ],
      insight: "Objective clarity determines campaign strategy complexity and measurement framework requirements."
    },
    {
      question: "How sophisticated is your target segmentation?",
      options: [
        { text: "Single, well-defined target segment", score: 2 },
        { text: "2-3 clearly defined segments", score: 4 },
        { text: "Multiple segments requiring different approaches", score: 7 },
        { text: "Complex segmentation with micro-targeting needs", score: 10 }
      ],
      insight: "Segmentation complexity impacts creative development, media planning, and campaign orchestration."
    },
    {
      question: "What is your channel strategy complexity?",
      options: [
        { text: "Single channel focus with clear strategy", score: 2 },
        { text: "Multi-channel with integrated approach", score: 5 },
        { text: "Complex omnichannel requiring coordination", score: 8 },
        { text: "Experimental channels with unknown performance", score: 10 }
      ],
      insight: "Channel complexity determines the level of integration and optimization strategy required."
    }
  ]
};

export default function StrategyIQDashboard() {
  const [currentAssessmentType, setCurrentAssessmentType] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [assessmentAnswers, setAssessmentAnswers] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [showAssessmentFlow, setShowAssessmentFlow] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const intelligenceChartRef = useRef<Chart<'doughnut', number[], unknown> | null>(null)

  useEffect(() => {
    // Load sample ScopeIQ data
    loadSampleScopeIQData()
    initializeIntelligenceChart()
  }, [])

  useEffect(() => {
    if (currentAssessmentType && assessmentAnswers[currentQuestionIndex] !== undefined) {
      setSelectedOption(assessmentAnswers[currentQuestionIndex].optionIndex)
    } else {
      setSelectedOption(null)
    }
  }, [currentQuestionIndex, currentAssessmentType, assessmentAnswers])

  const loadSampleScopeIQData = () => {
    const elements = {
      'projectType': 'Brand Repositioning',
      'budgetRange': '$25K - $50K',
      'timeline': '3-6 months',
      'companySize': '50-200 employees'
    }
    
    Object.entries(elements).forEach(([id, text]) => {
      const element = document.getElementById(id)
      if (element) element.textContent = text
    })
  }

  const initializeIntelligenceChart = () => {
    if (!chartRef.current) return
    
    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Dynamic import for Chart.js
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      
      intelligenceChartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['#F96F6E', '#374151'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    })
  }

  const updateIntelligenceChart = () => {
    if (!intelligenceChartRef.current || !currentAssessmentType) return
    
    const maxScore = assessmentQuestions[currentAssessmentType].length * 10
    const percentage = (totalScore / maxScore) * 100
    
    intelligenceChartRef.current.data.datasets[0].data = [percentage, 100 - percentage]
    intelligenceChartRef.current.update()
  }

  const startAssessment = (type: string) => {
    setCurrentAssessmentType(type)
    setCurrentQuestionIndex(0)
    setAssessmentAnswers({})
    setTotalScore(0)
    setShowAssessmentFlow(true)
    setShowResults(false)
    setSelectedOption(null)
  }

  const selectOption = (optionIndex: number, score: number) => {
    setSelectedOption(optionIndex)
    setAssessmentAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { optionIndex, score }
    }))
    updateLiveScoring(optionIndex, score)
  }

  const updateLiveScoring = (optionIndex: number, score: number) => {
    const newAnswers = { ...assessmentAnswers, [currentQuestionIndex]: { optionIndex, score } }
    const newTotalScore = Object.values(newAnswers).reduce((sum: number, answer: { optionIndex: number; score: number }) => sum + answer.score, 0)
    setTotalScore(newTotalScore)
    
    setTimeout(() => {
      updateIntelligenceChart()
      updateServiceMatch(newTotalScore)
      updateRevenueProjection(newTotalScore)
    }, 0)
  }

  const nextQuestion = () => {
    if (assessmentAnswers[currentQuestionIndex] === undefined) {
      alert('Please select an answer before proceeding.')
      return
    }
    
    const questions = assessmentQuestions[currentAssessmentType]
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      completeAssessment()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const completeAssessment = () => {
    setShowAssessmentFlow(false)
    setShowResults(true)
  }

  const getComplexityLevel = (score: number) => {
    if (score <= 10) return 'Low Complexity'
    if (score <= 20) return 'Medium Complexity'
    return 'High Complexity'
  }

  const getStrategicFocus = (type: string, score: number) => {
    const focuses = {
      'gtm': score > 20 ? 'Market entry strategy with competitive positioning' : 'Market expansion and optimization',
      'brand': score > 20 ? 'Complete brand development and positioning' : 'Brand refinement and consistency',
      'campaign': score > 20 ? 'Integrated omnichannel campaign strategy' : 'Focused campaign optimization',
      'creative': score > 20 ? 'Comprehensive creative framework development' : 'Creative strategy enhancement'
    }
    return focuses[type as keyof typeof focuses]
  }

  const getSuccessMetrics = (type: string) => {
    const metrics = {
      'gtm': 'Market share growth, customer acquisition cost, time-to-market',
      'brand': 'Brand awareness, perception scores, market positioning',
      'campaign': 'Conversion rates, engagement metrics, ROI optimization',
      'creative': 'Content performance, brand consistency, creative effectiveness'
    }
    return metrics[type as keyof typeof metrics]
  }

  const updateServiceMatch = (score: number) => {
    if (!currentAssessmentType) return
    
    const service = serviceTiers[currentAssessmentType as keyof typeof serviceTiers]
    const matchPercentage = Math.min(95, 60 + (score * 2))
    
    const serviceMatchElement = document.getElementById('serviceMatch')
    if (serviceMatchElement) {
      serviceMatchElement.innerHTML = `
        <div class="text-center">
          <div class="text-2xl font-bold text-teal mb-1">${matchPercentage}%</div>
          <div class="text-xs text-ink-dim mb-3">Service Match</div>
          <div class="text-sm font-medium">${service.name}</div>
        </div>
      `
    }
  }

  const updateRevenueProjection = (score: number) => {
    if (!currentAssessmentType) return
    
    const service = serviceTiers[currentAssessmentType as keyof typeof serviceTiers]
    const confidence = Math.min(95, 70 + score)
    const closeProbability = Math.min(90, 50 + (score * 1.5))
    
    const projectValueElement = document.getElementById('projectValue')
    const confidenceLevelElement = document.getElementById('confidenceLevel')
    const closeProbabilityElement = document.getElementById('closeProbability')
    
    if (projectValueElement) projectValueElement.textContent = `$${service.price.toLocaleString()}`
    if (confidenceLevelElement) confidenceLevelElement.textContent = `${confidence}%`
    if (closeProbabilityElement) closeProbabilityElement.textContent = `${closeProbability}%`
  }

  const loadScopeIQData = () => {
    alert('ScopeIQ integration would load real client data here')
  }

  const generateProposal = () => {
    alert('Proposal generation would integrate with your proposal system')
  }

  const scheduleFollowUp = () => {
    alert('Calendar integration would schedule follow-up meeting')
  }

  const exportAssessment = () => {
    alert('Assessment export functionality would generate PDF report')
  }

  const resetAssessment = () => {
    if (confirm('Are you sure you want to reset the assessment?')) {
      setCurrentAssessmentType('')
      setCurrentQuestionIndex(0)
      setAssessmentAnswers({})
      setTotalScore(0)
      setShowAssessmentFlow(false)
      setShowResults(false)
      setSelectedOption(null)
      
      const intelligenceScoreElement = document.getElementById('intelligenceScore')
      if (intelligenceScoreElement) intelligenceScoreElement.textContent = '0'
      
      setTimeout(() => {
        updateIntelligenceChart()
      }, 0)
    }
  }

  const saveProgress = () => {
    alert('Progress saved successfully')
  }

  const exportNotes = () => {
    alert('Notes export functionality would generate consultant notes')
  }

  const getProgress = () => {
    if (!currentAssessmentType) return { progress: 0, text: '', percent: '0%' }
    
    const questions = assessmentQuestions[currentAssessmentType as keyof typeof assessmentQuestions]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100
    
    return {
      progress,
      text: `Question ${currentQuestionIndex + 1} of ${questions.length}`,
      percent: `${Math.round(progress)}%`
    }
  }

  const renderQuestion = () => {
    if (!currentAssessmentType) return null
    
    const questions = assessmentQuestions[currentAssessmentType as keyof typeof assessmentQuestions]
    const question = questions[currentQuestionIndex]
    
    return (
      <div className="fade-in">
        <h3 className="font-display text-xl font-semibold mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`question-option p-4 rounded-lg cursor-pointer ${
                selectedOption === index ? 'selected' : ''
              }`}
              onClick={() => selectOption(index, option.score)}
            >
              <div className="font-medium">{option.text}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRecommendation = () => {
    if (!currentAssessmentType) return null
    
    const service = serviceTiers[currentAssessmentType as keyof typeof serviceTiers]
    const complexityLevel = getComplexityLevel(totalScore)
    
    return (
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-ink-dim">{service.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-coral">${service.price.toLocaleString()}</div>
            <div className="text-sm text-ink-dim">{service.duration}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Key Deliverables</h4>
            <ul className="text-sm text-ink-dim space-y-1">
              {service.deliverables.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Complexity Assessment</h4>
            <div className="text-sm text-ink-dim">
              <div className="flex items-center mb-1">
                <span className="w-20">Score:</span>
                <span className="font-semibold text-coral">{totalScore}/30</span>
              </div>
              <div className="flex items-center">
                <span className="w-20">Level:</span>
                <span className="font-semibold text-teal">{complexityLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStrategicBrief = () => {
    if (!currentAssessmentType) return null
    
    const service = serviceTiers[currentAssessmentType as keyof typeof serviceTiers]
    
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold mb-4">Strategic Brief Preview</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-ink-dim mb-4">
            Based on your assessment responses, we recommend a {service.name} engagement 
            to address your strategic challenges systematically.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-coral mb-2">Strategic Focus</h4>
              <p className="text-sm text-ink-dim">
                {getStrategicFocus(currentAssessmentType, totalScore)}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-teal mb-2">Success Metrics</h4>
              <p className="text-sm text-ink-dim">
                {getSuccessMetrics(currentAssessmentType)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = getProgress()

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-12">
      <header className="bg-[var(--bg-alt)] border-b border-[var(--border-strong)] text-[var(--text-primary)] py-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-big-shoulders text-3xl font-bold mb-2">
                Strategy<span className="text-[var(--coral)]">IQ</span> Engine
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">Live Consultation Assessment Framework</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)] mb-1">Active Session</div>
              <div className="text-xl font-semibold" id="clientName">Client Assessment</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-big-shoulders text-xl font-semibold mb-2">Client Context</h2>
              <p className="text-[var(--text-secondary)] text-sm">Information from ScopeIQ Wizard integration</p>
            </div>
            <button className="bg-[var(--teal)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#20A29C]" onClick={loadScopeIQData}>
              <i className="fas fa-sync mr-2"></i>Load ScopeIQ Data
            </button>
          </div>
          <div id="clientContext" className="grid md:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-alt)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--text-muted)] mb-1">Project Type</div>
              <div className="font-semibold text-[var(--text-primary)]" id="projectType">--</div>
            </div>
            <div className="bg-[var(--bg-alt)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--text-muted)] mb-1">Budget Range</div>
              <div className="font-semibold text-[var(--text-primary)]" id="budgetRange">--</div>
            </div>
            <div className="bg-[var(--bg-alt)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--text-muted)] mb-1">Timeline</div>
              <div className="font-semibold text-[var(--text-primary)]" id="timeline">--</div>
            </div>
            <div className="bg-[var(--bg-alt)] rounded-lg p-4 border border-[var(--border-subtle)]">
              <div className="text-sm text-[var(--text-muted)] mb-1">Company Size</div>
              <div className="font-semibold text-[var(--text-primary)]" id="companySize">--</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section id="serviceSelection" className="mb-8">
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
                  <div className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--coral)] transition-all duration-300" onClick={() => startAssessment('gtm')}>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                        <i className="fas fa-rocket text-[var(--coral)] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-big-shoulders text-lg font-semibold mb-2">Go-to-Market <span className="text-[var(--coral)]">Strategy</span></h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-3">Market mapping, positioning, and systematic launch approach.</p>
                        <div className="text-xs text-[var(--coral)] font-medium">Sprint Focus • 6-12 weeks</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--teal)] transition-all duration-300" onClick={() => startAssessment('brand')}>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                        <i className="fas fa-bullhorn text-[var(--teal)] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-big-shoulders text-lg font-semibold mb-2">Brand <span className="text-[var(--teal)]">Intelligence</span></h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-3">Positioning, messaging, and systematic brand development.</p>
                        <div className="text-xs text-[var(--teal)] font-medium">Strategic Build • 8-16 weeks</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--coral)] transition-all duration-300" onClick={() => startAssessment('campaign')}>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                        <i className="fas fa-chart-bar text-[var(--coral)] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-big-shoulders text-lg font-semibold mb-2">Strategic <span className="text-[var(--coral)]">Campaigns</span></h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-3">End-to-end campaign strategy, creative, and optimization.</p>
                        <div className="text-xs text-[var(--coral)] font-medium">Campaign Build • 12-20 weeks</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--teal)] transition-all duration-300" onClick={() => startAssessment('creative')}>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                        <i className="fas fa-palette text-[var(--teal)] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-big-shoulders text-lg font-semibold mb-2">Creative <span className="text-[var(--teal)]">Strategy</span></h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-3">Content strategy, creative frameworks, and asset development.</p>
                        <div className="text-xs text-[var(--teal)] font-medium">Creative Focus • 4-12 weeks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--coral)]">
                  <i className="fas fa-brain mr-2"></i>Intelligence Score
                </h3>
                <div className="text-center mb-4">
                  <div id="intelligenceScore" className="text-4xl font-bold text-[var(--coral)] mb-2">{totalScore}</div>
                  <div className="text-sm text-[var(--text-secondary)]">Complexity Assessment</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--teal)]">
                  <i className="fas fa-target mr-2"></i>Service Match
                </h3>
                <div id="serviceMatch" className="space-y-3">
                  <div className="text-center text-[var(--text-secondary)]">
                    Complete assessment for recommendation
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
                    <span id="projectValue" className="font-bold text-[var(--teal)]">$0</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span className="text-sm">Confidence Level</span>
                    <span id="confidenceLevel" className="font-bold">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span className="text-sm">Close Probability</span>
                    <span id="closeProbability" className="font-bold text-[var(--coral)]">0%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4">
                  <i className="fas fa-bolt mr-2"></i>Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={resetAssessment}>
                    <i className="fas fa-redo mr-2"></i>Reset Assessment
                  </button>
                  <button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={saveProgress}>
                    <i className="fas fa-save mr-2"></i>Save Progress
                  </button>
                  <button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={exportNotes}>
                    <i className="fas fa-file-export mr-2"></i>Export Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
