import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'CONSULTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'CONSULTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, contact, email, company, status, projectType, budgetRange, timeline, companySize } = body;

    // Server-Side Validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Check if client already exists to prevent unique constraint violation
    const existingClient = await prisma.client.findUnique({
      where: { email }
    });

    if (existingClient) {
      return NextResponse.json({ error: 'A client with this email already exists' }, { status: 400 });
    }

    // Use a transaction to ensure both client and project are created
    const result = await prisma.$transaction(async (tx) => {
      const newClient = await tx.client.create({
        data: {
          name,
          contact,
          email,
          company,
          status: status || 'Active',
          projectType,
          budgetRange,
          timeline,
          companySize,
        }
      });

      const newProject = await tx.project.create({
        data: {
          title: `${company || name} - Strategic Discovery`,
          status: 'DISCOVERY',
          userId: session.user.id,
          clientId: newClient.id,
          brandStatus: 'PENDING',
          campaignStatus: 'PENDING',
          creativeStatus: 'PENDING',
          gtmStatus: 'PENDING',
        }
      });

      return { client: newClient, project: newProject };
    });

    return NextResponse.json(result.client, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create client:', error);
    return NextResponse.json({ 
      error: 'Failed to create client record',
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Use a transaction to ensure atomic deletion of all related records
    await prisma.$transaction(async (tx) => {
      // 1. Delete all assessment sessions associated with this client
      // We do this first because they point to both Client and Project
      await tx.assessmentSession.deleteMany({
        where: { clientId: clientId }
      });

      // 2. Delete all projects associated with this client
      // Note: Deliverables, Documents, Messages, Milestones, and TimelineEvents 
      // will be deleted automatically due to 'onDelete: Cascade' in the schema.
      await tx.project.deleteMany({
        where: { clientId: clientId }
      });

      // 3. Finally delete the client record
      await tx.client.delete({
        where: { id: clientId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CRITICAL: Client Deletion Failed:', error);
    return NextResponse.json({ 
      error: 'Failed to delete client', 
      message: error.message,
      details: error.code === 'P2003' ? 'Foreign key constraint violation' : 'Internal error'
    }, { status: 500 });
  }
}
