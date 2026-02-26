"use client"
import React from "react"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle } from "lucide-react"

type Props = {
  clientName: string
  projectTitle: string
  calculatedLift?: string
  metricName?: string
  metricTarget?: string
  metricBaseline?: string
  primaryDriverTitle?: string
  primaryDriverDesc?: string
  operationalPriorityTitle?: string
  operationalPriorityDesc?: string
  businessGoals?: string
  businessOKRs?: string
  cacCurrent?: string
  cacGoal?: string
  ltvCurrent?: string
  ltvGoal?: string
  conversionCurrent?: string
  conversionGoal?: string
  strategicConstraints?: string
  marketingSignal?: string
  marketingNoise?: string
  selectedChannels: string[]
}

function sentenceCase(input?: string) {
  if (!input) return input
  const s = input.replace(/[\u2014\u2013]/g, ': ') // replace em/en dashes
  const lowered = s.toLowerCase()
  return lowered.charAt(0).toUpperCase() + lowered.slice(1)
}

export default function StrategicCharter(props: Props) {
  const {
    clientName,
    projectTitle,
    calculatedLift,
    metricName,
    metricTarget,
    metricBaseline,
    primaryDriverTitle,
    primaryDriverDesc,
    operationalPriorityTitle,
    operationalPriorityDesc,
    businessGoals,
    businessOKRs,
    cacCurrent,
    cacGoal,
    ltvCurrent,
    ltvGoal,
    conversionCurrent,
    conversionGoal,
    strategicConstraints,
    marketingSignal,
    marketingNoise,
    selectedChannels,
  } = props

  const constraints = (strategicConstraints || "")
    .split(/\n|\r|\./)
    .map(s => s.trim())
    .filter(Boolean)

  return (
    <div className="grid grid-cols-1 gap-8 pt-8 px-4 md:px-0">
      <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-baseline flex-wrap gap-2">
          <span className="font-big-shoulders text-coral text-2xl tracking-[0.2em] uppercase">{clientName}</span>
          <span className="text-white/30 mx-2">&sol;&sol;</span>
          <span className="font-big-shoulders text-white text-2xl tracking-[0.2em] uppercase">{projectTitle}</span>
        </div>
        <div className="mt-2 text-zinc-500 text-[11px] font-bold tracking-[0.3em] uppercase">Strategic Charter</div>
      </div>

      <div className="border border-teal/30 bg-teal/5 rounded-2xl p-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-teal font-big-shoulders tracking-wider" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>{calculatedLift || "+233.3%"}</span>
          <span className="mt-2 text-zinc-400 text-base font-inter">{metricName || "Qualified Enterprise Leads (CTO-level)"}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-teal font-mono">
          <div>
            TARGET <span className="text-white">{metricTarget || "150"}</span>
          </div>
          <div className="text-white/20">&sol;&sol;</div>
          <div>
            BASE <span className="text-white">{metricBaseline || "45"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h4 className="text-[11px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders mb-3">Primary Driver</h4>
          <div className="text-white font-big-shoulders text-xl tracking-wide uppercase">{sentenceCase(primaryDriverTitle || "Market capture")}</div>
          <div className="text-zinc-400 text-sm font-inter mt-1">{sentenceCase(primaryDriverDesc || "Aggressive growth and acquisition.")}</div>
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h4 className="text-[11px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders mb-3">Metric of Record</h4>
          <div className="text-white text-lg font-inter">{sentenceCase(metricName || "Qualified enterprise leads (CTO-level)")}</div>
          <div className="mt-2 flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span>
              TARGET: <span className="text-white">{metricTarget || "150"}</span>
            </span>
            <span>&sol;&sol;</span>
            <span>
              BASE: <span className="text-white">{metricBaseline || "45"}</span>
            </span>
          </div>
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h4 className="text-[11px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders mb-3">Operational Priority</h4>
          <div className="text-white font-big-shoulders text-xl tracking-wide uppercase">{sentenceCase(operationalPriorityTitle || "Volume generation")}</div>
          <div className="text-zinc-400 text-sm font-inter mt-1">{sentenceCase(operationalPriorityDesc || "Increasing raw lead flow.")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-3">Business Goals</h5>
          <div className="text-zinc-300 text-base md:text-lg font-inter leading-relaxed whitespace-pre-wrap">{sentenceCase(businessGoals) || "Transition to enterprise: Shift focus from mid-market to high-value CTO-level contracts."}</div>
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-3">Business OKRs</h5>
          <div className="text-zinc-300 text-base md:text-lg font-inter leading-relaxed whitespace-pre-wrap">{sentenceCase(businessOKRs) || "20% pipeline lift: Achieve 150 qualified enterprise leads within 6 months."}</div>
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-3">Benchmarks</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">CAC</div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Current</span><span className="text-white">{cacCurrent || "$4,200"}</span></div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Goal</span><span className="text-teal">{cacGoal || "$3,000"}</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">LTV</div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Current</span><span className="text-white">{ltvCurrent || "$45,000"}</span></div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Goal</span><span className="text-teal">{ltvGoal || "$65,000"}</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Conversion</div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Current</span><span className="text-white">{conversionCurrent || "2.4%"}</span></div>
              <div className="flex justify-between text-sm font-mono text-zinc-400"><span>Goal</span><span className="text-teal">{conversionGoal || "4.8%"}</span></div>
            </div>
          </div>
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--card-border)' }}>
          <h5 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-3">Constraints</h5>
          {constraints.length > 0 ? (
            <ol className="list-decimal ml-5 text-zinc-300 text-base md:text-lg font-inter leading-relaxed space-y-1">
              {constraints.map((it, i) => (
                <li key={i}>{sentenceCase(it)}</li>
              ))}
            </ol>
          ) : (
            <div className="text-zinc-500 text-sm">No constraints identified.</div>
          )}
        </div>
      </div>

      <section className="space-y-6">
        <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Operational History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
              <CheckCircle size={12} className="text-teal" /> Reliable Signal (What Works)
            </Label>
            <div className="text-white/80 font-serif italic text-lg leading-relaxed pl-0">
              {sentenceCase(marketingSignal) || "LinkedIn CTO outbound: High-intent responses from technical decision makers."}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
              <AlertCircle size={12} className="text-coral" /> Strategic Noise (What Failed)
            </Label>
            <div className="text-white/80 font-serif italic text-lg leading-relaxed pl-0">
              {sentenceCase(marketingNoise) || "Generic search ads: High CAC and low lead quality for enterprise segments."}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[12px] font-bold text-coral tracking-[0.2em] uppercase font-big-shoulders">Channel Ecosystem</h4>
        <div className="flex flex-wrap gap-3">
          {selectedChannels && selectedChannels.length > 0 ? (
            selectedChannels.map((channel) => (
              <div key={channel} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300 font-inter">
                {channel}
              </div>
            ))
          ) : (
            <span className="text-zinc-600 text-sm italic">No channels selected.</span>
          )}
        </div>
      </section>
    </div>
  )
}
