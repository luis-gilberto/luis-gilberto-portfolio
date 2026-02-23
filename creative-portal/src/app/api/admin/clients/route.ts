import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'CONSULTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log("[DATA ACCESS] Admin Client List Fetched. Count:", clients.length);
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
    const { 
      name, 
      contact, 
      email, 
      company, 
      status, 
      projectType, 
      budgetRange, 
      timeline, 
      companySize,
      password // Task 3: Temp Password
    } = body;

    // Server-Side Validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Check if client/user already exists
    const existingClient = await prisma.client.findUnique({ where: { email } });
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingClient || existingUser) {
      return NextResponse.json({ error: 'A client or user with this email already exists' }, { status: 400 });
    }

    // Task 1 & 2: Atomic Transaction for Unified Provisioning
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization (Client)
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

      // 2. Create User (Identity)
      const hashedPassword = await bcrypt.hash(password || 'portal123', 10);
      const newUser = await tx.user.create({
        data: {
          name: contact || name,
          email: email,
          password: hashedPassword,
          role: 'CLIENT',
          client: { connect: { id: newClient.id } }, // Link to Org
        }
      });

      // 3. Create Project (Discovery)
      const newProject = await tx.project.create({
        data: {
          title: `${company || name} - Strategic Discovery`,
          status: 'DISCOVERY',
          userId: session.user.id, // Admin owns it initially (or maybe the new user?)
          // Requirement says "Populate ownerId (Admin) and clientId (New User) immediately"
          // Schema: userId (User relation), clientId (Client relation)
          // Ideally, the Project should belong to the Admin (Consultant) but link to the Client Org.
          // But wait, "clientId (New User)"? Schema Project has `clientId` pointing to `Client` model, not `User`.
          // And `userId` points to `User`.
          // If Admin is the owner (userId = Admin), then Client sees it via `clientId` matching their Org.
          clientId: newClient.id,
          brandStatus: 'PENDING',
          campaignStatus: 'PENDING',
          creativeStatus: 'PENDING',
          gtmStatus: 'PENDING',
        }
      });

      // 4. Seed Assessment Sessions (The 4 Pillars)
      const pillars = ['GTM', 'BRAND', 'CAMPAIGN', 'CREATIVE'];
      for (const type of pillars) {
        await tx.assessmentSession.create({
          data: {
            projectId: newProject.id,
            clientId: newClient.id,
            assessmentType: type,
            status: 'NOT_STARTED', // Task 1: Seed as NOT_STARTED
            consultantId: session.user.id,
            isPublished: false
          }
        });
      }

      return { client: newClient, user: newUser, project: newProject };
    });

    console.log("[PROVISIONING] Complete. Client:", result.client.id, "User:", result.user.id, "Project:", result.project.id);
    
    return NextResponse.json({
      success: true,
      client: result.client,
      user: { email: result.user.email, tempPassword: password || 'portal123' },
      project: result.project
    }, { status: 201 });

  } catch (error: any) {
    console.error('[PROVISIONING_ERROR]:', error);
    
    // Task 1: API Error Transparency (Prisma Unique Constraint)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'email';
      return NextResponse.json({ 
        error: 'Identity Collision', 
        message: `A user with this ${field} already exists in the identity vault.` 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Provisioning Failed',
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
