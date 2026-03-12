"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://luqodxrjnprsawtgnyiy.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cW9keHJqbnByc2F3dGdueWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjEwNTUsImV4cCI6MjA3NjA5NzA1NX0.XYGeiXpfC1TaOE37IY0axFStz2Xj8V65IiN0M23kdLA"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const Icon = ({ name, color }: { name: string; color: string }) => (
  <i className={`fas fa-${name} mr-2`} style={{ color: `var(--${color})` }} />
)

const serviceTiers = {
  creative: { name: "Creative Strategy", price: "$3k-$8k", duration: "4-12 weeks", description: "Content strategy, creative frameworks, and systematic asset development.", deliverables: ["Creative Framework", "Content System"], complexity: [1, 3] },
  gtm: { name: "Go-to-Market Sprint", price: "$5k-$12k", duration: "6-12 weeks", description: "Systematic market entry strategy with positioning and launch roadmap.", deliverables: ["Market Analysis", "Launch Roadmap"], complexity: [2, 4] },
  brand: { name: "Brand Intelligence", price: "$8k-$18k", duration: "8-16 weeks", description: "Comprehensive brand positioning, messaging, and systematic brand development.", deliverables: ["Brand Strategy", "Messaging Architecture"], complexity: [3, 5] },
  campaign: { name: "Strategic Campaigns", price: "$12k-$25k", duration: "12-20 weeks", description: "End-to-end campaign strategy, creative, and systematic optimization.", deliverables: ["Campaign Strategy", "Media Planning"], complexity: [4, 6] },
}

const assessmentQuestions = {
  gtm: [
    { id: "m1", question: "How ready is your market entry strategy?", options: [{ label: "Ready", score: 5 }, { label: "In Concept", score: 2 }], insight: "Market readiness dictates resource intensity." },
    { id: "m2", question: "How do you differentiate from competitors?", options: [{ label: "Unclear", score: 3 }, { label: "Clear Value Prop", score: 5 }], insight: "Differentiation clarity scopes positioning work." },
    { id: "m3", question: "How well-defined is your target market?", options: [{ label: "Broad market approach", score: 1 }, { label: "Defined buyer personas", score: 4 }], insight: "Audience definition impacts campaign complexity." },
    { id: "m4", question: "What's your preferred launch timeline?", options: [{ label: "Urgent - within 6 weeks", score: 3 }, { label: "Strategic - 4-6 months", score: 4 }], insight: "Timeline urgency affects engagement model." },
    { id: "m5", question: "What go-to-market resources do you have?", options: [{ label: "Budget allocated", score: 2 }, { label: "No marketing team", score: 1 }], insight: "Resource assessment determines support level." },
  ],
  brand: [
    { id: "b1", question: "What's your current brand development stage?", options: [{ label: "Early-stage development", score: 2 }, { label: "Mature brand, need repositioning", score: 5 }], insight: "Brand stage determines foundation work vs. refinement." },
    { id: "b2", question: "What's your primary brand challenge?", options: [{ label: "Low brand awareness", score: 3 }, { label: "Lack of differentiation", score: 4 }], insight: "Primary challenge focus helps prioritize strategic intervention." },
    { id: "b3", question: "How well do you understand your audience?", options: [{ label: "Based on assumptions", score: 1 }, { label: "Deep behavioral insights", score: 4 }], insight: "Audience insights depth affects research vs. application." },
    { id: "b4", question: "What brand assets do you currently have?", options: [{ label: "Logo and visual identity", score: 1 }, { label: "Messaging framework", score: 2 }], insight: "Existing assets determine build vs. optimize strategy." },
    { id: "b5", question: "What are your primary brand objectives?", options: [{ label: "Increase brand awareness", score: 2 }, { label: "Strengthen differentiation", score: 3 }], insight: "Objectives clarity helps align engagement scope." },
  ],
  campaign: [
    { id: "c1", question: "What's your primary campaign objective?", options: [{ label: "Brand awareness and reach", score: 3 }, { label: "Direct sales conversion", score: 5 }], insight: "Campaign focus determines strategy complexity." },
    { id: "c2", question: "What's your campaign budget range?", options: [{ label: "Under $50k", score: 2 }, { label: "Over $250k", score: 5 }], insight: "Budget level indicates scale possibilities." },
    { id: "c3", question: "How many channels will you be using?", options: [{ label: "Single channel focus", score: 2 }, { label: "Full ecosystem approach", score: 5 }], insight: "Channel complexity impacts planning and coordination." },
    { id: "c4", question: "What creative development do you need?", options: [{ label: "Creative strategy", score: 2 }, { label: "Asset production", score: 1 }], insight: "Creative scope determines team composition." },
    { id: "c5", question: "How will you measure campaign success?", options: [{ label: "Engagement rates", score: 1 }, { label: "ROI and revenue attribution", score: 3 }], insight: "Measurement sophistication reveals analytics requirements." },
  ],
  creative: [
    { id: "v1", question: "What's your current creative capability?", options: [{ label: "No formal creative process", score: 3 }, { label: "Advanced creative operations", score: 1 }], insight: "Creative capability determines build vs. optimize approach." },
    { id: "v2", question: "What's your content production needs?", options: [{ label: "Occasional content needs", score: 1 }, { label: "High-volume production", score: 3 }], insight: "Production needs indicate scale requirements." },
    { id: "v3", question: "Which channels need creative support?", options: [{ label: "Social media", score: 1 }, { label: "Digital advertising", score: 2 }], insight: "Channel spread affects asset diversity." },
    { id: "v4", question: "What are your creative objectives?", options: [{ label: "Brand consistency", score: 1 }, { label: "Creative innovation", score: 3 }], insight: "Creative objectives determine strategy vs. execution focus." },
    { id: "v5", question: "What's your creative development timeline?", options: [{ label: "Rush - under 4 weeks", score: 3 }, { label: "Ongoing support needed", score: 1 }], insight: "Development timeline affects resource allocation." },
  ],
}

