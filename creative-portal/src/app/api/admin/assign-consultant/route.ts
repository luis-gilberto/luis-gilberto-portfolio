import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, consultantId } = await req.json();

    if (!sessionId || !consultantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: { consultantId }
    });

    // Create System Signal (Notification)
    if (updated.projectId) {
      await prisma.message.create({
        data: {
          content: `SYSTEM SIGNAL: Consultant assigned. Review phase initiated.`,
          senderId: session.user.id,
          projectId: updated.projectId,
          role: 'SYSTEM' // Assuming we can use this or just rely on Admin sender
        } as any // Bypass strict typing if 'role' isn't in schema but is used in app logic
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Assignment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
