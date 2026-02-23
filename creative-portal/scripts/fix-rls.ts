
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Applying RLS policies for project_messages...')

  try {
    // 1. Enable RLS on the table (if not already enabled)
    await prisma.$executeRawUnsafe(`ALTER TABLE "project_messages" ENABLE ROW LEVEL SECURITY;`)
    console.log('RLS enabled on project_messages.')

    // 2. Drop existing policies to avoid conflicts (optional but safer for idempotency)
    // We wrap in try-catch or use IF EXISTS
    try {
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Enable read access for all users" ON "project_messages";`)
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Enable insert for authenticated users" ON "project_messages";`)
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Enable update for users based on email" ON "project_messages";`)
    } catch (e) {
      console.log('No existing policies to drop or error dropping:', e)
    }

    // 3. Create policies
    // Allow SELECT for authenticated users (or everyone if public is needed)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable read access for all users" ON "project_messages"
      FOR SELECT
      USING (true);
    `)
    console.log('Read policy created.')

    // Allow INSERT for all users (application handles auth)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable insert for all users" ON "project_messages"
      FOR INSERT
      WITH CHECK (true);
    `)
    console.log('Insert policy created.')

    // Allow UPDATE for all users (application handles auth)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Enable update for all users" ON "project_messages"
      FOR UPDATE
      USING (true);
    `)
    console.log('Update policy created.')

    console.log('RLS policies applied successfully.')
  } catch (error) {
    console.error('Error applying RLS policies:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
