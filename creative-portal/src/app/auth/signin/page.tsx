'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('') // NEW STATE FOR NAME
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Step 1: Temporarily save name/email to local storage 
    // This ensures the custom next-auth logic can access the name during database insert 
    localStorage.setItem('auth_temp_name', name.trim());

    // Step 2: Initiate Magic Link flow
    const result = await signIn('email', { email, redirect: false })
    setLoading(false)
    
    if (result?.error) {
      alert(`Sign-in error: ${result.error}. Please check your email format.`);
      console.error('Sign-in error:', result.error)
    } else if (result?.url) {
      // Redirect to verify-request page
      router.push('/auth/verify-request')
    }
  }

  const isFormValid = name.trim().length > 1 && email.includes('@') && email.includes('.');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Glass Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border-strong)] bg-[var(--card-bg)] shadow-[var(--shadow-hover)] backdrop-blur-md">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--coral)] bg-white shadow-lg dark:bg-[#211e2f] dark:shadow-xl">
            {/* External Link SVG */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--coral)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            > 
              <path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path> 
            </svg> 
          </div> 
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2"> 
            Client Portal Sign Up 
          </h1> 
          <p className="text-[var(--text-secondary)] text-sm"> 
            Create your account to access your project dashboard. 
          </p> 
        </div> 

        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* Name Input */} 
          <div> 
            <Input 
              type="text" 
              placeholder="Your Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="h-12 bg-[var(--bg-alt)] border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--coral)] rounded-lg" 
            /> 
          </div> 
          {/* Email Input */} 
          <div> 
            <Input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-12 bg-[var(--bg-alt)] border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--coral)] rounded-lg" 
            /> 
          </div> 
          
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="w-full h-12 bg-[var(--coral)] hover:bg-[#e55a5a] text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg" 
          > 
            {loading ? 'Sending Link...' : 'Create Account & Sign In'} 
          </Button> 
        </form> 

        <div className="mt-6 text-center"> 
          <p className="text-xs text-[var(--text-muted)]"> 
            Secured by Luis Gilberto Ecosystem 
          </p> 
        </div> 
      </div> 
    </div> 
  ) 
} 
