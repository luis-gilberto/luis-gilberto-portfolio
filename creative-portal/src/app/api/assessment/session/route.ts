import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { client_id, consultant_id, assessment_type } = body
    if (!client_id || !consultant_id || !assessment_type) {
      return NextResponse.json({ error: 'Missing client_id, consultant_id, or assessment_type' }, { status: 400 })
    }

    const newId = randomUUID()
    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `INSERT INTO assessment_sessions (id, client_id, consultant_id, started_at, assessment_type, status)
       VALUES ($1, $2, $3, now(), $4, 'in_progress') RETURNING id`,
      newId,
      client_id,
      consultant_id,
      assessment_type
    )

    const id = rows?.[0]?.id
    if (!id) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })

    return NextResponse.json({ id })
  } catch (e: any) {
    console.error('Assessment session insert error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
