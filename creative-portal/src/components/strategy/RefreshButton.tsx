'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  projectId?: string;
  dimension?: string;
}

export default function RefreshButton({ projectId, dimension }: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Task 3: POST to /api/strategy-iq/generate-narrative
      if (projectId && dimension) {
        console.log("[DEBUG] Refreshing narrative via API:", { projectId, dimension });
        const response = await fetch('/api/strategy-iq/generate-narrative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, dimension })
        });
        
        if (response.ok) {
          console.log("[DEBUG] Narrative regenerated successfully.");
        }
      }
    } catch (error) {
      console.error("[DEBUG] Refresh API call failed:", error);
    } finally {
      // Invalidate cache and break client-side caching
      router.refresh();
      window.location.reload();
    }
  };

  return (
    <button 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`inline-flex items-center justify-center rounded-full bg-coral text-[#050505] h-10 px-8 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-coral/90 active:scale-95 shadow-lg shadow-coral/20 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isRefreshing ? 'Processing...' : 'Refresh Briefing'}
    </button>
  );
}
