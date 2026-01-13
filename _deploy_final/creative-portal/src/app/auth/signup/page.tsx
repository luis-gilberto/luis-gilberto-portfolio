'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function RequestAccessPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    reason: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call for lead capture
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="fixed inset-0 z-[-1]">
           <img 
             src="/assets/images/portal-corridor-bg.jpg" 
             alt="Background" 
             className="w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <i className="fas fa-check text-emerald-400 text-2xl"></i>
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">Request Received</h2>
          <p className="font-sans text-gray-300 mb-8 leading-relaxed">
            Your access request has been securely transmitted to the Luis Gilberto Ecosystem team. We review all applications within 48 hours.
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest border border-white/10"
          >
            Return to Command Center
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-[-1]">
         <img 
           src="/assets/images/portal-corridor-bg.jpg" 
           alt="Background" 
           className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* 1. Brand Seal */}
      <div className="flex flex-col items-center mb-8 relative z-10"> 
        <div className="w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(249,111,110,0.2)] mb-4 backdrop-blur-md"> 
          <img src="/assets/images/Coral_LG-3D.png" alt="Logomark" className="w-16 h-auto opacity-90" /> 
        </div> 
        <div className="text-center tracking-[0.2em] leading-tight"> 
          <div className="text-xs font-bold text-white mb-1">LUIS GILBERTO</div> 
          <div className="text-sm font-bold text-[#F96F6E]">ECOSYSTEM</div> 
        </div> 
      </div>

      {/* Glass Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group z-10">
        
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--coral)]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-serif text-3xl text-white mb-2">
            Request Access
          </h1>
          <p className="font-sans text-sm text-gray-400">
            Join the ecosystem to manage your strategic roadmap.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <Input 
              type="text" 
              name="fullName"
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              className="h-12 bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>

          {/* Work Email */}
          <div className="space-y-1.5">
            <Input 
              type="email" 
              name="email"
              placeholder="Work Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="h-12 bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-1.5">
            <Input 
              type="text" 
              name="companyName"
              placeholder="Company Name" 
              value={formData.companyName} 
              onChange={handleChange} 
              required 
              className="h-12 bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all"
            />
          </div>

          {/* Reason for Access */}
          <div className="space-y-1.5">
            <textarea 
              name="reason"
              placeholder="Why do you need access?" 
              value={formData.reason} 
              onChange={handleChange} 
              required 
              rows={3}
              className="w-full p-3 bg-black/50 border border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] focus:outline-none rounded-lg transition-all resize-none text-sm"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-gradient-to-r from-[var(--coral)] to-[#e55a5a] hover:from-[#e55a5a] hover:to-[var(--coral)] text-white font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Transmitting Request...' : 'Request Access'}
          </Button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-white hover:text-[var(--coral)] transition-colors underline decoration-white/30 underline-offset-4">
              Enter Portal
            </Link>
          </p>
        </div>
      </div>
    </div> 
  ) 
}
