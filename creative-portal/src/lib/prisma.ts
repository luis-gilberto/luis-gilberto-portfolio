import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientOptions = {
  log: ['query', 'error'] as const,
}

const getPrismaClient = () => {
  const url = process.env.DATABASE_URL
  
  if (url && url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
    // If using Supabase pooler, ensure pgbouncer=true is set
    // This helps with connection stability in serverless/edge environments
    // Also setting connection_limit=1 for dev to prevent exhaustion
    const separator = url.includes('?') ? '&' : '?'
    const newUrl = `${url}${separator}pgbouncer=true&connection_limit=1`
    
    return new PrismaClient({
      ...prismaClientOptions,
      datasources: {
        db: {
          url: newUrl,
        },
      },
    })
  }

  return new PrismaClient(prismaClientOptions)
}

export const prisma =
  globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    const url = process.env.DATABASE_URL;
    console.log('Initializing Prisma Client with URL:', url ? url.replace(/:[^:]*@/, ':****@') : 'UNDEFINED');
  }
  globalForPrisma.prisma = prisma
}
