'use client';

import { useEffect, useState } from 'react';
import { knowledgeBase } from '@/app/(portal)/strategy-iq/knowledgeBase';

// 1. Glossary Data
const GLOSSARY_TERMS: Record<string, string> = {
  "ICP": "Ideal Customer Profile: A hypothetical description of the type of company that would realize the most value from your product or solution.",
  "GTM": "Go-To-Market: The plan of an organization, utilizing their outside resources (e.g., sales force and distributors), to deliver their unique value proposition to customers and achieve competitive advantage.",
  "ROI": "Return on Investment: A performance measure used to evaluate the efficiency or profitability of an investment.",
  "KPI": "Key Performance Indicator: A measurable value that demonstrates how effectively a company is achieving key business objectives."
};

// 2. Glossary Modal Component
function GlossaryModal({ term, definition, onClose }: { term: string, definition: string, onClose: () => void }) {
    if (!term) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-[var(--card-bg)] border border-[var(--coral)] p-6 rounded-xl max-w-sm w-full shadow-2xl m-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[var(--coral)]">{term}</h3>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <p className="text-[var(--text-primary)] leading-relaxed">{definition}</p>
            </div>
        </div>
    );
}

// 3. SmartText Component
function SmartText({ text, onTermClick }: { text: string, onTermClick: (term: string) => void }) {
    if (!text) return null;
    
    // Create regex pattern from terms
    const terms = Object.keys(GLOSSARY_TERMS);
    const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'g');
    
    const parts = text.split(pattern);
    
    return (
        <span>
            {parts.map((part, i) => {
                if (terms.includes(part)) {
                    return (
                        <span 
                            key={i} 
                            className="text-[var(--teal)] font-bold cursor-help border-b border-dashed border-[var(--teal)] hover:bg-[var(--teal)]/10 transition-colors"
                            onClick={() => onTermClick(part)}
                        >
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </span>
    );
}

interface ConsultantCopilotProps {
  assessmentType: string;
  currentQuestion?: any; // Using any for flexibility with the question object structure
}

export function ConsultantCopilot({ assessmentType, currentQuestion }: ConsultantCopilotProps) {
  const [insight, setInsight] = useState<{ title: string; points: string[] } | null>(null);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  useEffect(() => {
    // Fallback to static KB if no current question context (legacy behavior)
    if (!currentQuestion && assessmentType && knowledgeBase[assessmentType as keyof typeof knowledgeBase]) {
      setInsight(knowledgeBase[assessmentType as keyof typeof knowledgeBase]);
    } else {
      setInsight(null);
    }
  }, [assessmentType, currentQuestion]);

  const handleTermClick = (term: string) => {
      setActiveTerm(term);
  };

  return (
    <>
        <div className="bg-[var(--card-bg)] border-l border-[var(--border-strong)] h-full p-6 hidden lg:block animate-in slide-in-from-right duration-700">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
              <h2 className="font-big-shoulders text-xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
                Consultant Copilot
              </h2>
            </div>

            {currentQuestion?.consultantContext ? (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Consultant Script Section */}
                    <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] shadow-sm">
                      <h3 className="text-[var(--coral)] font-semibold mb-3 text-sm uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">
                        <i className="fas fa-comment-alt mr-2"></i>Consultant Script
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                          "<SmartText text={currentQuestion.consultantContext.script} onTermClick={handleTermClick} />"
                      </p>
                    </div>

                    {/* Listening Cues Section */}
                    {currentQuestion.consultantContext.listeningCues && (
                        <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] shadow-sm">
                          <h3 className="text-[var(--teal)] font-semibold mb-3 text-sm uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">
                            <i className="fas fa-headphones mr-2"></i>Listening Cues
                          </h3>
                          <ul className="space-y-3">
                            {currentQuestion.consultantContext.listeningCues.map((cue: string, i: number) => {
                                const isRedFlag = cue.toLowerCase().includes('red flag');
                                const isGreenFlag = cue.toLowerCase().includes('green flag');
                                const isUpsell = cue.toLowerCase().includes('upsell');
                                
                                let iconColor = "text-[var(--text-muted)]";
                                let icon = "fa-circle";
                                
                                if (isRedFlag) { iconColor = "text-red-500"; icon = "fa-exclamation-triangle"; }
                                else if (isGreenFlag) { iconColor = "text-green-500"; icon = "fa-check-circle"; }
                                else if (isUpsell) { iconColor = "text-[var(--coral)]"; icon = "fa-dollar-sign"; }

                                return (
                                  <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-3 items-start">
                                    <i className={`fas ${icon} ${iconColor} mt-1 text-xs`}></i>
                                    <span><SmartText text={cue} onTermClick={handleTermClick} /></span>
                                  </li>
                                );
                            })}
                          </ul>
                        </div>
                    )}
                    
                    {/* Insight Section */}
                     {currentQuestion.consultantContext.insight && (
                        <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] shadow-sm">
                           <h3 className="text-[var(--text-primary)] font-semibold mb-2 text-sm uppercase tracking-wider">
                            <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>Strategic Insight
                          </h3>
                           <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                             {currentQuestion.consultantContext.insight}
                           </p>
                        </div>
                     )}
                  </div>
            ) : insight ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] shadow-sm">
                  <h3 className="text-[var(--coral)] font-semibold mb-3 text-sm uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2">
                    {insight.title}
                  </h3>
                  <ul className="space-y-3">
                    {insight.points.map((point, i) => (
                      <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2 items-start">
                        <span className="text-[var(--teal)] mt-1 text-xs">●</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] shadow-sm">
                   <h3 className="text-[var(--text-primary)] font-semibold mb-2 text-sm uppercase tracking-wider">
                    Live Analysis
                  </h3>
                   <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                     AI is monitoring assessment inputs. Real-time strategic recommendations will appear here as data is collected.
                   </p>
                </div>
              </div>
            ) : (
              <div className="text-[var(--text-secondary)] text-sm space-y-4">
                <p className="font-medium text-[var(--text-muted)]">Waiting for assessment context...</p>
                <div className="p-4 rounded-xl bg-[var(--bg-alt)] border border-[var(--border-subtle)] opacity-40">
                   <div className="h-3 bg-[var(--border-strong)] rounded w-1/3 mb-3"></div>
                   <div className="space-y-2">
                       <div className="h-2 bg-[var(--border-strong)] rounded w-full"></div>
                       <div className="h-2 bg-[var(--border-strong)] rounded w-5/6"></div>
                       <div className="h-2 bg-[var(--border-strong)] rounded w-4/6"></div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Glossary Modal */}
        {activeTerm && (
            <GlossaryModal 
                term={activeTerm} 
                definition={GLOSSARY_TERMS[activeTerm] || "Definition not found."} 
                onClose={() => setActiveTerm(null)} 
            />
        )}
    </>
  );
}