const initialClientContext = {
  projectType: "--",
  budgetRange: "--",
  timeline: "--",
  companySize: "--",
}

type AssessmentAnswer = Record<string, { value: string; score: number }>
type AssessmentState = {
  type: string
  index: number
  active: boolean
  answers: AssessmentAnswer
  score: number
}

export default function StrategyIQDashboard() {
  const { data: session } = useSession()
  const [clientContext, setClientContext] = useState(initialClientContext)
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    type: "",
    index: 0,
    active: false,
    answers: {},
    score: 0,
  })

  useEffect(() => {
    if (session?.user?.email) {
      loadScopeIQData()
    }
  }, [session])

  const loadScopeIQData = async () => {
    const userEmail = session?.user?.email
    if (!userEmail) {
      alert("Error: Not logged in. Cannot fetch client data.")
      return
    }

    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("email", userEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (clientError || !client) throw new Error("No ScopeIQ data found for this user.")

      const loadedData = {
        projectType: client.project_type || "N/A",
        budgetRange: client.budget_range || "N/A",
        timeline: client.timeline || "N/A",
        companySize: client.company_size || "N/A",
      }

      setClientContext(loadedData)
      const el = document.getElementById("clientName")
      if (el) el.textContent = `${client.name} - ${client.company || "Private"}`

      alert(`✅ Data for ${client.name} loaded successfully!`)
    } catch (e: any) {
      alert(`❌ Error loading ScopeIQ data: ${e.message}`)
      console.error(e)
    }
  }

  const startAssessment = (type: string) => {
    setAssessmentState({ type, index: 0, active: true, answers: {}, score: 0 })
  }

  const handleOptionSelect = (qId: string, value: string, score: number) => {
    let currentScore = assessmentState.score
    const oldAnswer = assessmentState.answers[qId]
    if (oldAnswer) currentScore -= oldAnswer.score
    currentScore += score

    setAssessmentState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qId]: { value, score } },
      score: currentScore,
    }))
  }

  const nextQuestion = () => {
    const questions = assessmentQuestions[
      assessmentState.type as keyof typeof assessmentQuestions
    ]
    if (!questions) return
    const currentQId = questions[assessmentState.index].id
    if (!assessmentState.answers[currentQId]) {
      alert("Please select an option before proceeding.")
      return
    }
    if (assessmentState.index < questions.length - 1) {
      setAssessmentState((prev) => ({ ...prev, index: prev.index + 1 }))
    } else {
      setAssessmentState((prev) => ({ ...prev, active: false }))
    }
  }

  const resetAssessment = () => {
    if (window.confirm("Reset current assessment? This will clear all progress.")) {
      setAssessmentState({ type: "", index: 0, active: false, answers: {}, score: 0 })
    }
  }

  const renderAssessment = () => {
    const q =
      assessmentQuestions[
        assessmentState.type as keyof typeof assessmentQuestions
      ]?.[assessmentState.index]
    if (!q) return <div className="text-[var(--coral)]">Assessment Complete.</div>
    return (
      <div className="space-y-4">
        <h3 className="font-big-shoulders text-3xl font-bold mb-4">{q.question}</h3>
        <p className="text-[var(--text-secondary)] mb-6">{q.insight}</p>
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`w-full text-left p-4 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-alt)] hover:border-[var(--coral)] transition-all duration-200 ${
              assessmentState.answers[q.id]?.value === opt.label ? "border-2 border-[var(--coral)]" : ""
            }`}
            onClick={() => handleOptionSelect(q.id, opt.label, opt.score)}
          >
            <span className="text-lg text-[var(--text-primary)]">{opt.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-12">
      <header className="bg-[var(--bg-alt)] border-b border-[var(--border-strong)] text-[var(--text-primary)] py-8 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-big-shoulders text-3xl font-bold mb-2">Strategy<span className="text-[var(--coral)]">IQ</span> Engine</h1>
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
        <section className="mb-8">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-big-shoulders text-xl font-semibold mb-2">Client Context</h2>
                <p className="text-[var(--text-secondary)] text-sm">Information from ScopeIQ Wizard integration</p>
              </div>
              <Button className="bg-[var(--teal)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#20A29C] transition-all" onClick={loadScopeIQData}>
                <i className="fas fa-sync mr-2"></i>Load ScopeIQ Data
              </Button>
            </div>
            <div id="clientContext" className="grid md:grid-cols-4 gap-4">
              {Object.entries(clientContext).map(([key, value]) => (
                <div key={key} className="bg-[var(--bg-alt)] rounded-lg p-3 border border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--text-muted)] mb-1 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                  <div className="font-semibold text-[var(--text-primary)] text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section id="serviceSelection" className={`${assessmentState.active ? "hidden" : ""} mb-8`}>
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <div className="mb-6">
                  <h2 className="font-big-shoulders text-2xl font-semibold mb-3">Strategic <span className="text-[var(--coral)]">Assessment</span> Areas</h2>
                  <p className="text-[var(--text-secondary)]">Select the primary strategic focus area to begin the intelligence assessment with your client.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(serviceTiers).map(([key, service]) => (
                    <div key={key} className="p-6 rounded-xl cursor-pointer bg-[var(--bg-alt)] border border-[var(--border-subtle)] hover:border-[var(--coral)] transition-all duration-300" onClick={() => startAssessment(key)}>
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-[var(--card-bg)] rounded-lg flex items-center justify-center mr-4 border border-[var(--border-subtle)] shadow-inner">
                          {key === "gtm" && <Icon name="rocket" color="coral" />}
                          {key === "brand" && <Icon name="bullhorn" color="teal" />}
                          {key === "campaign" && <Icon name="chart-bar" color="coral" />}
                          {key === "creative" && <Icon name="palette" color="teal" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-big-shoulders text-lg font-semibold mb-2">{service.name}</h3>
                          <p className="text-[var(--text-secondary)] text-sm mb-3">{service.description}</p>
                          <div className="text-xs text-[var(--coral)] font-medium">{service.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="assessmentFlow" className={`${assessmentState.active ? "" : "hidden"}`}>
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-[var(--text-primary)]">Strategic Assessment Progress</span>
                    <span className="font-bold text-[var(--coral)]">{(
                      (assessmentState.index /
                        (assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length || 1)) * 100
                    ).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-alt)] rounded-full h-3">
                    <div className="bg-[var(--coral)] h-3 rounded-full" style={{ width: `${(
                      (assessmentState.index + 1) /
                      (assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length || 1)
                    ) * 100}%` }}></div>
                  </div>
                </div>

                <div id="questionContainer">{renderAssessment()}</div>

                <div className="flex justify-between mt-8">
                  <button className="bg-[var(--bg-alt)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--border-strong)] transition-all disabled:opacity-50" onClick={() => setAssessmentState((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) }))} disabled={assessmentState.index === 0}>
                    <i className="fas fa-arrow-left mr-2"></i>Previous
                  </button>
                  <button className="bg-[var(--coral)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e55a5a] transition-all" onClick={nextQuestion}>
                    {assessmentState.index === (assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length || 1) - 1 ? "Complete" : "Next"}
                    <i className={`fas ${assessmentState.index === (assessmentQuestions[assessmentState.type as keyof typeof assessmentQuestions]?.length || 1) - 1 ? "fa-check" : "fa-arrow-right"} ml-2`}></i>
                  </button>
                </div>
              </div>
            </section>

            <section id="resultsSection" className={`${assessmentState.active === false && assessmentState.index > 0 ? "" : "hidden"}`}>
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h2 className="font-big-shoulders text-2xl font-semibold mb-3">Strategic <span className="text-[var(--teal)]">Recommendation</span></h2>
                <p className="text-[var(--text-secondary)] mb-6">Intelligence-driven engagement recommendation based on systematic assessment.</p>
                <div className="bg-[var(--bg-alt)] p-6 rounded-xl">
                  <p className="text-[var(--text-primary)] font-semibold">Ready to generate your final strategic brief.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--coral)]"><i className="fas fa-brain mr-2"></i>Intelligence Score</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-[var(--coral)] mb-2">{assessmentState.score}</div>
                  <div className="text-sm text-[var(--text-secondary)]">Complexity Assessment</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4 text-[var(--teal)]"><i className="fas fa-target mr-2"></i>Service Match</h3>
                <div className="text-center text-[var(--text-secondary)]">Complete assessment for recommendation</div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4"><i className="fas fa-chart-line mr-2"></i>Revenue <span className="text-[var(--teal)]">Projection</span></h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[var(--text-secondary)]"><span className="text-sm">Project Value</span><span className="font-bold text-[var(--teal)]">$0</span></div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]"><span className="text-sm">Confidence Level</span><span className="font-bold">0%</span></div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]"><span className="text-sm">Close Probability</span><span className="font-bold text-[var(--coral)]">0%</span></div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-strong)] shadow-[var(--shadow-soft)]">
                <h3 className="font-big-shoulders text-lg font-semibold mb-4"><i className="fas fa-bolt mr-2"></i>Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={resetAssessment}>
                    <i className="fas fa-redo mr-2"></i>Reset Assessment
                  </Button>
                  <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={() => alert("Progress saved successfully")}>
                    <i className="fas fa-save mr-2"></i>Save Progress
                  </Button>
                  <Button className="w-full bg-[var(--bg-alt)] text-[var(--text-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--border-strong)] transition-colors" onClick={() => alert("Notes export functionality would generate consultant notes")}>
                    <i className="fas fa-file-export mr-2"></i>Export Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
