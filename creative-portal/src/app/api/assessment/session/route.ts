import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { client_id, assessment_type } = body
    if (!client_id || !assessment_type) {
      return NextResponse.json({ error: 'Missing client_id or assessment_type' }, { status: 400 })
    }

    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `INSERT INTO assessment_sessions (client_id, assessment_type, "startedAt", status)
       VALUES ($1, $2, now(), 'in_progress') RETURNING id`,
      client_id,
      assessment_type
    )

    const id = rows?.[0]?.id
    if (!id) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })

    return NextResponse.json({ id })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
