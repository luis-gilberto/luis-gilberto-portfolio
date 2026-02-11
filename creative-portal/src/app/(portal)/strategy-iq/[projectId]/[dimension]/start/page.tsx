'use client'

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import AssessmentRunner from '@/components/strategy/AssessmentRunner'
import { AssessmentCategory } from '@/lib/strategyData'
import { useEffect, useState } from 'react'
import { safeJsonParse } from '@/lib/json-utils'

export default function StrategyIQStartPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [dimension, setDimension] = useState<AssessmentCategory | null>(null)
  const [initialAnswers, setInitialAnswers] = useState<Record<string, number>>({})
  const [isHydrating, setIsHydrating] = useState(true)
  const [isReadOnly, setIsReadOnly] = useState(false)

  useEffect(() => {
    if (params.projectId) setProjectId(params.projectId as string)
    if (params.dimension) {
      const dim = params.dimension as AssessmentCategory
      setDimension(dim)
      
      // Check query params or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const isReview = urlParams.get('review') === 'true'
      const isCompleted = localStorage.getItem(`${dim.toLowerCase()}_assessment_completed`) === 'true'
      
      setIsReadOnly(isReview || isCompleted)
    }
  }, [params])

  useEffect(() => {
    async function fetchExistingSession() {
      if (projectId && dimension) {
        setIsHydrating(true)
        try {
          const response = await fetch(`/api/strategy-iq/session?projectId=${projectId}&dimension=${dimension}`)
          if (response.ok) {
            const data = await response.json()
            if (data?.responses) {
              setInitialAnswers(safeJsonParse(data.responses, {}))
            }
          }
        } catch (error) {
          console.error('Error fetching existing session:', error)
        } finally {
          setIsHydrating(false)
        }
      }
    }
    fetchExistingSession()
  }, [projectId, dimension])

  if (status === 'loading' || isHydrating || !projectId || !dimension) {
    return <div className="p-12 text-center text-white">Loading Assessment...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleComplete = async (result: { score: number; answers: Record<string, number> }) => {
    if (isReadOnly) {
      router.push(`/strategy-iq/${projectId}/${dimension}/results`)
      return
    }

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
        initialAnswers={initialAnswers}
        readOnly={isReadOnly}
        onEdit={() => setIsReadOnly(false)}
      />
    </div>
  )
}
