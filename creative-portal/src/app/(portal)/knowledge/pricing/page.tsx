'use client';

import React, { useState, useEffect } from 'react';
import styles from './pricing.module.css';
import { Search, ChevronDown, Copy, Calculator, Rocket, Target, Diamond } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const sections = [
  { id: 'overview', label: 'Quick Reference' },
  { id: 'tiers', label: 'Detailed Tiers' },
  { id: 'justification', label: 'Price Justification' },
  { id: 'competition', label: 'Market Comparison' },
  { id: 'objections', label: 'Objection Handling' },
  { id: 'scripts', label: 'Ready Scripts' },
  { id: 'roi', label: 'ROI Calculator' }
];

const searchData = [
  { title: "Quick-Start Sprint Pricing", content: "$3K - $8K for 2-4 weeks strategic foundation", section: "tiers" },
  { title: "Strategic Planning Pricing", content: "$8K - $18K for 6-10 weeks comprehensive strategy", section: "tiers" },
  { title: "Strategic Intelligence Pricing", content: "$15K - $30K for 4-8 weeks advanced intelligence", section: "tiers" },
  { title: "Objection Handling", content: "Scripts for why pricing is competitive", section: "objections" },
  { title: "ROI Calculator", content: "Calculate return on investment", section: "roi" }
];

export default function PricingKnowledgeBase() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roiResult, setRoiResult] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user?.role === 'CLIENT')) {
      redirect('/dashboard');
    }
  }, [session, status]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.find(s => s.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Script copied to clipboard!");
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
    ? searchData.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Pricing Knowledge Base</h1>
        <p>Consultant Access Only • Proprietary Data</p>

        <div className={styles.searchBar}>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search scripts, pricing, or objections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredResults.length > 0 && (
            <div className={styles.searchResults}>
              {filteredResults.map((res, idx) => (
                <div key={idx} className={styles.searchResultItem} onClick={() => { setActiveTab(res.section); setSearchTerm(''); }}>
                  <div className="text-[#F96F6E] font-bold text-sm">{res.title}</div>
                  <div className="text-gray-400 text-xs">{res.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.quickAccess}>
          {sections.slice(0, 5).map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`${styles.quickBtn} ${activeTab === section.id ? styles.quickBtnActive : ''}`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.sidebar}>
          <h3>NAVIGATION</h3>
          <ul className={styles.navMenu}>
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveTab(section.id)}
                  className={`${styles.navBtn} ${activeTab === section.id ? styles.navBtnActive : ''}`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-screen">
          {(activeTab === 'overview' || activeTab === 'tiers') && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={styles.sectionTitle}>Pricing Structure</h2>
              <div className={styles.pricingTiers}>
                <div className={styles.tierCard}>
                  <div className="flex items-center gap-2 mb-4 text-[#F96F6E]">
                    <Rocket size={20} /> <span className="font-bold tracking-widest text-xs uppercase">Sprint</span>
                  </div>
                  <div className={styles.tierTitle}>Quick-Start</div>
                  <div className={styles.tierPrice}>$3K - $8K</div>
                  <ul className={styles.tierFeatures}>
                    <li>Strategic foundation assessment</li>
                    <li>Creative strategy framework</li>
                    <li>90-day implementation roadmap</li>
                  </ul>
                </div>

                <div className={`${styles.tierCard} ${styles.tierCardPopular}`}>
                  <div className="absolute top-0 right-0 bg-[#F96F6E] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                  <div className="flex items-center gap-2 mb-4 text-[#2ED3C6]">
                    <Target size={20} /> <span className="font-bold tracking-widest text-xs uppercase">Strategy</span>
                  </div>
                  <div className={styles.tierTitle}>Strategic Planning</div>
                  <div className={styles.tierPrice}>$8K - $18K</div>
                  <ul className={styles.tierFeatures}>
                    <li>Comprehensive market analysis</li>
                    <li>Messaging architecture</li>
                    <li>Multi-channel campaign strategy</li>
                    <li>6-month growth roadmap</li>
                  </ul>
                </div>

                <div className={styles.tierCard}>
                  <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Diamond size={20} /> <span className="font-bold tracking-widest text-xs uppercase">Enterprise</span>
                  </div>
                  <div className={styles.tierTitle}>Strategic Intelligence</div>
                  <div className={styles.tierPrice}>$15K - $30K</div>
                  <ul className={styles.tierFeatures}>
                    <li>Advanced intelligence systems</li>
                    <li>Predictive trend modeling</li>
                    <li>Cross-channel optimization</li>
                    <li>Long-term intelligence roadmap</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={styles.sectionTitle}>ROI Calculator</h2>
              <form onSubmit={calculateROI} className={styles.roiCalculator}>
                <div className="flex items-center gap-2 mb-6 text-white">
                  <Calculator size={24} /> <span className="font-bold text-xl">Project Value Estimator</span>
                </div>
                <div className={styles.roiInputs}>
                  <div className={styles.roiInput}>
                    <label className="text-sm font-bold mb-2 block">Marketing Budget ($)</label>
                    <input name="budget" type="number" placeholder="50000" required />
                  </div>
                  <div className={styles.roiInput}>
                    <label className="text-sm font-bold mb-2 block">Improvement Target (%)</label>
                    <input name="improvement" type="number" placeholder="20" required />
                  </div>
                  <div className={styles.roiInput}>
                    <label className="text-sm font-bold mb-2 block">Project Cost ($)</label>
                    <input name="investment" type="number" placeholder="15000" required />
                  </div>
                </div>
                <button type="submit" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors mt-4">
                  Calculate ROI
                </button>

                {roiResult && (
                  <div className="mt-8 p-6 bg-black/20 rounded-xl border border-white/10">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xs text-gray-300 uppercase tracking-widest">ROI</div>
                        <div className="text-3xl font-bold text-[#2ED3C6]">{roiResult.roi}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-300 uppercase tracking-widest">Revenue</div>
                        <div className="text-xl font-bold text-white">${roiResult.revenue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-300 uppercase tracking-widest">Net Profit</div>
                        <div className="text-xl font-bold text-white">${roiResult.net}</div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {(activeTab === 'objections' || activeTab === 'scripts') && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={styles.sectionTitle}>Scripts & Handling</h2>

              <div className={styles.copyScript}>
                <button onClick={() => handleCopy("My pricing reflects 15+ years of hands-on Microsoft ecosystem experience...")} className={styles.copyBtn}>
                  <Copy size={14} /> Copy
                </button>
                <h4 className="text-[#2ED3C6] font-bold mb-2">"Why is it more expensive than a freelancer?"</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "My pricing reflects 15+ years of hands-on Microsoft ecosystem experience. You aren't paying for hours; you are paying for a proven framework that has scaled products to 50M+ users. A freelancer executes tasks; I provide the strategic intelligence to ensure those tasks actually generate revenue."
                </p>
              </div>

              <div className={styles.copyScript}>
                <button onClick={() => handleCopy("We can adjust scope to fit the budget, but we cannot lower the value...")} className={styles.copyBtn}>
                  <Copy size={14} /> Copy
                </button>
                <h4 className="text-[#2ED3C6] font-bold mb-2">"Can we get a discount?"</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "We can adjust the scope to fit your budget, but we don't discount the rate. If $15K is too high, we can look at the Quick-Start Sprint ($5K) which gives you the roadmap to execute internally. Which approach serves your timeline best?"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
