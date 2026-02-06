'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard, History, ShieldCheck } from 'lucide-react';
import { AssessmentCategory } from '@/lib/strategyData';
import { cn } from '@/lib/utils';

interface NextStepCardProps {
  score: number;
  currentCategory: AssessmentCategory;
  onDashboard: () => void;
  onStartNext: (nextCategory: AssessmentCategory) => void;
  userRole: string;
  isPublished?: boolean;
  onPublish?: () => void;
}

export default function NextStepCard({ 
  score, 
  currentCategory, 
  onDashboard, 
  onStartNext,
  userRole,
  isPublished = false,
  onPublish
}: NextStepCardProps) {
  
  const getNextStep = () => {
    switch (currentCategory) {
      case 'gtm':
        return {
          id: 'brand' as AssessmentCategory,
          title: 'Brand Intelligence',
          message: "Your Go-to-Market strategy needs a voice. Let's Audit your Brand Intelligence."
        };
      case 'brand':
        return {
          id: 'campaign' as AssessmentCategory,
          title: 'Strategic Campaigns',
          message: "Your Brand is defined. Now let's see how you activate it with Strategic Campaigns."
        };
      case 'campaign':
        return {
          id: 'creative' as AssessmentCategory,
          title: 'Creative Strategy',
          message: "Campaigns need fuel. Let's check your Creative Strategy."
        };
      case 'creative':
        return null; // End of sequence
      default:
        return null;
    }
  };

  const nextStep = getNextStep();

  // Story / Narrative based on score
  const getStoryNarrative = () => {
    if (score > 80) return "Your strategic foundation is exceptionally strong. You've demonstrated a high degree of maturity and clarity in your current approach, positioning you perfectly for advanced, high-impact growth initiatives.";
    if (score > 50) return "You have a solid strategic base with clear opportunities for optimization. Your current path is viable, but refining key tactical elements will significantly accelerate your progress.";
    return "You are in the foundational stage of strategic development. This is a critical moment to establish the core systems and frameworks that will support your future growth and prevent costly missteps.";
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <Card className="bg-[#141414] border-white/10 shadow-2xl overflow-hidden text-center p-8">
        <CardHeader>
          {userRole !== 'CLIENT' ? (
            <div className="mx-auto w-24 h-24 rounded-full bg-[#0A0A0A] border-4 border-teal-500/20 flex items-center justify-center mb-6 relative">
              <span className="text-4xl font-bold text-white">{score}</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/5" />
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="none" className="text-teal-500" strokeDasharray="289" strokeDashoffset={289 - (289 * score) / 100} strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-6">
              <ShieldCheck className="text-teal-400" size={40} />
            </div>
          )}
          <CardTitle className="text-3xl text-white mb-2 font-big-shoulders tracking-widest uppercase italic">Assessment Complete</CardTitle>
          <p className="text-gray-400 font-inter">Your strategic intelligence has been captured.</p>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8 font-inter">
          {/* THE STORY (Client Only) */}
          {userRole === 'CLIENT' && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-left">
              <h3 className="text-[10px] font-bold text-teal tracking-widest uppercase mb-3 flex items-center gap-2">
                <History size={14} /> The story / Summary
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{getStoryNarrative()}"
              </p>
            </div>
          )}

          {/* STRATEGY STATUS (Client Only) */}
          {userRole === 'CLIENT' && (
            <div className="bg-coral/5 rounded-xl p-6 border border-coral/20 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-coral/5 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-coral tracking-widest uppercase flex items-center gap-2">
                  <ShieldCheck size={14} /> Strategy status
                </h3>
                <span className="text-[10px] font-bold bg-coral/20 text-coral px-2 py-0.5 rounded-full animate-pulse">
                  Review in progress
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                The Luis Gilberto strategy team is currently analyzing your inputs. A refined, human-vetted plan of action will be published here within 24 hours.
              </p>
            </div>
          )}

          {/* FINAL PLAN / NEXT STEPS - Only if Published or Internal */}
          {(isPublished || userRole !== 'CLIENT') ? (
            nextStep ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/5 animate-in fade-in duration-1000">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center justify-center gap-2 font-serif italic">
                  Final plan of action
                </h3>
                <p className="text-gray-300 italic mb-6">"{nextStep.message}"</p>
                
                <div className="flex gap-4 justify-center">
                  <Button variant="strategy-secondary" onClick={onDashboard} className="px-6 h-10">
                    Return to dashboard
                  </Button>
                  <Button 
                    variant="strategy-primary"
                    onClick={() => onStartNext(nextStep.id)}
                    className="gap-2 px-6 h-10"
                  >
                    Start {nextStep.title} <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ) : (
               <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-lg font-medium text-white mb-2 font-serif italic">All systems go</h3>
                <p className="text-gray-300 italic mb-6">You have completed the full strategic assessment suite.</p>
                
                <Button variant="strategy-primary" onClick={onDashboard} className="gap-2 px-8 h-10">
                  <LayoutDashboard size={16} /> Return to dashboard
                </Button>
              </div>
            )
          ) : (
            /* Admin Publish Toggle for Admin View (Placeholder for now) */
            userRole !== 'CLIENT' && (
              <div className="p-4 border border-dashed border-white/10 rounded-xl">
                 <Button 
                    onClick={onPublish}
                    variant="strategy-primary"
                    className="w-full h-12"
                 >
                    Publish final plan to partner
                 </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
