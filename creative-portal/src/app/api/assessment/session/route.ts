import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { client_id, consultant_id, assessment_type } = body
    if (!client_id || !consultant_id || !assessment_type) {
      console.error('Missing required fields:', { client_id, consultant_id, assessment_type })
      return NextResponse.json({ error: 'Missing client_id, consultant_id, or assessment_type' }, { status: 400 })
    }

    const newId = randomUUID()
    
    // Note: Using relation connect syntax for safety
    const session = await prisma.assessmentSession.create({
      data: {
        id: newId,
        client: { connect: { id: client_id } },
        consultantId: consultant_id,
        assessmentType: assessment_type,
        status: 'in_progress'
      }
    })

    console.log("[DATA ACCESS] Assessment Session Created. ClientID:", client_id, "Type:", assessment_type, "SessionID:", session.id);
    return NextResponse.json({ id: session.id })
  } catch (e: any) {
    console.error('Assessment session insert error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
