
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle
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
  projectId
}: AssessmentRunnerProps) {
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const analysisRef = useRef<HTMLDivElement>(null);

  const questions = assessmentQuestions[category];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

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
  }, [currentQuestionIndex, currentQuestion, answers]);

  const handleOptionSelect = (value: string, score: number) => {
    setSelectedOptionValue(value);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
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
        // Add error handling if needed
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Retrieve previous answer if needed to show selection
      // But we stored it in answers, so we could re-hydrate selectedOptionValue
      // For now, let's just go back. Ideally we should restore selection.
      // We can find the value from the score if scores are unique, but they are not.
      // To support full back navigation with state restoration, we'd need to store the value too.
      // For this MVP, we'll reset selection on back or accept that it's cleared visually but score is kept.
      // Let's improve this: store value in answers? No, answers is Record<string, number> per request.
      // I'll keep it simple for now as per instructions.
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
    <div className="w-full max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
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
            <h3 className="text-2xl font-bold text-white font-big-shoulders tracking-widest uppercase mb-2 italic">Analyzing Inputs...</h3>
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
              <h3 className="text-4xl font-bold text-white font-big-shoulders tracking-[0.2em] uppercase mb-2 italic">Success: Synthesis Initialized</h3>
              <p className="text-gray-400 font-inter max-w-sm mx-auto">
                Your strategic inputs have been securely captured and the discovery engine is processing the results.
              </p>
            </div>
            
            <Button 
              onClick={onClose}
              variant="strategy-primary"
              className="px-12 py-6 text-[10px]"
            >
              View My Results
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
          />
        ) : (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">
                  {category.toUpperCase()} Assessment
                </h2>
                <p className="text-gray-400 text-sm">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                Exit Assessment
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Assessment */}
              <div className={cn(
                "space-y-6",
                userRole === 'CLIENT' ? "lg:col-span-3" : "lg:col-span-2"
              )}>
                <Card className="bg-[#141414] border-white/10 shadow-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 uppercase tracking-wider text-xs">
                        {currentQuestion.type === 'single' ? 'Single Select' : 'Multiple Select'}
                      </Badge>
                      <Progress value={progress} className="w-1/3 h-2 bg-white/5" indicatorClassName="bg-gradient-to-r from-coral to-teal" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-white font-light leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            onClick={() => handleOptionSelect(option.value, option.score)}
                            className={cn(
                              "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 group",
                              selectedOptionValue === option.value
                                ? "border-coral bg-coral/10 shadow-[0_0_20px_rgba(249,111,110,0.15)]"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                              selectedOptionValue === option.value
                                ? "border-coral bg-coral"
                                : "border-white/30 group-hover:border-white/50"
                            )}>
                              {selectedOptionValue === option.value && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className={cn(
                              "text-lg font-medium transition-colors",
                              selectedOptionValue === option.value ? "text-white" : "text-gray-300"
                            )}>
                              {option.label}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-8 mt-4 border-t border-white/10">
                      <Button
                        variant="strategy-secondary"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-4 text-[10px]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        variant="strategy-primary"
                        onClick={handleNext}
                        disabled={!selectedOptionValue}
                        className={cn(
                          "px-8 py-4 text-[10px]",
                          !selectedOptionValue && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Complete Assessment' : 'Next Question'}
                        {currentQuestionIndex === totalQuestions - 1 ? (
                          <CheckCircle className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
                      <span>StrategyIQ™ Methodology v2.0</span>
                      <span>Confidential & Proprietary • © 2026 Luis Gilberto</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Col: Copilot Sidebar */}
              {userRole !== 'CLIENT' && (
                <div className="lg:col-span-1">
                  <AnimatePresence mode="wait">
                    {showCopilot && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full"
                      >
                        <Card className="h-full bg-[#1A1A1A] border-l-4 border-l-teal-500 border-y-0 border-r-0 rounded-none lg:rounded-xl shadow-xl">
                          <CardHeader className="bg-white/5 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                                <Bot className="h-6 w-6" />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-white">Consultant Copilot</CardTitle>
                                <CardDescription className="text-teal-400/80 text-xs uppercase tracking-wider font-medium">
                                  Strategic Context
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="space-y-6">
                              {/* Warning if no data */}
                              {!currentQuestion.consultantGuide && (
                                <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 mb-4">
                                  <p className="text-yellow-200 text-sm flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    No Consultant Notes available for this question
                                  </p>
                                </div>
                              )}

                              {/* Conversational Script */}
                              {currentQuestion.consultantGuide?.script && (
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-400" />
                                    Ask This
                                  </h4>
                                  <p className="text-gray-300 text-sm italic leading-relaxed">
                                    "{currentQuestion.consultantGuide.script}"
                                  </p>
                                </div>
                              )}

                              {/* Context / Why This Matters */}
                              <div className="space-y-2">
                                 <h4 className="text-white font-medium flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4 text-coral" />
                                    Why This Matters
                                  </h4>
                                <p className="text-gray-400 text-sm leading-relaxed pl-6">
                                  {currentQuestion.consultantGuide?.context || 
                                   "Understanding this dimension helps calibrate the complexity of the required solution."}
                                </p>
                              </div>

                              {/* Red Flags */}
                              {currentQuestion.consultantGuide?.redFlags && (
                                 <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                  <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Red Flags
                                  </h4>
                                  <ul className="list-disc list-inside text-red-300/80 text-sm space-y-1">
                                    {currentQuestion.consultantGuide.redFlags.map((flag, idx) => (
                                      <li key={idx}>{flag}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Strategic Insight */}
                              <div className="space-y-3">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  Strategic Insight
                                </h4>
                                <div className="min-h-[80px] text-gray-300 text-sm leading-relaxed p-4 bg-gradient-to-br from-white/5 to-transparent rounded-lg border border-white/5">
                                  <AnimatePresence mode="wait">
                                    <motion.p
                                      key={selectedOptionValue || 'default'}
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {getCopilotInsight()}
                                    </motion.p>
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
