'use client';

import React, { useState, useEffect } from 'react';
import styles from './pricing.module.css';
import { Search, ChevronDown, Copy, Calculator, Rocket, Target, Diamond, ShieldCheck, HelpCircle, X, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useToast } from '@/components/providers/toast-provider';
import { 
  pricingTiers, 
  objectionScripts, 
  readyScripts, 
  marketComparison, 
  methodologyJustification,
  roiLogicBriefing,
  priceJustificationRationale,
  kbSearchIndex 
} from '@/features/pricingKb/pricingKbContent';

const sections = [
  { id: 'service-tiers', label: 'Service Tiers', icon: ShieldCheck },
  { id: 'strategic-rationale', label: 'Strategic Rationale', icon: Rocket },
  { id: 'sales-intelligence', label: 'Sales Intelligence', icon: Target },
  { id: 'roi', label: 'ROI Calculator', icon: Calculator }
];

export default function PricingKbPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('service-tiers');
  const [searchTerm, setSearchTerm] = useState('');
  const [roiResult, setRoiResult] = useState<any>(null);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [showJustification, setShowJustification] = useState(false);
  const [showRoiBriefing, setShowRoiBriefing] = useState(false);
  const [showRationale, setShowRationale] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user?.role === 'CLIENT') || (session?.user?.role === 'PARTNER')) {
      redirect('/dashboard');
    }
  }, [session, status]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.find(s => s.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("SCRIPT COPIED", "Strategy secured to strategist clipboard.", "success");
  };

  const calculateROI = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const budget = parseFloat((form.elements.namedItem('budget') as HTMLInputElement).value);
    const improvement = parseFloat((form.elements.namedItem('improvement') as HTMLInputElement).value);
    const investment = parseFloat((form.elements.namedItem('investment') as HTMLInputElement).value);

    if (budget && improvement && investment) {
      const revenue = budget * (improvement / 100);
      const roi = ((revenue - investment) / investment) * 100;
      setRoiResult({ roi: roi.toFixed(0), revenue: revenue.toLocaleString(), net: (revenue - investment).toLocaleString() });
    }
  };

  const filteredResults = searchTerm.length > 1
    ? kbSearchIndex.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-white">LG <span className="text-gray-500">/</span> PORTAL</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2ED3C6]/10 px-3 py-1 rounded-full border border-[#2ED3C6]/20">
            <div className="w-2 h-2 rounded-full bg-[#2ED3C6] animate-pulse" />
            <span className="text-[10px] font-bold text-[#2ED3C6] tracking-widest uppercase">COMMAND</span>
          </div>
        </div>

        <h1>Pricing <span className="text-white/20">Knowledge Base</span></h1>
        <p>Tactical Reference Tool • Proprietary Intelligence Data</p>

        <div className={styles.searchBar}>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search scripts, leverage points, or rationale..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredResults.length > 0 && (
            <div className={styles.searchResults}>
              {filteredResults.map((res, idx) => (
                <div key={idx} className={styles.searchResultItem} onClick={() => { 
                  setActiveTab(res.key); 
                  if (res.title.includes("Trap") || res.title.includes("Box") || res.title.includes("Mill") || res.title.includes("Gap")) {
                    setShowJustification(true);
                  }
                  if (res.title.includes("Multiplier") || res.title.includes("Payback") || res.title.includes("Leverage") || res.key === 'roi') {
                    setShowRoiBriefing(true);
                  }
                  if (res.title.includes("Shortcut") || res.title.includes("Clarity") || res.title.includes("GPS") || res.title.includes("Microsoft") || res.key === 'strategic-rationale') {
                    setShowRationale(true);
                  }
                  setSearchTerm(''); 
                }}>
                  <div className="text-[10px] font-bold text-[#F96F6E] uppercase mb-1">{res.key.replace('-', ' ')}</div>
                  <div className="text-sm font-bold text-white">{res.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{res.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.contentGrid}>
        <aside className={styles.sidebar}>
          <h3>TACTICAL NAVIGATION</h3>
          <nav className={styles.navMenu}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <button
                    className={`${styles.navBtn} ${activeTab === section.id ? styles.navBtnActive : ''}`}
                    onClick={() => setActiveTab(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      {section.label}
                    </div>
                  </button>
                </li>
              );
            })}
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {activeTab === 'service-tiers' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={styles.sectionTitle}>
                <span>Service Tiers</span>
                <span className="text-[10px] text-white/20">CONSULTANT CONTEXT: HOW TO POSITION</span>
              </div>
              <div className={styles.pricingTiers}>
                {pricingTiers.map((tier) => (
                  <div 
                    key={tier.id} 
                    className={`${styles.tierCard} ${expandedTier === tier.id ? styles.tierCardActive : ''}`}
                    onClick={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
                  >
                    <div className={styles.tierHeader}>
                      <div>
                        <h3 className={styles.tierTitle}>{tier.name}</h3>
                        <p className={styles.tierDescription}>{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={styles.tierPrice}>{tier.price}</div>
                        <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{tier.duration}</div>
                      </div>
                    </div>

                    {expandedTier === tier.id && (
                      <div className={styles.tierDetails}>
                        <div className={styles.detailSection}>
                          <h4>Week:by:Week Breakdown</h4>
                          <p className={styles.detailContent}>{tier.breakdown}</p>
                          <ul className={styles.tierFeatures}>
                            {tier.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                        <div className={styles.detailSection}>
                          <h4>Quoting Guidance</h4>
                          <p className={styles.detailContent}>{tier.quotingGuidance}</p>
                          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-[10px] font-bold text-[#F96F6E] uppercase block mb-1">Strategist Note</span>
                            <p className="text-[11px] italic text-white/40">
                              Position as a shortcut to clarity, not a billable service. The value is the 15 years of rigor compressed into this timeline.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategic-rationale' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={styles.sectionTitle}>
                <span>Strategic Rationale</span>
                <div className="flex gap-2">
                  <button onClick={() => setShowJustification(true)} className="p-1 hover:text-[#2ED3C6] transition-colors"><Info size={18} /></button>
                  <button onClick={() => setShowRationale(true)} className="p-1 hover:text-[#2ED3C6] transition-colors"><HelpCircle size={18} /></button>
                </div>
              </div>
              <div className={styles.rationaleGrid}>
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Market Comparison</h3>
                  <div className="grid gap-3">
                    {marketComparison.map((item, i) => (
                      <div key={i} className={styles.rationaleCard}>
                        <h4>{item.category}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-[9px] uppercase text-white/20 font-bold block mb-1">Traditional</span>
                            <p className="text-xs text-white/40">{item.traditional}</p>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-[#2ED3C6] font-bold block mb-1">StrategyIQ</span>
                            <p className="text-xs text-white/80">{item.strategyIq}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Methodology Justification</h3>
                  <div className="grid gap-3">
                    {methodologyJustification.map((item) => (
                      <div key={item.id} className={styles.rationaleCard}>
                        <h4>{item.title}</h4>
                        <p className={styles.rationaleContent}>{item.pain}</p>
                        <div className="mt-3 pt-3 border-t border-white/5 text-[#2ED3C6] text-xs italic">
                          {item.antidote}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales-intelligence' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={styles.sectionTitle}>
                <span>Sales Intelligence</span>
                <span className="text-[10px] text-white/20">TACTICAL SCRIPTS & OBJECTION HANDLING</span>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Objection Handling</h3>
                  <div className="grid gap-4">
                    {objectionScripts.map((item) => (
                      <div key={item.id} className={styles.intelligenceCard}>
                        <span className={styles.intelligenceTag}>{item.technique}</span>
                        <h4>{item.objection}</h4>
                        <p className="text-xs text-white/40 leading-relaxed mb-4">{item.response}</p>
                        <button onClick={() => handleCopy(item.response)} className={styles.copyBtn}>Copy Script</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ready Scripts</h3>
                  <div className="grid gap-4">
                    {readyScripts.map((item) => (
                      <div key={item.id} className={styles.intelligenceCard}>
                        <span className={styles.intelligenceTag}>{item.purpose}</span>
                        <h4>{item.scenario}</h4>
                        <p className="text-xs text-white/40 leading-relaxed mb-4 italic">"{item.script}"</p>
                        <button onClick={() => handleCopy(item.script)} className={styles.copyBtn}>Copy Script</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={styles.sectionTitle}>
                <span>ROI Calculator</span>
                <button onClick={() => setShowRoiBriefing(true)} className="p-1 hover:text-[#2ED3C6] transition-colors"><Info size={18} /></button>
              </div>
              <div className={styles.roiCalculator}>
                <form onSubmit={calculateROI} className="grid md:grid-cols-3 gap-6">
                  <div className={styles.roiInput}>
                    <label>Current Budget</label>
                    <input type="number" name="budget" placeholder="$0" required />
                  </div>
                  <div className={styles.roiInput}>
                    <label>Projected Lift (%)</label>
                    <input type="number" name="improvement" placeholder="10%" required />
                  </div>
                  <div className={styles.roiInput}>
                    <label>Investment</label>
                    <input type="number" name="investment" placeholder="$0" required />
                  </div>
                  <div className="md:col-span-3">
                    <button type="submit" className="w-full bg-[#F96F6E] hover:bg-[#F96F6E]/90 text-white py-3 rounded-xl font-bold uppercase tracking-widest transition-all">
                      Calculate Yield
                    </button>
                  </div>
                </form>

                {roiResult && (
                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                    <div>
                      <span className="text-[9px] font-bold text-white/20 uppercase block mb-1">Projected ROI</span>
                      <div className="text-2xl font-black text-[#2ED3C6] font-display">{roiResult.roi}%</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-white/20 uppercase block mb-1">Revenue Delta</span>
                      <div className="text-2xl font-black text-white font-display">${roiResult.revenue}</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-white/20 uppercase block mb-1">Net Yield</span>
                      <div className="text-2xl font-black text-white font-display">${roiResult.net}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Methodology Justification Drawer */}
      {showJustification && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJustification(false)} />
          <div className="relative w-full max-w-2xl bg-[#0A0A0A] border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2ED3C6] animate-pulse" />
                  <h3 className="font-display text-xl tracking-widest text-white uppercase">STRATEGYIQ™ VS THE MARKET: THE EVIDENCE</h3>
                </div>
                <button onClick={() => setShowJustification(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {methodologyJustification.map((item) => (
                  <div key={item.id} className="border-b border-white/5 pb-8 last:border-0">
                    <div className="text-[10px] font-bold text-[#2ED3C6] uppercase tracking-[0.2em] mb-4">{item.category}</div>
                    <h4 className="font-display text-3xl text-white mb-6 italic">{item.title}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest">The Pain</div>
                        <p className="text-gray-400 text-sm leading-relaxed font-sans">{item.pain}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-[#2ED3C6] uppercase tracking-widest">The Antidote</div>
                        <p className="text-white text-sm leading-relaxed font-sans font-medium">{item.antidote}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-500 text-xs italic text-center font-sans">
                  "The goal is not to win an argument, but to reveal the objective risk of person-dependent, opaque methodologies."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROI Logic Briefing Drawer */}
      {showRoiBriefing && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRoiBriefing(false)} />
          <div className="relative w-full max-w-2xl bg-[#0A0A0A] border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2ED3C6] animate-pulse" />
                  <h3 className="font-display text-xl tracking-widest text-white uppercase">ROI ARCHITECTURE: DEFENDING THE INVESTMENT</h3>
                </div>
                <button onClick={() => setShowRoiBriefing(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {roiLogicBriefing.map((item) => (
                  <div key={item.id} className="border-b border-white/5 pb-8 last:border-0">
                    <h4 className="font-display text-3xl text-white mb-6 italic">{item.title}</h4>
                    
                    <div className="space-y-6">
                      <p className="text-zinc-300 text-sm leading-relaxed font-sans">{item.content}</p>
                      
                      {item.consultantScript && (
                        <div className="bg-white/5 p-6 rounded-xl border border-[#2ED3C6]/20 relative group">
                          <button 
                            onClick={() => handleCopy(item.consultantScript!)}
                            className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-lg text-gray-400"
                          >
                            <Copy size={16} />
                          </button>
                          <div className="text-[10px] font-bold text-[#2ED3C6] uppercase tracking-widest mb-3">Consultant Script</div>
                          <p className="text-white text-sm leading-relaxed font-sans italic">
                            "{item.consultantScript}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-500 text-xs italic text-center font-sans">
                  "Strategy is a cost only if it fails. When it works, it is the highest-yielding asset on the balance sheet."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Justification Rationale Drawer */}
      {showRationale && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRationale(false)} />
          <div className="relative w-full max-w-2xl bg-[#0A0A0A] border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2ED3C6] animate-pulse" />
                  <h3 className="font-display text-xl tracking-widest text-white uppercase">FRAMEWORK EVIDENCE: WHY WE ARE DIFFERENT</h3>
                </div>
                <button onClick={() => setShowRationale(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                {priceJustificationRationale.map((item) => (
                  <div key={item.id} className="border-b border-white/5 pb-8 last:border-0">
                    <h4 className="font-display text-3xl text-white mb-6 italic">{item.title}</h4>
                    
                    <div className="space-y-6">
                      <p className="text-zinc-300 text-sm leading-relaxed font-sans">{item.content}</p>
                      
                      <div className="bg-white/5 p-6 rounded-xl border border-[#2ED3C6]/20 relative group">
                        <button 
                          onClick={() => handleCopy(item.talkingPoint)}
                          className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-lg text-gray-400"
                        >
                          <Copy size={16} />
                        </button>
                        <div className="text-[10px] font-bold text-[#2ED3C6] uppercase tracking-widest mb-3">Talking Point</div>
                        <p className="text-white text-sm leading-relaxed font-sans italic">
                          "{item.talkingPoint}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-500 text-xs italic text-center font-sans">
                  "You aren't paying for my time; you are paying for the 15 years it took me to learn how to do in 1 week what takes others 3 months."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
