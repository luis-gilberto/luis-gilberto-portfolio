"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn("email", { email, redirect: false })
    setLoading(false)
    if ((result as any)?.error) {
      console.error("Sign-in error:", (result as any).error)
    } else if ((result as any)?.url) {
      router.push("/auth/verify-request")
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Glass Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border-strong)] bg-[var(--card-bg)] shadow-[var(--shadow-hover)] backdrop-blur-md">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--coral)] bg-white shadow-lg dark:bg-[#211e2f] dark:shadow-xl">
            {/* External Link Icon (Matching provided image) */}
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
              <path d="M15 3h6v6"></path> 
              <path d="M10 14L21 3"></path> 
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path> 
            </svg> 
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-big-shoulders mb-2">
            Creative Portal
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Enter your email to access your project dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading} 
            className="w-full h-12 bg-[var(--coral)] hover:bg-[#e55a5a] text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg" 
          >
            {loading ? 'Sending Link...' : 'Sign In with Email'}
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
