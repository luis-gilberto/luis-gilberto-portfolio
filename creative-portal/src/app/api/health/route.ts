import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Simple query to keep the connection alive
    await prisma.project.findFirst({
      select: { id: true },
    });

    return NextResponse.json({ 
      status: 'OK', 
      system: 'StrategyIQ',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health Check Failed:', error);
    return NextResponse.json(
      { status: 'ERROR', system: 'StrategyIQ', error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
