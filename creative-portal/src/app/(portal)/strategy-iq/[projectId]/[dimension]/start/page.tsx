'use client'

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import AssessmentRunner from '@/components/strategy/AssessmentRunner'
import { AssessmentCategory } from '@/lib/strategyData'
import { useEffect, useState } from 'react'
import { prisma } from '@/lib/prisma'

export default function StrategyIQStartPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [dimension, setDimension] = useState<AssessmentCategory | null>(null)

  useEffect(() => {
    if (params.projectId) setProjectId(params.projectId as string)
    if (params.dimension) setDimension(params.dimension as AssessmentCategory)
  }, [params])

  if (status === 'loading' || !projectId || !dimension) {
    return <div className="p-12 text-center text-white">Loading Assessment...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleComplete = async (result: { score: number; answers: Record<string, number> }) => {
    // Save to DB
    try {
      const response = await fetch('/api/strategy-iq/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          dimension,
          score: result.score,
          responses: result.answers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save assessment')
      }
      
      // Redirect logic
      if (session?.user?.role === 'ADMIN') {
        router.push(`/admin/projects/${projectId}/strategy/${dimension}/results`)
      } else {
        router.push(`/strategy-iq/${projectId}/${dimension}/results`)
      }
    } catch (error) {
      console.error('Error saving assessment:', error)
      // We still want the Victory state to show in the Runner, 
      // but maybe we should throw here so the Runner knows it failed.
      throw error 
    }
  }

  const handleClose = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <AssessmentRunner
        category={dimension}
        userRole={session?.user?.role || 'CLIENT'}
        onComplete={handleComplete}
        onClose={handleClose}
        projectId={projectId}
      />
    </div>
  )
}
