import { prisma } from '@/lib/prisma'
import MiniBriefClient from './MiniBriefClient'
import { redirect } from 'next/navigation'

export default async function MiniBriefPage({ searchParams }: { searchParams: Promise<{ sessionId: string }> }) {
  const { sessionId } = await searchParams
  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white font-mono text-sm">
        <span className="text-coral">ERROR: MISSION CONTEXT MISSING (NO SESSION ID)</span>
      </div>
    )
  }

  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: { project: { include: { client: true } } }
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white font-mono text-sm">
        <span className="text-coral">ERROR: SESSION TERMINATED OR INVALID</span>
      </div>
    )
  }

  return <MiniBriefClient session={session} />
}
