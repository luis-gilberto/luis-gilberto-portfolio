import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, responses, intelligence_score, current_question, status } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const dataToUpdate: any = {}
    if (responses) dataToUpdate.responses = JSON.stringify(responses)
    if (intelligence_score !== undefined) dataToUpdate.intelligenceScore = intelligence_score
    if (current_question !== undefined) dataToUpdate.currentQuestion = current_question
    if (status) dataToUpdate.status = status

    await prisma.assessmentSession.update({
      where: { id },
      data: dataToUpdate
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

