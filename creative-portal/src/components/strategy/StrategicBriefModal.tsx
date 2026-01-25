import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StrategicBriefData {
  clientName: string;
  overallScore: number;
  serviceTitle: string;
  servicePrice: string;
  answers: Record<string, number>;
  categoryScores: Record<string, number>;
}

interface StrategicBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StrategicBriefData;
}

export default function StrategicBriefModal({ isOpen, onClose, data }: StrategicBriefModalProps) {
  // Helper for narrative
  const getMaturityLabel = (score: number) => {
    if (score < 40) return 'FOUNDATIONAL';
    if (score < 75) return 'GROWTH';
    return 'SCALE';
  };

  // 1. Narrative Generator
  const generateNarrative = (score: number, answers: Record<string, number> = {}) => {
    let narrative = `Based on our strategic assessment, ${data.clientName} is currently operating at a ${getMaturityLabel(score)} maturity level. `;

    // DYNAMIC INJECTION: Check specific critical answers
    if (answers && answers['brand_positioning'] !== undefined && answers['brand_positioning'] <= 30) {
      narrative += "We've identified critical friction in your market positioning, which creates a risk of commoditization. ";
    }
    if (answers && answers['creative_audit'] !== undefined && answers['creative_audit'] <= 25) {
      narrative += "Your operational velocity is currently hampered by fragmented creative assets. ";
    }
    if (answers && answers['gtm_segmentation'] !== undefined && answers['gtm_segmentation'] <= 30) {
      narrative += "Launch efficiency is being compromised by a lack of precise audience segmentation. ";
    }

    narrative += "To unlock scalable growth, we recommend shifting focus from reactive execution to a structured, data-driven foundation.";
    return narrative;
  };

  const narrative = generateNarrative(data.overallScore, data.answers || {});
  const status = getMaturityLabel(data.overallScore);

  // 2. Strategic Priorities Logic
  const getPriorities = () => {
    const priorities = [];
    const categoryScores = data.categoryScores || {};

    if (categoryScores['brand'] < 50) priorities.push({ area: 'Brand', task: 'Codify Brand Voice' });
    if (categoryScores['gtm'] < 50) priorities.push({ area: 'GTM', task: 'Validate Audience Segments' });
    if (categoryScores['campaign'] < 50) priorities.push({ area: 'Campaign', task: 'Optimize Conversion Funnel' });
    if (categoryScores['creative'] < 50) priorities.push({ area: 'Creative', task: 'Consolidate Asset Library' });

    // Fallbacks
    if (priorities.length === 0) {
        priorities.push({ area: 'Strategy', task: 'Market Expansion Analysis' });
        priorities.push({ area: 'Optimization', task: 'Advanced KPI Modeling' });
        priorities.push({ area: 'Innovation', task: 'New Channel Testing' });
    }

    return priorities.slice(0, 3);
  };

  const priorities = getPriorities();

  // 3. Scope of Work List
  const getScopeOfWork = (title: string) => {
    if (title && title.includes('Growth Acceleration')) {
        return ['Strategic Roadmap', 'Weekly Sprints', 'KPI Dashboard', 'Campaign Optimization'];
    }
    if (title && title.includes('Foundational')) {
        return ['Brand Audit', 'Asset Consolidation', 'Core Guidelines', 'Messaging Framework'];
    }
    // Enterprise or others
    return ['Multi-channel Attribution', 'Advanced Automation', 'Team Training', 'Executive Reporting'];
  };

  const scopeOfWork = getScopeOfWork(data.serviceTitle);

  const handlePrint = () => {
    // 1. Get the content
    const content = document.getElementById('strategic-brief-content');
    if (!content) return;

    // 2. Open a new "Clean" window
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;

    // 3. Clone ALL styles from the main document (Tailwind + Fonts)
    const styles = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
      .map(node => node.outerHTML)
      .join('');

    // 4. Write the HTML with Cloned Styles + Print Overrides
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strategic Brief</title>
          ${styles}
          <style>
            /* Critical Print Overrides */
            body {
              background-color: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
            }
            
            /* Ensure the brief container fills the print page nicely */
            .strategic-brief-content {
              padding: 40px !important;
              max-width: 100% !important;
              margin: 0 auto !important;
            }

            /* Force Backgrounds and Colors */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Hide UI elements just in case */
            .no-print, button { display: none !important; }
          </style>
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    // 5. Trigger Print and Close
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for styles/fonts to apply
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print-parent-reset">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm no-print"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-[#1A1A1A] rounded-sm shadow-2xl print-parent-reset"
          >
            {/* TOOLBAR */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-[#141414] text-white border-b border-white/10 no-print">
              <div className="text-sm font-medium text-gray-400">Preview Mode</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrint} className="text-gray-400 hover:text-white">
                  <Printer size={16} className="mr-2" /> Print
                </Button>
                <Button variant="default" size="sm" onClick={handlePrint} className="bg-teal-500 hover:bg-teal-600 text-black">
                  <Download size={16} className="mr-2" /> Export PDF
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* DOCUMENT CONTENT */}
            <div id="strategic-brief-content" className="p-12 md:p-16 font-sans strategic-brief-content">
              
              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#2ED3C6] pb-6 mb-12">
                <div>
                  <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-2">
                    STRATEGIC BRIEF
                  </h1>
                  <p className="text-sm uppercase tracking-[0.2em] font-bold text-gray-500">
                    CONFIDENTIAL INTELLIGENCE REPORT
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Prepared For</div>
                  <div className="text-xl font-bold text-[#1A1A1A]">{data.clientName}</div>
                  <div className="text-sm text-[#2ED3C6] font-medium">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* EXECUTIVE SUMMARY */}
              <div className="mb-16 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#2ED3C6] mb-4">
                  01 // Executive Summary
                </h3>
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-[#1A1A1A]">
                  {narrative}
                </p>
              </div>

              {/* IMMEDIATE PRIORITIES */}
              <div className="mb-16 break-inside-avoid">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                  02 // Immediate Priorities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {priorities.map((priority, index) => (
                    <div key={index} className="bg-[#F5F5F5] p-6 border-t-2 border-[#1A1A1A]">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{priority.area}</div>
                      <div className="text-lg font-bold text-[#1A1A1A]">{priority.task}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIAGNOSIS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 break-inside-avoid">
                
                {/* LEFT: SCORE */}
                <div className="bg-[#F5F5F5] p-8 border-l-4 border-[#1A1A1A]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                    03 // Strategic Diagnosis
                  </h3>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-7xl font-bold text-[#1A1A1A]">{data.overallScore}</span>
                    <span className="text-xl text-gray-400 font-medium">/ 100</span>
                  </div>
                  <div className="text-lg font-bold text-[#2ED3C6] uppercase tracking-wider">
                    {status} MATURITY
                  </div>
                </div>

                {/* RIGHT: INTERVENTION */}
                <div className="bg-[#1A1A1A] p-8 text-white border-l-4 border-[#2ED3C6] print-reset-bg">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                    04 // Recommended Intervention
                  </h3>
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Service Match</div>
                    <div className="text-2xl font-bold text-white mb-4">{data.serviceTitle}</div>
                    
                    {/* SCOPE OF WORK LIST */}
                    <ul className="space-y-2 mb-6">
                      {scopeOfWork.map((item, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2ED3C6] mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Engagement Investment</div>
                    <div className="text-3xl font-bold text-[#2ED3C6]">{data.servicePrice}</div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="text-center border-t border-gray-100 pt-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Generated via StrategyIQ Engine • Internal Use Only
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
