'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  projectId?: string;
  dimension?: string;
  autoRefresh?: boolean;
}

export default function RefreshButton({ projectId, dimension, autoRefresh = false }: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (autoRefresh && !isRefreshing && !errorMessage) {
      const timer = setTimeout(() => {
        handleRefresh();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoRefresh, errorMessage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    
    try {
      // Task 3: POST to /api/strategy-iq/generate-narrative
      if (projectId && dimension) {
        console.log("[DEBUG] Refreshing narrative via API:", { projectId, dimension });
        const response = await fetch('/api/strategy-iq/generate-narrative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, dimension })
        });
        
        const data = await response.json();

        if (response.status === 400 && data.error === 'INCOMPLETE_ASSESSMENT') {
          setErrorMessage(data.message || 'Assessment incomplete. Redirecting...');
          setTimeout(() => {
            router.push(`/strategy-iq/${projectId}/${dimension}`);
          }, 2000);
          return;
        }

        if (response.ok) {
          console.log("[DEBUG] Narrative regenerated successfully.");
          router.refresh();
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("[DEBUG] Refresh API call failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`inline-flex items-center justify-center rounded-full bg-teal text-[#050505] h-10 px-8 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-teal/90 active:scale-95 shadow-lg shadow-teal/20 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRefreshing ? 'Verifying Data...' : 'Refresh Briefing'}
      </button>
      {errorMessage && (
        <p className="text-coral text-[10px] font-bold uppercase tracking-widest animate-pulse">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
