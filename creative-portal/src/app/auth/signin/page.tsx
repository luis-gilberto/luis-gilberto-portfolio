'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Save name for profile creation
    localStorage.setItem('auth_temp_name', name.trim());

    const result = await signIn('email', { email, redirect: false })
    setLoading(false)
    
    if (result?.error) {
      alert(`Sign-in error: ${result.error}. Please check your email format.`);
      console.error('Sign-in error:', result.error)
    } else if (result?.url) {
      router.push('/auth/verify-request')
    }
  }

  const isFormValid = name.trim().length > 1 && email.includes('@') && email.includes('.');

  const handleDevLogin = async (email: string) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', { 
        email, 
        code: '123456', 
        redirect: false 
      });
      
      if (result?.error) {
        alert(`Dev login failed: ${result.error}`);
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
      alert('Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#121212]">
      
      {/* 1. Brand Seal */}
      <div className="flex flex-col items-center mb-8"> 
        {/* 1. The Circle Container */} 
        <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(249,111,110,0.2)] mb-4 backdrop-blur-md"> 
          {/* 2. The Logomark ONLY */} 
          <img src="/assets/images/Coral_LG-3D.png" alt="Logomark" className="w-16 h-auto opacity-90" /> 
        </div> 
        {/* 3. The Text Stack */} 
        <div className="text-center tracking-[0.2em] leading-tight"> 
          <div className="text-xs font-bold text-white mb-1">LUIS GILBERTO</div> 
          <div className="text-sm font-bold text-[#F96F6E]">ECOSYSTEM</div> 
        </div> 
      </div>

      {/* Glass Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--coral)]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-serif text-3xl text-white mb-2">
            Welcome to The Portal
          </h1>
          <p className="font-sans text-sm text-gray-400">
            Your Strategic Access Point to the LG Ecosystem
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
           {/* Name Input */}
          <div className="space-y-1.5">
            <Input 
              type="text" 
              placeholder="Your Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="h-12 bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <Input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-12 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="w-full h-12 bg-gradient-to-r from-[var(--coral)] to-[#e55a5a] hover:from-[#e55a5a] hover:to-[var(--coral)] text-white font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Accessing Vault...' : 'Enter Portal'}
          </Button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Restricted Access Environment
          </p>
        </div>
      </div>

      {/* Dev Shortcuts Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full max-w-md mt-8 p-6 rounded-xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
            Development Access Keys
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleDevLogin('admin@example.com')}
              className="px-2 py-2 text-[10px] font-bold text-white bg-red-500/80 hover:bg-red-500 rounded border border-white/10 transition-colors uppercase tracking-wider"
            >
              Admin
            </button>
            <button
              onClick={() => handleDevLogin('client@example.com')}
              className="px-2 py-2 text-[10px] font-bold text-white bg-emerald-600/80 hover:bg-emerald-600 rounded border border-white/10 transition-colors uppercase tracking-wider"
            >
              Client
            </button>
            <button
              onClick={() => handleDevLogin('consultant@example.com')}
              className="px-2 py-2 text-[10px] font-bold text-white bg-purple-600/80 hover:bg-purple-600 rounded border border-white/10 transition-colors uppercase tracking-wider"
            >
              Consultant
            </button>
          </div>
        </div>
      )}
    </div> 
  ) 
}
