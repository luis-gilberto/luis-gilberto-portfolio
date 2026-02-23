
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Bot, 
  Lightbulb, 
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Users,
  Lock,
  Unlock,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  assessmentQuestions, 
  AssessmentCategory, 
  AssessmentQuestion 
} from '@/lib/strategyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/providers/toast-provider';

import NextStepCard from './NextStepCard';
import ConsultantCopilot from './ConsultantCopilot';

interface AssessmentRunnerProps {
  category: AssessmentCategory;
  initialAnswers?: Record<string, number>;
  onComplete: (result: { score: number; answers: Record<string, number> }) => void;
  onClose: () => void;
  onStartNext?: (nextCategory: AssessmentCategory) => void;
  userRole: string;
  isPublished?: boolean;
  onPublish?: () => void;
  projectId?: string;
  readOnly?: boolean;
  onEdit?: () => void;
}

export default function AssessmentRunner({ 
  category, 
  initialAnswers = {},
  onComplete, 
  onClose,
  onStartNext,
  userRole,
  isPublished = false,
  onPublish,
  projectId,
  readOnly = false,
  onEdit
}: AssessmentRunnerProps) {
  const { toast } = useToast()

  const logAudit = async (eventType: string, payload: any) => {
    if (!projectId) return;
    try {
      await fetch('/api/strategy-iq/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          payload,
          projectId,
          category
        })
      });
    } catch (e) {
      console.error("Audit log failed", e);
    }
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Task 3: Assessment Instance Initialization
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Real-Time Collaboration State
  const [partnerActive, setPartnerActive] = useState(false);
  const [consultantSuggestion, setConsultantSuggestion] = useState<{value: string, score: number} | null>(null);
  const [authorityLocked, setAuthorityLocked] = useState(userRole !== 'CLIENT'); // Consultant locked by default
  const [showAuthorityRequest, setShowAuthorityRequest] = useState(false); // For Client to see
  const supabaseRef = useRef<any>(null);
  const channelRef = useRef<any>(null);

  const analysisRef = useRef<HTMLDivElement>(null);

  const questions = assessmentQuestions[category];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize Supabase Realtime
  useEffect(() => {
    if (!projectId) return;

    // Task 3: Initialize Assessment Instance
    const initSession = async () => {
      setIsInitializing(true);
      try {
        const res = await fetch('/api/strategy-iq/assessment-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, dimension: category })
        });
        
        if (res.ok) {
          const data = await res.json();
          setSessionId(data.sessionId);
          
          // Restore progress if available
          if (data.responses && Object.keys(data.responses).length > 0) {
            setAnswers(data.responses);
          }
          if (typeof data.currentQuestion === 'number' && data.currentQuestion > 0 && data.currentQuestion < totalQuestions) {
             setCurrentQuestionIndex(data.currentQuestion);
          }
        } else {
           // Retry mechanism or error handling
           console.error("Initialization failed with status:", res.status);
        }
      } catch (error) {
        console.error("Failed to initialize assessment session:", error);
      } finally {
         setIsInitializing(false);
      }
    };

    initSession();

    // Use environment variables for Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      supabaseRef.current = supabase;

      const channel = supabase.channel(`assessment:${projectId}:${category}`, {
        config: {
          presence: {
            key: userRole,
          },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          const hasClient = Object.keys(newState).some(key => key.includes('CLIENT'));
          const hasConsultant = Object.keys(newState).some(key => key !== 'CLIENT'); // Assuming 'ADMIN' or other roles
          
          // Determine if partner is active based on *other* role presence
          if (userRole === 'CLIENT') {
            setPartnerActive(hasConsultant);
          } else {
            setPartnerActive(hasClient);
          }
        })
        .on('broadcast', { event: 'selection' }, (payload) => {
          // If Consultant receives selection from Client -> Update immediately
          if (userRole !== 'CLIENT' && payload.role === 'CLIENT') {
            setSelectedOptionValue(payload.value);
            setAnswers(prev => ({ ...prev, [payload.questionId]: payload.score }));
            setConsultantSuggestion(null); // Clear suggestion if client made a choice
          }
          // If Client receives selection from Consultant -> Show as suggestion
          else if (userRole === 'CLIENT' && payload.role !== 'CLIENT') {
             setConsultantSuggestion({ value: payload.value, score: payload.score });
             toast("Consultant Suggestion", "Your strategist has recommended an option.", "default");
          }
        })
        .on('broadcast', { event: 'navigation' }, (payload) => {
          // If Consultant receives nav from Client -> Follow
          if (userRole !== 'CLIENT' && payload.role === 'CLIENT') {
            setCurrentQuestionIndex(payload.index);
          }
          // Client does NOT follow Consultant navigation automatically (as per req)
        })
        .on('broadcast', { event: 'authority_request' }, (payload) => {
          if (userRole === 'CLIENT') {
            setShowAuthorityRequest(true);
          }
        })
        .on('broadcast', { event: 'authority_grant' }, (payload) => {
          if (userRole !== 'CLIENT') {
            setAuthorityLocked(false);
            toast("Authority Granted", "You may now submit the assessment.", "success");
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ role: userRole, online_at: new Date().toISOString() });
          }
        });

      channelRef.current = channel;

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId, category, userRole, toast]);

  // Restore selection if answer exists
  useEffect(() => {
    const savedScore = answers[currentQuestion.id];
    if (savedScore !== undefined) {
      const option = currentQuestion.options.find(o => o.score === savedScore);
      if (option) {
        setSelectedOptionValue(option.value);
      }
    } else {
      setSelectedOptionValue(null);
    }
    // Clear suggestion when changing questions
    setConsultantSuggestion(null);
  }, [currentQuestionIndex, currentQuestion, answers]);

  const handleOptionSelect = async (value: string, score: number) => {
    if (readOnly) return;
    
    // Log the selection
    logAudit('SELECTION_MADE', { questionId: currentQuestion.id, value, score });

    // Broadcast the selection
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'selection',
        payload: { 
          role: userRole, 
          value, 
          score, 
          questionId: currentQuestion.id 
        },
      });
    }

    // If Client OR Consultant (Solo), apply immediately.
    // Task 1: Resolve "Dashed Line" Leakage - Admin selection should be solid (selected), not dashed (suggested) locally.
    setSelectedOptionValue(value);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }));
    setConsultantSuggestion(null); // Clear suggestion if overridden

    // If it's a Consultant suggesting to a Client, the Client will see it via broadcast.
    // The Consultant will see their own selection as "selected" (solid).
  };

  const acceptSuggestion = () => {
    if (consultantSuggestion) {
      logAudit('SUGGESTION_ACCEPTED', { questionId: currentQuestion.id, value: consultantSuggestion.value });
      setSelectedOptionValue(consultantSuggestion.value);
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: consultantSuggestion.score }));
      setConsultantSuggestion(null);
      
      // Broadcast back to Consultant that it was accepted (optional, but good for sync)
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'selection', // Re-broadcast as Client selection to sync everyone
          payload: { 
            role: 'CLIENT', 
            value: consultantSuggestion.value, 
            score: consultantSuggestion.score, 
            questionId: currentQuestion.id 
          },
        });
      }
    }
  };

  const rejectSuggestion = () => {
    setConsultantSuggestion(null);
  };

  const handleNext = async () => {
    // Task 2: Repair "Next" Progression Logic - API Call
    if (!sessionId && projectId) {
      // Try to re-init if missing? Or just block?
      // Let's assume it should be there.
      console.error("Session ID missing during Next");
    }

    setIsSaving(true);

    try {
      if (currentQuestionIndex < totalQuestions - 1) {
        // Only save if we have a session. If strictly required:
        if (sessionId) {
           const res = await fetch('/api/strategy-iq/assessment-progress', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               projectId,
               questionId: currentQuestion.id,
               assessmentInstanceId: sessionId,
               selectedOptionId: selectedOptionValue,
               score: answers[currentQuestion.id]
             })
           });

           if (!res.ok) {
             console.error("Failed to save progress (API error)");
             // We continue? Or block? Prompt says "stuck on Question 1... indicates failure".
             // If I throw, they stay stuck.
             // But "Once the API returns a success (200), the local state currentQuestionIndex must increment."
             // So I MUST block if it fails.
             throw new Error("API failed");
           }
        }

        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        
        // Log navigation
        logAudit('NAVIGATED', { from: currentQuestionIndex, to: newIndex });
        
        // Broadcast navigation
        if (channelRef.current) {
          await channelRef.current.send({
            type: 'broadcast',
            event: 'navigation',
            payload: { role: userRole, index: newIndex },
          });
        }
      } else {
        // Completion Logic
        if (userRole !== 'CLIENT' && authorityLocked) {
          toast("Authority Required", "You must request submission authority from the client.", "destructive");
          setIsSaving(false);
          return;
        }

        // Calculate total score
        const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
        const maxPossibleScore = questions.reduce((sum, question) => {
          const maxQuestionScore = Math.max(...question.options.map(o => o.score));
          return sum + maxQuestionScore;
        }, 0);
        const normalizedScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

        // Show Analyzing state for both roles to provide feedback
        setIsAnalyzing(true);
        setFinalScore(normalizedScore);

        try {
          // Await the completion logic (which usually includes the API call)
          await onComplete({ score: normalizedScore, answers });
          
          // Show Victory State briefly before any potential redirect
          setIsAnalyzing(false);
          setShowSuccess(true);
          toast("INTELLIGENCE SECURED", "Initial synthesis is now available for review.", "success")
          
        } catch (error) {
          console.error("Error completing assessment:", error);
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast("Error", "Failed to save progress. Please try again.", "destructive");
    } finally {
      setIsSaving(false);
    }
  };

  const requestAuthority = async () => {
    logAudit('AUTHORITY_REQUESTED', { role: userRole });
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'authority_request',
        payload: { role: userRole },
      });
      toast("Request Sent", "Waiting for client approval...", "default");
    }
  };

  const grantAuthority = async () => {
    setShowAuthorityRequest(false);
    logAudit('AUTHORITY_GRANTED', { role: userRole });
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'authority_grant',
        payload: { role: userRole },
      });
      toast("Authority Granted", "Consultant can now submit the assessment.", "success");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      
      // Broadcast navigation
      if (channelRef.current) {
         channelRef.current.send({
          type: 'broadcast',
          event: 'navigation',
          payload: { role: userRole, index: newIndex },
        });
      }
    }
  };

  // Get Copilot insight
  const getCopilotInsight = () => {
    if (!selectedOptionValue) {
      return "Select an option to reveal strategic insights tailored to your situation.";
    }

    // Check for direct insight on the option
    const selectedOption = currentQuestion.options.find(o => o.value === selectedOptionValue);
    if (selectedOption?.insight) {
      return selectedOption.insight;
    }

    // Fallback to legacy copilotText map
    if (currentQuestion.copilotText && currentQuestion.copilotText[selectedOptionValue]) {
      return currentQuestion.copilotText[selectedOptionValue];
    }
    
    return "This choice reflects a specific strategic posture. Consider how this aligns with your overall business objectives.";
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 py-4 animate-in fade-in duration-500">
      
      {/* Authority Request Modal for Client */}
      <AnimatePresence>
        {showAuthorityRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4 text-coral">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold font-big-shoulders tracking-widest">Submission request</h3>
              </div>
              <p className="text-gray-400 font-inter text-sm mb-6">
                Luis is requesting to finalize this assessment on your behalf. Do you grant authority to submit?
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowAuthorityRequest(false)}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5"
                >
                  Deny
                </Button>
                <Button 
                  onClick={grantAuthority}
                  className="flex-1 bg-coral text-black hover:bg-coral/90 font-bold"
                >
                  Grant authority
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
            ref={analysisRef}
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="analysis-pulse absolute inset-0 rounded-full bg-teal-500/20 blur-xl" />
              <div className="analysis-pulse absolute inset-4 rounded-full bg-coral/20 blur-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot size={48} className="text-white animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white font-big-shoulders tracking-widest mb-2 italic">Analyzing inputs...</h3>
            <p className="text-gray-400 font-inter max-w-xs mx-auto">
              Our AI is calibrating your strategic posture based on industry benchmarks.
            </p>
          </motion.div>
        ) : showSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-500/50 flex items-center justify-center text-teal-400 shadow-[0_0_50px_rgba(46,211,198,0.2)]">
              <CheckCircle size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white font-big-shoulders tracking-[0.2em] mb-2 italic">
                {readOnly ? "Review Complete" : "Success: Synthesis initialized"}
              </h3>
              <p className="text-gray-400 font-inter max-w-sm mx-auto">
                {readOnly 
                  ? "Your strategic inputs have been reviewed. You can now access the full intelligence brief."
                  : "Your strategic inputs have been securely captured and the StrategyIQ™ Engine is processing the results."}
              </p>
            </div>
            
            <Button 
              onClick={onClose}
              variant="strategy-primary"
              className="px-12 py-6 text-[10px]"
            >
              {readOnly ? "View Final Brief" : "View My Results"}
            </Button>
          </motion.div>
        ) : isFinished ? (
          <NextStepCard 
            key="results"
            score={finalScore}
            currentCategory={category}
            onDashboard={onClose}
            onStartNext={(next) => onStartNext?.(next)}
            userRole={userRole}
            isPublished={isPublished}
            onPublish={onPublish}
            projectId={projectId}
            readOnly={readOnly}
            onEdit={onEdit}
          />
        ) : (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 text-coral hover:text-coral/80 transition-colors group"
              >
                <ArrowLeft size="14" className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-big-shoulders italic text-xs md:text-[10px] font-bold tracking-[0.3em]">
                  <span className="hidden md:inline">Back to intelligence overview</span>
                  <span className="md:hidden">Overview</span>
                </span>
              </button>
              
              <div className="flex items-center gap-4">
                 {/* Presence Indicator */}
                 {partnerActive && (
                    <Badge variant="outline" className="border-teal/30 bg-teal/5 text-teal animate-pulse gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      {userRole === 'CLIENT' ? 'Strategist shadowing' : 'Partner active'}
                    </Badge>
                 )}
                 
                 <div className="text-left md:text-right">
                  <h2 className="text-xl md:text-2xl font-big-shoulders italic font-bold text-white leading-none tracking-tight">
                    {category} <span className="text-zinc-600 font-light mx-1">//</span> Assessment
                  </h2>
                  <p className="text-zinc-500 text-[10px] md:text-sm font-medium mt-1 tracking-widest">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className={cn(
              "grid gap-6 relative items-start",
              userRole === 'CLIENT' ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1fr_320px]"
            )}>
              {/* Assessment Card */}
              <div className="space-y-4 md:space-y-6">
                <Card className="bg-[#141414] border-white/10 shadow-2xl overflow-hidden rounded-xl md:rounded-2xl">
                  <CardHeader className="pb-1 md:pb-2">
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                      <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5 tracking-wider text-[10px] h-6 px-2">
                        {currentQuestion.type === 'single' ? 'Single select' : 'Multiple select'}
                      </Badge>
                      <Progress value={progress} className="w-1/3 h-1.5 bg-white/5" indicatorClassName="bg-gradient-to-r from-coral to-teal" />
                    </div>
                    <CardTitle className="text-lg md:text-2xl text-white font-big-shoulders italic leading-snug">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 md:pt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                      {currentQuestion.options.map((option) => {
                        const isSuggested = consultantSuggestion?.value === option.value;
                        const isSelected = selectedOptionValue === option.value;
                        
                        return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.005 }}
                          whileTap={{ scale: 0.995 }}
                        >
                          <div
                              onClick={() => handleOptionSelect(option.value, option.score)}
                              className={cn(
                                "p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-200 flex items-center gap-3 md:gap-4 group relative overflow-hidden",
                                readOnly ? "cursor-default" : "cursor-pointer",
                                isSelected
                                  ? "border-coral bg-coral/5 shadow-[0_0_20px_rgba(249,111,110,0.1)]"
                                  : isSuggested 
                                    ? "border-dashed border-coral/50 bg-coral/[0.02]" 
                                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]",
                                readOnly && !isSelected && "opacity-40 grayscale-[0.5]"
                              )}
                            >
                            <div className={cn(
                              "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                              isSelected
                                ? "border-coral bg-coral"
                                : isSuggested
                                  ? "border-coral/50 text-coral"
                                  : "border-white/20 group-hover:border-white/40"
                            )}>
                              {isSelected && (
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                              )}
                              {isSuggested && !isSelected && (
                                <Lightbulb size={10} className="text-coral" />
                              )}
                            </div>
                            <span className={cn(
                              "text-base md:text-lg font-inter transition-colors leading-tight flex-1",
                              isSelected ? "text-white" : isSuggested ? "text-coral" : "text-gray-400"
                            )}>
                              {option.label}
                            </span>
                            
                            {/* Suggestion Controls (Client Only) */}
                            {isSuggested && userRole === 'CLIENT' && !isSelected && (
                              <div className="flex items-center gap-2 ml-2 animate-in fade-in slide-in-from-right-4">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); acceptSuggestion(); }}
                                  className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                >
                                  <Check size={14} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); rejectSuggestion(); }}
                                  className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )})}
                    </div>

                    <div className="flex justify-between pt-6 md:pt-8 mt-4 border-t border-white/10">
                      <div className="flex gap-2 md:gap-4">
                        <Button
                          variant="strategy-secondary"
                          onClick={handlePrevious}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 md:px-6 py-3 md:py-4 h-10 md:h-12 text-[10px] font-bold"
                        >
                          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Prev
                        </Button>
                        
                        {readOnly && onEdit && (
                          <Button
                            variant="ghost"
                            onClick={onEdit}
                            className="px-4 md:px-6 py-3 md:py-4 h-10 md:h-12 text-[10px] border border-coral text-coral hover:bg-coral/10"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                      
                      {/* Consultant Authority Request Button */}
                      {userRole !== 'CLIENT' && authorityLocked && currentQuestionIndex === totalQuestions - 1 && (
                        <Button
                           onClick={requestAuthority}
                           variant="outline"
                           className="px-6 md:px-8 py-3 md:py-4 h-10 md:h-12 text-[10px] font-bold border-coral/30 text-coral hover:bg-coral/10"
                        >
                           <Lock className="mr-2 h-3.5 w-3.5" /> Request authority
                        </Button>
                      )}

                      <Button
                        variant="strategy-primary"
                        onClick={handleNext}
                        disabled={isInitializing || isSaving || (!selectedOptionValue && !readOnly) || (userRole !== 'CLIENT' && authorityLocked && currentQuestionIndex === totalQuestions - 1)}
                        className={cn(
                          "px-6 md:px-8 py-3 md:py-4 h-10 md:h-12 text-[10px] font-bold",
                          (isInitializing || isSaving || (!selectedOptionValue && !readOnly) || (userRole !== 'CLIENT' && authorityLocked && currentQuestionIndex === totalQuestions - 1)) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isInitializing || isSaving ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#2ED3C6]" />
                        ) : (
                           <>
                             {currentQuestionIndex === totalQuestions - 1 
                               ? (readOnly ? 'Finish Review' : 'Complete') 
                               : 'Next'}
                             {currentQuestionIndex === totalQuestions - 1 ? (
                               <CheckCircle className="ml-2 h-3.5 w-3.5" />
                             ) : (
                               <ArrowRight className="ml-2 h-3.5 w-3.5" />
                             )}
                           </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-[9px] md:text-[10px] text-zinc-600 tracking-widest text-center md:text-left">
                      <span>StrategyIQ™ Methodology v2.0</span>
                      <span className="hidden md:inline">Confidential & proprietary • © 2026 Luis Gilberto</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Consultant Copilot */}
            {userRole !== 'CLIENT' && (
              <ConsultantCopilot 
                question={currentQuestion}
                selectedOptionValue={selectedOptionValue}
                insight={getCopilotInsight()}
              />
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
