'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Loader2 } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" size={16} /></div>;
  }

  if (session) {
    const handleSignOut = () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentScope');
      signOut({ callbackUrl: window.location.origin + '/login' });
    };

    return (
      <div className="flex items-center gap-3">
        {/* Task 4: Concurrent Session Testing Logic */}
        {session.user?.role === 'ADMIN' && (
           <Link 
             href="/dashboard"
             className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-teal border border-teal/20 bg-teal/5 hover:bg-teal/10 rounded-lg transition-all"
             title="Switch to Client View (Simulation)"
           >
             <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
             Client View
           </Link>
        )}
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 lg:px-4 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-medium bg-[#F96F6E] hover:bg-[#ff8584] text-white rounded-lg transition-colors"
    >
      Portal Login
    </Link>
  );
}
