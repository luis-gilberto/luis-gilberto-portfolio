import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user?.role;
  if (role !== 'ADMIN' && role !== 'CONSULTANT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const whereClause: any = {
      status: {
        in: ['UNDER_REVIEW', 'MANUAL_REVIEW', 'submitted', 'SUBMITTED', 'COMPLETED'] // Include COMPLETED to match legacy counts if desired, or remove to align strict pending
      }
    };

    // Consultants only see their assigned briefs (Admins see ALL)
    if (role === 'CONSULTANT' && session.user?.email !== process.env.PORTAL_ADMIN_EMAIL) {
      whereClause.consultantId = session.user?.id;
    }

    const queue = await prisma.assessmentSession.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            name: true,
            company: true,
          }
        },
        project: {
          select: {
            title: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'asc' // Oldest first
      }
    });

    // Also fetch available consultants for the assignment dropdown (Admin only)
    let consultants: any[] = [];
    if (role === 'ADMIN') {
      consultants = await prisma.user.findMany({
        where: { role: 'CONSULTANT' },
        select: { id: true, name: true, email: true }
      });
    }

    return NextResponse.json({ queue, consultants });
  } catch (error) {
    console.error('Mission Control Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
