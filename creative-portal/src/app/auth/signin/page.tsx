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
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', { 
        email, 
        password,
        redirect: false 
      })
      
      if (result?.error) {
        alert('Access Denied. Please check your credentials.');
        console.error('Sign-in error:', result.error)
      } else {
        // Successful login - Handle Role-Based Redirection
        if (email.toLowerCase().includes('admin')) {
          router.push('/admin');
        } else if (email.toLowerCase().includes('consultant')) {
          router.push('/strategyiq');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = email.includes('@') && email.includes('.') && password.length > 0;

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
            System Access
          </h1>
          <p className="font-sans text-sm text-gray-400">
            Secure Enterprise Gateway
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="h-12 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="w-full h-12 bg-gradient-to-r from-[var(--coral)] to-[#e55a5a] hover:from-[#e55a5a] hover:to-[var(--coral)] text-white font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>

          <p className="mt-6 text-center text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Authorized Personnel Only. Access to StrategyIQ™ is monitored and logged.
          </p>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Restricted Access Environment
          </p>
        </div>
      </div>
    </div> 
  ) 
}
