'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/providers/toast-provider'

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        toast("ACCESS DENIED", "Please check your credentials and try again.", "error")
        console.error('Sign-in error:', result.error)
      } else {
        if (email.toLowerCase().includes('admin')) {
          router.push('/admin')
        } else if (email.toLowerCase().includes('consultant')) {
          router.push('/strategyiq')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast("SYSTEM ERROR", "An unexpected error occurred. Please contact technical support.", "error")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.includes('@') && email.includes('.') && password.length > 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#121212]">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-serif text-3xl text-white mb-2">System Access</h1>
          <p className="font-sans text-sm text-gray-400">Secure Enterprise Gateway</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <Input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all" />
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] rounded-lg transition-all" />
          <Button type="submit" disabled={loading || !isFormValid} className="w-full h-12 bg-gradient-to-r from-[var(--coral)] to-[#e55a5a] hover:from-[#e55a5a] hover:to-[var(--coral)] text-white font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-900/20 transition-all">
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center border-t border-white/5 pt-4">
          <p className="text-[10px] text-gray-600 leading-tight">
            <span className="text-gray-500 font-bold block mb-1">RESTRICTED ACCESS ENVIRONMENT</span>
            By accessing The Portal, you acknowledge that the StrategyIQ™ Engine contains
            proprietary trade secrets. Access is monitored and subject to strict NDA terms.
          </p>
        </div>
      </div>
    </div>
  )
}
