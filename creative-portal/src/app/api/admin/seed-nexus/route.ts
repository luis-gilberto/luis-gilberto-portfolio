import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)

  // Security: Only Admins can seed data
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      throw new Error("No Admin user found to assign as owner.")
    }

    // Check if seeding has already been done to prevent duplicates
    const existingClient = await prisma.client.findUnique({
      where: { email: "sarah@nexus-ai.solutions" }
    })

    if (existingClient) {
      // If client exists, let's fetch the project ID to return it
      const existingProject = await prisma.project.findFirst({
        where: { clientId: existingClient.id }
      })
      
      return NextResponse.json({
        success: true,
        message: "Nexus AI Solutions environment already exists.",
        projectId: existingProject?.id,
        clientId: existingClient.id
      })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Client
      const client = await tx.client.create({
        data: {
          name: "Sarah Chen",
          company: "Nexus AI Solutions",
          email: "sarah@nexus-ai.solutions",
          status: "ACTIVE",
          contact: "Sarah Chen",
        }
      })

      // 2. Create Partner User
      const hashedPassword = await bcrypt.hash("NexusStrategy2026!", 10)
      const user = await tx.user.create({
        data: {
          name: "Sarah Chen",
          email: "sarah@nexus-ai.solutions",
          password: hashedPassword,
          role: "CLIENT", // Standard role for partners/clients in this system
          clientId: client.id,
        }
      })

      // 3. Create Project
      const project = await tx.project.create({
        data: {
          title: "Enterprise Strategic Pivot",
          status: "DISCOVERY",
          userId: adminUser.id, // Admin owns it
          clientId: client.id, // Linked to the Nexus client org
          businessGoals: "Re-engineer Nexus from a technical utility into a Strategic AI Partner for the Microsoft Azure ecosystem. Goal: move to enterprise-wide deployments ($250k+). Become the recognized authority for Responsible AI Integration within 24 months.",
          businessOKRs: "1. Authority Lift: 50 high-intent CTO downloads of AI Framework. 2. Sales Velocity: Reduce cycle from 6 to 4 months via diagnostic process. 3. Ecosystem: Generate $1M pipeline via Azure Marketplace. 4. Operational Clarity: Establish 90-day tactical sprint cadence.",
          marketingGoals: "Establish Category Authority within the Azure ecosystem. Microsoft Co-sell Status achieved. 50 High-Intent Downloads of the AI Framework.",
          strategicConstraints: "1. The Technological Curse: Internal obsession with features over Human ROI. 2. Broken Attribution: Zero visibility into enterprise revenue drivers. 3. Identity Anemia: Startup aesthetic lacks Fortune 500 gravity.",
          primaryBusinessGoals: "Re-engineer Nexus from a technical utility into a Strategic AI Partner for the Microsoft Azure ecosystem. Goal: move to enterprise-wide deployments ($250k+). Become the recognized authority for Responsible AI Integration within 24 months.",
          businessDriver: "Market Capture",
          operationalPriority: "Narrative Authority",
          metricName: "ARR (Annual Recurring Revenue)",
          metricBaseline: "$1.2M",
          metricTarget: "$5M",
          cacCurrent: "$4,200",
          cacGoal: "$3,000",
          ltvCurrent: "$45,000",
          ltvGoal: "$65,000",
          conversionCurrent: "1.2%",
          conversionGoal: "2.5%",
          marketingSignal: "Direct outbound to CTOs via LinkedIn; technical whitepapers.",
          marketingNoise: "Generic 'AI for Everyone' social ads; unoptimized trade show leads.",
          channels: ["Paid Search (Google/Bing)", "Paid Social (Meta/LinkedIn)", "Content Marketing", "SEO / Organic Search"],
          startDate: new Date(),
        }
      })

      // 4. Initialize Strategy Engine (4 Assessment Pillars)
      const pillars = ['GTM', 'BRAND', 'CAMPAIGN', 'CREATIVE']
      for (const type of pillars) {
        await tx.assessmentSession.create({
          data: {
            projectId: project.id,
            clientId: client.id,
            assessmentType: type,
            status: 'NOT_STARTED',
            consultantId: adminUser.id,
            isPublished: false
          }
        })
      }

      return { projectId: project.id, clientId: client.id, userId: user.id }
    })

    return NextResponse.json({
      success: true,
      message: "Nexus AI Solutions environment provisioned successfully with Partner Identity.",
      ...result
    })

  } catch (error: any) {
    console.error("SEED_NEXUS_FAILED:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error during seeding" 
    }, { status: 500 })
  }
}
