import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import packageJson from "../../../../package.json"

export async function GET() {
  try {
    // Check Database Connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: packageJson.version,
        environment: process.env.NODE_ENV,
        database: "connected",
        services: {
          database: "up",
          web: "up"
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: packageJson.version,
        environment: process.env.NODE_ENV,
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 503 }
    )
  }
}
