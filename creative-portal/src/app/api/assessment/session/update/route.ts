import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, responses, intelligence_score, current_question, status } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.$executeRawUnsafe(
      `UPDATE assessment_sessions
       SET responses = COALESCE($2::jsonb, responses),
           intelligence_score = COALESCE($3::int, intelligence_score),
           current_question = COALESCE($4::int, current_question),
           status = COALESCE($5::text, status),
           updated_at = now()
       WHERE id = $1`,
      id,
      responses ? JSON.stringify(responses) : null,
      intelligence_score ?? null,
      current_question ?? null,
      status ?? null
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

