'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Rocket, 
  Briefcase, 
  Map, 
  LayoutDashboard, 
  Network, 
  ChevronRight, 
  ArrowUpRight, 
  Zap,
  Activity,
  Target,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Bell,
  Settings,
  User,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- SIDEBAR NAVIGATION ITEMS ---
const sidebarItems = [
  { id: 'engine', icon: Cpu, label: 'StrategyIQ Engine' },
  { id: 'war-room', icon: Briefcase, label: 'War Room' },
  { id: 'roadmap', icon: Map, label: 'Roadmap' },
  { id: 'execution', icon: LayoutDashboard, label: 'Execution Board' },
  { id: 'graph', icon: Network, label: 'Knowledge Graph' },
];

// --- RADAR CHART COMPONENT (Left Side) ---
interface RadarChartProps {
  scores: Record<string, number>;
}

function StrategicMaturityRadar({ scores }: RadarChartProps) {
  const size = 600; // Increased SVG canvas size to prevent clipping
  const center = size / 2;
  const radius = size * 0.22; // Proportional radius for better spacing
  
  const axes = [
    { label: 'Brand Positioning', key: 'brand' },
    { label: 'Go-To-Market Strategy', key: 'gtm' },
    { label: 'Campaign Operations', key: 'campaign' },
    { label: 'Creative Direction', key: 'creative' },
    { label: 'Execution Systems', key: 'execution' },
  ];

  const getPoint = (score: number, index: number) => {
    const angle = (index * 2 * Math.PI) / axes.length - Math.PI / 2;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = axes.map((axis, i) => getPoint(scores[axis.key] || 0, i));
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full aspect-[16/13] md:aspect-[16/10] flex items-center justify-center bg-[#0F1720] rounded-[4px] border border-white/10 overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,200,165,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,white,transparent:90%)]" />

      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size * 0.65}`} className="relative z-10 overflow-visible scale-90 md:scale-100">
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center * 0.65}
            r={radius * scale}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}

        {axes.map((_, i) => {
          const p = getPoint(100, i);
          const adjustedY = p.y - center * 0.35;
          return (
            <line
              key={i}
              x1={center}
              y1={center * 0.65}
              x2={p.x}
              y2={adjustedY}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          );
        })}

        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          points={points.map(p => `${p.x},${p.y - center * 0.35}`).join(' ')}
          fill="rgba(30,200,165,0.05)"
          stroke="#1EC8A5"
          strokeWidth="1.5"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y - center * 0.35}
              r="3"
              fill="#1EC8A5"
            />
          </g>
        ))}

        {axes.map((axis, i) => {
          const p = getPoint(130, i);
          const adjustedY = p.y - center * 0.35;
          const anchor = i === 0 ? "middle" : (i === 1 || i === 2) ? "start" : "end";
          
          const words = axis.label.split(' ');
          
          return (
            <text
              key={i}
              x={p.x}
              y={adjustedY}
              textAnchor={anchor}
              className="fill-white/30 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-medium font-inter"
            >
              {words.map((word, wordIdx) => (
                <tspan 
                  key={wordIdx} 
                  x={p.x} 
                  dy={wordIdx === 0 ? 0 : 12}
                >
                  {word}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>

      <div className="absolute top-[32.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0F1720] border border-white/10 flex items-center justify-center z-0">
        <Cpu size={16} className="text-white/20" />
      </div>
    </div>
  );
}

// --- GAP ANALYSIS COMPONENT ---
function GapAnalysis({ scores }: { scores: Record<string, number> }) {
  const items = [
    { label: 'Brand Positioning', score: scores.brand, gap: 100 - scores.brand },
    { label: 'Go-To-Market', score: scores.gtm, gap: 100 - scores.gtm },
    { label: 'Campaign Ops', score: scores.campaign, gap: 100 - scores.campaign },
    { label: 'Creative Direction', score: scores.creative, gap: 100 - scores.creative },
    { label: 'Execution Systems', score: scores.execution, gap: 100 - scores.execution },
  ];

  return (
    <div className="bg-[#0F1720] rounded-[4px] border border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={14} className="text-[#1EC8A5]" />
          <h3 className="text-[12px] font-bold tracking-[0.1em] text-white/30 uppercase font-inter">Gap Analysis</h3>
        </div>
        <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">v2.4</span>
      </div>
      
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-1.5 group">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-medium text-white/60 tracking-wider uppercase font-inter">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Delta</span>
                <span className="text-[11px] font-mono font-bold text-[#FF6A5C]">-{item.gap}%</span>
              </div>
            </div>
            <div className="relative h-[2px] w-full bg-white/[0.03] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                className="h-full bg-[#1EC8A5]/40"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MULTIPLIER EFFECT COMPONENT ---
function MultiplierEffect() {
  return (
    <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-3 md:p-4 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
        <TrendingUp size={120} className="text-white" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <Zap size={14} className="text-[#FF6A5C]" />
        <h3 className="text-[10px] md:text-[12px] font-bold tracking-[0.1em] text-white/30 uppercase font-inter">Multiplier Effect</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="space-y-1 md:space-y-1.5">
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold font-inter">Impact</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] md:text-[26px] font-inter font-bold text-white tracking-tight">+42%</span>
            <span className="text-[8px] md:text-[9px] text-white/30 font-bold tracking-[0.2em] uppercase font-inter">Vel</span>
          </div>
        </div>
        
        <div className="space-y-1 md:space-y-1.5">
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold font-inter">Multiplier</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] md:text-[26px] font-inter font-bold text-[#1EC8A5] tracking-tight">3.8x</span>
            <span className="text-[8px] md:text-[9px] text-[#1EC8A5]/40 font-bold tracking-[0.2em] uppercase font-inter">Lev</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3 md:gap-4">
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
          <Layers size={12} className="text-white/20" />
        </div>
        <p className="text-[9px] md:text-[10px] text-white/30 italic leading-relaxed font-medium font-inter">
          "Systemic alignment projected to reduce operational drift by <span className="text-white/50">28%</span>."
        </p>
      </div>
    </div>
  );
}

// --- OPERATIONAL VELOCITY COMPONENT ---
function OperationalVelocity() {
  const phases = [
    { label: 'Intake', desc: 'Entry point' },
    { label: 'Discovery', desc: 'Current Phase' },
    { label: 'Synthesis', desc: 'Analysis' },
    { label: 'Strategy', desc: 'Blueprint' },
    { label: 'Execution', desc: 'Activation' }
  ];
  const activeIndex = 1;

  return (
    <div className="bg-[#0F1720] rounded-[4px] border border-white/10 p-3 md:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <Target size={14} className="text-[#1EC8A5]" />
          <h3 className="text-[10px] md:text-[12px] font-bold tracking-[0.1em] text-white/30 uppercase font-inter">Operational Velocity</h3>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-[8px] md:text-[9px] font-mono tracking-widest uppercase">
          <span className="text-white/10">P_02/05</span>
          <span className="text-[#1EC8A5]/40 tracking-[0.3em]">Status: Active</span>
        </div>
      </div>

      <div className="relative px-1 md:px-2">
        <div className="absolute top-[5px] left-0 w-full h-[1px] bg-white/5" />
        
        <div className="flex justify-between relative z-10">
          {phases.map((phase, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-700",
                i === activeIndex 
                  ? "bg-[#1EC8A5] scale-125 shadow-[0_0_8px_rgba(30,200,165,0.4)]" 
                  : i < activeIndex 
                    ? "bg-[#1EC8A5]/20" 
                    : "bg-white/5"
              )} />
              
              <div className="text-center mt-3 md:mt-4">
                <p className={cn(
                  "text-[8px] md:text-[10px] font-medium tracking-[0.1em] uppercase font-inter transition-colors",
                  i === activeIndex ? "text-white" : "text-white/10"
                )}>
                  {phase.label}
                </p>
                {i === activeIndex && (
                  <p className="hidden sm:block text-[8px] font-mono text-[#1EC8A5] uppercase tracking-widest mt-1 opacity-60">
                    {phase.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD PAGE ---
export default function StrategicMaturityDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState('engine');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [scores] = useState({
    brand: 72,
    gtm: 38,
    campaign: 58,
    creative: 84,
    execution: 48
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderContent = () => {
    switch (activeItem) {
      case 'engine':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-start">
            {/* --- LEFT/CENTER FLOW --- */}
            <div className="col-span-1 xl:col-span-6 flex flex-col gap-4 xl:pr-6 xl:border-r border-white/[0.05]">
              {/* 1. COMMAND STRIP (Mobile: 1, Desktop: Top) */}
              <div className="order-1 flex items-center gap-2 md:gap-3 py-1 px-1 border-b border-white/5 overflow-x-auto no-scrollbar -mx-4 md:mx-0 px-4 md:px-0">
                {[
                  { label: 'Run Diagnostic', icon: Activity },
                  { label: 'Generate Strategic Roadmap', icon: Map },
                  { label: 'Export Artifact', icon: ArrowUpRight },
                ].map((action, i) => (
                  <button 
                    key={i}
                    className="flex items-center gap-2 md:gap-2.5 px-3 py-1.5 rounded-[4px] bg-white/[0.03] border border-white/5 hover:border-[#1EC8A5]/30 hover:bg-white/[0.05] transition-all group whitespace-nowrap"
                  >
                    <action.icon size={11} className="text-[#1EC8A5]/60 group-hover:text-[#1EC8A5] transition-colors" />
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors font-inter">
                      {action.label}
                    </span>
                  </button>
                ))}
                <div className="flex-1 min-w-[20px]" />
                <div className="flex items-center gap-2 md:gap-3 px-3 py-1 bg-white/[0.01] rounded-[4px] border border-white/5 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] opacity-40 animate-pulse" />
                  <span className="text-[8px] md:text-[9px] font-mono text-white/10 uppercase tracking-[0.3em]">Ready</span>
                </div>
              </div>

              {/* HEADER (Desktop/Tablet) */}
              <div className="order-2 flex justify-between items-start pt-2 md:pt-0">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center gap-3 text-[#1EC8A5]">
                    <div className="w-6 md:w-8 h-[1px] bg-[#1EC8A5]/30" />
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.5em] font-inter opacity-60">Intelligence Feed</span>
                  </div>
                  <div className="space-y-0.5">
                    <h1 className="text-[28px] md:text-[36px] xl:text-[40px] font-inter font-bold tracking-[-0.01em] text-white uppercase leading-tight">
                      StrategyIQ Engine
                    </h1>
                    <h2 className="text-[16px] md:text-[20px] xl:text-[22px] font-inter font-semibold text-white/65 uppercase tracking-wide">
                      Strategic Maturity
                    </h2>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 md:gap-4 text-[8px] md:text-[9px] font-mono text-white/10 tracking-[0.2em] uppercase">
                    <span className="hidden sm:inline">Maturity_Score: 61.2</span>
                    <span className="sm:hidden">Score: 61.2</span>
                    <div className="w-1 h-1 rounded-full bg-white/5" />
                    <span>ID: 8829-X</span>
                  </div>
                </div>
              </div>

              {/* RADAR METADATA */}
              <div className="order-3 grid grid-cols-3 gap-2 md:gap-4 px-2">
                <div className="space-y-0.5">
                  <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold font-inter">Vector</p>
                  <p className="text-[9px] md:text-[11px] font-mono text-white/60 tracking-widest uppercase truncate">E_04_BLUEPRINT</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold font-inter">Score</p>
                  <p className="text-[9px] md:text-[11px] font-mono text-[#1EC8A5] font-bold tracking-widest uppercase">61.2/100</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold font-inter">Constraint</p>
                  <p className="text-[9px] md:text-[11px] font-mono text-[#FF6A5C] font-bold tracking-widest uppercase truncate">GTM_VELOCITY</p>
                </div>
              </div>

              {/* 2. RADAR INSTRUMENT (Mobile: 2) */}
              <div className="order-4">
                <StrategicMaturityRadar scores={scores} />
              </div>
              
              {/* 3. STRATEGIC VECTOR (Mobile: 3) */}
              <div className="order-5 bg-[#0F1720] border border-white/10 rounded-[4px] p-3 md:p-4">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <TrendingUp size={14} className="text-[#1EC8A5]" />
                  <h3 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Strategic Vector</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-1 md:space-y-1.5">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold font-inter">Primary Constraint</p>
                    <p className="text-[10px] md:text-[11px] font-medium text-white/80 font-inter">GTM Velocity Gap</p>
                  </div>
                  <div className="space-y-1 md:space-y-1.5">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold font-inter">Strategic Direction</p>
                    <p className="text-[10px] md:text-[11px] font-medium text-[#1EC8A5] font-inter">Narrative Realignment</p>
                  </div>
                  <div className="space-y-1 md:space-y-1.5">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold font-inter">Execution Focus</p>
                    <p className="text-[10px] md:text-[11px] font-medium text-white/80 font-inter">Campaign System Integration</p>
                  </div>
                </div>
              </div>

              {/* TABLET/MOBILE ONLY MODULES (Ordered as per rules) */}
              <div className="xl:hidden flex flex-col gap-4 order-6">
                <GapAnalysis scores={scores} />
                <MultiplierEffect />
                
                <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <Activity size={14} className="text-[#1EC8A5]" />
                    <h3 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Strategic Signals</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      'GTM misalignment slowing revenue velocity',
                      'Campaign infrastructure under-optimized',
                      'Brand narrative lacks execution integration'
                    ].map((signal, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className="w-1 h-1 rounded-full bg-[#FF6A5C] mt-1.5 group-hover:scale-150 transition-transform" />
                        <p className="text-[10px] md:text-[11px] text-white/50 leading-relaxed font-inter group-hover:text-white/80 transition-colors">
                          {signal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-3 md:p-4">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                      <Layers size={14} className="text-[#1EC8A5]" />
                      <h3 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Generated Artifact</h3>
                    </div>
                    <span className="text-[8px] md:text-[9px] font-mono text-[#1EC8A5]/40 uppercase tracking-widest">Output</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: 'Positioning Narrative', desc: 'Narrative architecture from diagnostic.' },
                      { title: 'Execution Roadmap', desc: 'Sequenced initiatives for maturity gaps.' },
                      { title: 'Campaign Architecture', desc: 'Operational campaign blueprint.' }
                    ].map((artifact, i) => (
                      <div key={i} className="p-2.5 md:p-3 bg-white/[0.02] border border-white/5 rounded-[4px] hover:border-[#1EC8A5]/20 transition-all group">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-wider font-inter">{artifact.title}</p>
                          <ArrowUpRight size={11} className="text-white/20 group-hover:text-[#1EC8A5] transition-colors" />
                        </div>
                        <p className="text-[9px] md:text-[10px] text-white/30 leading-relaxed font-inter">{artifact.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[4px] bg-[#1EC8A5]/10 border border-[#1EC8A5]/20 hover:bg-[#1EC8A5] hover:text-black transition-all group">
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] font-inter">Open Blueprint</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* 7. TELEMETRY STRIP (Mobile: 7) */}
              <div className="order-7 grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Market Timing', val: 'OPTIMIZED', color: 'text-[#1EC8A5]' },
                  { label: 'Resource Load', val: 'ELEVATED', color: 'text-[#FF6A5C]' },
                  { label: 'Sync Status', val: 'CALIBRATED', color: 'text-[#1EC8A5]' },
                  { label: 'System Health', val: '98.4%', color: 'text-[#1EC8A5]' }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0F1720] border border-white/10 rounded-[4px] py-2 px-3">
                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 font-bold mb-0.5 font-inter truncate">{stat.label}</p>
                    <p className={cn("text-[9px] font-mono font-bold tracking-widest", stat.color)}>{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* 8. OPERATIONAL VELOCITY (Mobile: 8) */}
              <div className="order-8 pt-2">
                <OperationalVelocity />
              </div>

              {/* 9. SYSTEM CERTIFICATION (Mobile: 9) - Tablet/Mobile only placement */}
              <div className="xl:hidden order-9 bg-[#0F1720] border border-white/10 rounded-[4px] p-4 md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                  <ShieldCheck size={100} className="text-white" />
                </div>
                <div className="flex items-center gap-4 md:gap-5 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#1EC8A5]/60">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[8px] md:text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Module_05</h3>
                    <p className="text-[12px] md:text-[14px] font-inter font-bold text-white uppercase tracking-widest">System Certification</p>
                  </div>
                </div>
                <p className="text-[10px] md:text-[11px] text-white/30 leading-relaxed font-medium font-inter mb-4 md:mb-6 max-w-[280px]">
                  Validate operational roadmap against StrategyIQ™ maturity benchmarks.
                </p>
                <button className="w-full flex items-center justify-between px-4 md:px-5 py-2 md:py-2.5 rounded-[4px] bg-white/[0.03] border border-white/10 hover:border-[#1EC8A5]/40 hover:bg-white/[0.05] transition-all group">
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-[#1EC8A5]/80 group-hover:text-[#1EC8A5] transition-colors font-inter">Begin Certification</span>
                  <ArrowRight size={12} className="text-[#1EC8A5]/60 group-hover:text-[#1EC8A5] transition-all transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* --- RIGHT COLUMN (Desktop ONLY: 9-12) --- */}
            <div className="hidden xl:flex xl:col-span-4 flex-col gap-4">
              <GapAnalysis scores={scores} />
              <MultiplierEffect />
              
              <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={14} className="text-[#1EC8A5]" />
                  <h3 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Strategic Signals</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'GTM misalignment slowing revenue velocity',
                    'Campaign infrastructure under-optimized',
                    'Brand narrative lacks execution integration'
                  ].map((signal, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="w-1 h-1 rounded-full bg-[#FF6A5C] mt-1.5 group-hover:scale-150 transition-transform" />
                      <p className="text-[11px] text-white/50 leading-relaxed font-inter group-hover:text-white/80 transition-colors">
                        {signal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Layers size={14} className="text-[#1EC8A5]" />
                    <h3 className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Generated Artifact</h3>
                  </div>
                  <span className="text-[9px] font-mono text-[#1EC8A5]/40 uppercase tracking-widest">Output</span>
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'Positioning Narrative', desc: 'Narrative architecture from diagnostic.' },
                    { title: 'Execution Roadmap', desc: 'Sequenced initiatives for maturity gaps.' },
                    { title: 'Campaign Architecture', desc: 'Operational campaign blueprint.' }
                  ].map((artifact, i) => (
                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-[4px] hover:border-[#1EC8A5]/20 transition-all group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider font-inter">{artifact.title}</p>
                        <ArrowUpRight size={11} className="text-white/20 group-hover:text-[#1EC8A5] transition-colors" />
                      </div>
                      <p className="text-[10px] text-white/30 leading-relaxed font-inter">{artifact.desc}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[4px] bg-[#1EC8A5]/10 border border-[#1EC8A5]/20 hover:bg-[#1EC8A5] hover:text-black transition-all group">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] font-inter">Open Blueprint</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="bg-[#0F1720] border border-white/10 rounded-[4px] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                  <ShieldCheck size={100} className="text-white" />
                </div>
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-10 h-10 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#1EC8A5]/60">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase font-inter">Module_05</h3>
                    <p className="text-[14px] font-inter font-bold text-white uppercase tracking-widest">System Certification</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/30 leading-relaxed font-medium font-inter mb-6 max-w-[280px]">
                  Validate operational roadmap against StrategyIQ™ maturity benchmarks.
                </p>
                <button className="w-full flex items-center justify-between px-5 py-2.5 rounded-[4px] bg-white/[0.03] border border-white/10 hover:border-[#1EC8A5]/40 hover:bg-white/[0.05] transition-all group">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1EC8A5]/80 group-hover:text-[#1EC8A5] transition-colors font-inter">Begin Certification</span>
                  <ArrowRight size={12} className="text-[#1EC8A5]/60 group-hover:text-[#1EC8A5] transition-all transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'war-room':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
            <div className="w-20 h-20 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#FF6A5C]/40">
              <Briefcase size={32} />
            </div>
            <h2 className="text-[32px] font-inter font-bold uppercase text-white tracking-widest">The War Room</h2>
            <p className="text-white/20 max-w-md italic font-inter text-sm leading-relaxed">Strategic mission control for active campaigns and high-stakes decision cycles. Live environment calibrating.</p>
          </div>
        );
      case 'roadmap':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
            <div className="w-20 h-20 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#1EC8A5]/40">
              <Map size={32} />
            </div>
            <h2 className="text-[32px] font-inter font-bold uppercase text-white tracking-widest">Strategic Roadmap</h2>
            <p className="text-white/20 max-w-md italic font-inter text-sm leading-relaxed">Visualizing the path from discovery to execution. Timeline synchronization in progress.</p>
          </div>
        );
      case 'execution':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
            <div className="w-20 h-20 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-[32px] font-inter font-bold uppercase text-white tracking-widest">Execution Board</h2>
            <p className="text-white/20 max-w-md italic font-inter text-sm leading-relaxed">High-fidelity task management and system activation logs. Connecting to Studio API.</p>
          </div>
        );
      case 'graph':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
            <div className="w-20 h-20 rounded-[4px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
              <Network size={32} className="animate-spin-slow" />
            </div>
            <h2 className="text-[32px] font-inter font-bold uppercase text-white tracking-widest">Knowledge Graph</h2>
            <p className="text-white/20 max-w-md italic font-inter text-sm leading-relaxed">Mapping strategic inputs to execution outputs. Intelligence nodes surfacing.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#070B0F] text-[#F4F1ED] font-sans overflow-hidden relative">
      {/* --- DESKTOP SIDEBAR (≥1024px) --- */}
      <aside className="hidden xl:flex xl:col-span-2 bg-[#0A0A0A] border-r border-white/5 flex-col z-30 w-64">
        <div className="p-8 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard" className="w-10 h-10 rounded-[4px] bg-white/[0.03] flex items-center justify-center border border-white/10 group hover:border-[#1EC8A5]/30 transition-all cursor-pointer">
              <Cpu size={18} className="text-white/40 group-hover:text-[#1EC8A5] transition-colors" />
            </Link>
            <div className="flex flex-col">
              <img src="/assets/images/StrategyIQlogo_dark-mode.png" alt="StrategyIQ" className="h-5 w-auto" />
              <span className="text-[8px] tracking-[0.4em] text-white/10 uppercase font-bold mt-2">Diagnostic Engine</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-[4px] transition-all duration-300 group relative overflow-hidden text-left",
                activeItem === item.id 
                  ? "bg-white/[0.03] text-white" 
                  : "text-white/20 hover:bg-white/[0.01] hover:text-white/40"
              )}
            >
              <AnimatePresence>
                {activeItem === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#1EC8A5]" 
                  />
                )}
              </AnimatePresence>
              <item.icon size={16} className={cn(
                "transition-colors duration-300",
                activeItem === item.id ? "text-[#1EC8A5]" : "group-hover:text-white/40"
              )} />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-inter">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-[#0F1720] border border-white/5 rounded-[4px] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-white/10 tracking-[0.4em] uppercase font-inter">System Status</span>
              <div className="w-1 h-1 rounded-full bg-[#1EC8A5] opacity-40 animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 font-bold font-inter">Diagnostic Confidence</p>
                <p className="text-[10px] font-mono text-[#1EC8A5] tracking-widest uppercase">92%_OPT</p>
              </div>
              <div className="space-y-1">
                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20 font-bold font-inter">Model Version</p>
                <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">IQ_v2.4</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER (<1280px) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 xl:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col z-50 xl:hidden"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[4px] bg-white/[0.03] flex items-center justify-center border border-white/10">
                    <Cpu size={18} className="text-[#1EC8A5]" />
                  </div>
                  <img src="/assets/images/StrategyIQlogo_dark-mode.png" alt="StrategyIQ" className="h-5 w-auto" />
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-1 mt-4">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 rounded-[4px] transition-all duration-300 group relative text-left",
                      activeItem === item.id 
                        ? "bg-white/[0.03] text-white" 
                        : "text-white/20 hover:bg-white/[0.01]"
                    )}
                  >
                    <item.icon size={18} className={cn(
                      "transition-colors",
                      activeItem === item.id ? "text-[#1EC8A5]" : "group-hover:text-white/40"
                    )} />
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase font-inter">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-8 mt-auto">
                <div className="bg-[#0F1720] border border-white/5 rounded-[4px] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white/10 tracking-[0.4em] uppercase font-inter">System Status</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] opacity-40" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold">Confidence</p>
                      <p className="text-[11px] font-mono text-[#1EC8A5] tracking-widest">92%_OPTIMIZED</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 md:h-24 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-4 md:px-8 xl:px-12 z-20">
          <div className="flex items-center gap-4 md:gap-14">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 -ml-2 text-white/40 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden sm:block space-y-1.5">
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/10 font-bold font-inter">Client</p>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-[4px] bg-white/[0.03] flex items-center justify-center text-[8px] font-black italic border border-white/5 text-white/40">AC</div>
                <p className="text-[10px] md:text-[11px] font-bold text-white/60 tracking-widest uppercase font-inter">Acme Corp</p>
              </div>
            </div>
            <div className="hidden md:block h-10 w-px bg-white/5" />
            <div className="space-y-1.5">
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/10 font-bold font-inter">Phase</p>
              <div className="flex items-center gap-2 md:gap-3">
                <p className="text-[10px] md:text-[11px] font-bold text-[#FF6A5C]/60 tracking-widest uppercase font-inter">Discovery</p>
                <div className="w-1 h-1 rounded-full bg-[#FF6A5C] opacity-40 animate-pulse" />
              </div>
            </div>
            <div className="hidden lg:block h-10 w-px bg-white/5" />
            <div className="hidden lg:block space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/10 font-bold font-inter">Module</p>
              <p className="text-[11px] font-bold text-white/60 tracking-widest uppercase font-inter">Strategic Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            <div className="hidden lg:flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-[4px] border border-white/5">
              <Search size={14} className="text-white/20" />
              <input 
                type="text" 
                placeholder="Search engine..." 
                className="bg-transparent border-none text-[10px] focus:ring-0 w-32 xl:w-48 text-white/40 placeholder:text-white/10 uppercase tracking-widest"
              />
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <button className="text-white/20 hover:text-[#1EC8A5] transition-colors relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-[#FF6A5C]/60 rounded-full" />
              </button>
              <button className="hidden sm:block text-white/20 hover:text-[#1EC8A5] transition-colors">
                <Settings size={18} />
              </button>
              <div className="h-6 md:h-8 w-px bg-white/5" />
              <button className="flex items-center gap-2 md:gap-3 bg-white/[0.02] hover:bg-white/[0.04] px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] border border-white/5 transition-all">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#1EC8A5]/10 flex items-center justify-center text-[8px] font-bold text-[#1EC8A5]/60">LG</div>
                <User size={14} className="hidden md:block text-white/20" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            <footer className="pt-8 md:pt-12 pb-6 text-center border-t border-white/5 mt-8 md:mt-12">
              <p className="text-[8px] md:text-[10px] font-mono text-white/10 tracking-[0.4em] uppercase px-4">
                StrategyIQ Engine — Confidential Diagnostic Environment — © 2026 Luis Gilberto
              </p>
            </footer>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin-slow 12s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050505;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 211, 198, 0.2);
        }
      `}</style>
    </div>
  );
}
