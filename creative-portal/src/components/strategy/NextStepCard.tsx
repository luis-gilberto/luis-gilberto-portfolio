import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { AssessmentCategory } from '@/lib/strategyData';

interface NextStepCardProps {
  score: number;
  currentCategory: AssessmentCategory;
  onDashboard: () => void;
  onStartNext: (nextCategory: AssessmentCategory) => void;
}

export default function NextStepCard({ 
  score, 
  currentCategory, 
  onDashboard, 
  onStartNext 
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

  return (
    <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <Card className="bg-[#141414] border-white/10 shadow-2xl overflow-hidden text-center p-8">
        <CardHeader>
          <div className="mx-auto w-24 h-24 rounded-full bg-[#0A0A0A] border-4 border-teal-500/20 flex items-center justify-center mb-6 relative">
            <span className="text-4xl font-bold text-white">{score}</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/5" />
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="none" className="text-teal-500" strokeDasharray="289" strokeDashoffset={289 - (289 * score) / 100} strokeLinecap="round" />
            </svg>
          </div>
          <CardTitle className="text-3xl text-white mb-2">Assessment Complete</CardTitle>
          <p className="text-gray-400">Your strategic intelligence has been captured.</p>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          {nextStep ? (
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-medium text-white mb-2">Recommended Next Step</h3>
              <p className="text-gray-300 italic mb-6">"{nextStep.message}"</p>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={onDashboard} className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                  Return to Dashboard
                </Button>
                <Button 
                  onClick={() => onStartNext(nextStep.id)}
                  className="bg-coral hover:bg-coral/90 text-white gap-2"
                >
                  Start {nextStep.title} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
             <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-medium text-white mb-2">All Systems Go</h3>
              <p className="text-gray-300 italic mb-6">You have completed the full strategic assessment suite.</p>
              
              <Button onClick={onDashboard} className="bg-white/10 hover:bg-white/20 text-white gap-2">
                <LayoutDashboard size={16} /> Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
