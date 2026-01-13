import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const tables = [
  '"User"',
  '"Project"',
  '"Document"',
  '"Account"',
  '"Session"',
  '"VerificationToken"',
  'assessment_sessions',
]

async function run(sql: string) {
  try {
    await prisma.$executeRawUnsafe(sql)
  } catch (e) {
    console.error(e instanceof Error ? e.message : e)
  }
}

async function main() {
  // Create assessment_sessions table if missing
  await run(`
    CREATE TABLE IF NOT EXISTS assessment_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id text NOT NULL,
      assessment_type text NOT NULL,
      started_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL,
      responses jsonb DEFAULT '{}'::jsonb,
      intelligence_score int DEFAULT 0,
      current_question int DEFAULT 0,
      updated_at timestamptz DEFAULT now()
    );
  `)

  for (const t of tables) {
    await run(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`)
  }

  await run(`CREATE POLICY "User View Own Data" ON "User" FOR SELECT TO authenticated USING (auth.uid()::text = id);`)
  await run(`CREATE POLICY "Projects View Own" ON "Project" FOR SELECT TO authenticated USING (auth.uid()::text = "userId");`)
  await run(`CREATE POLICY "Documents View Own" ON "Document" FOR SELECT TO authenticated USING (auth.uid()::text IN (SELECT "userId" FROM "Project" WHERE "Project"."id" = "Document"."projectId"));`)

  // Assessment Sessions policies
  await run(`CREATE POLICY "Assessment Insert Own" ON assessment_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = client_id);`)
  await run(`CREATE POLICY "Assessment Update Own" ON assessment_sessions FOR UPDATE TO authenticated USING (auth.uid()::text = client_id) WITH CHECK (auth.uid()::text = client_id);`)
  await run(`CREATE POLICY "Assessment Select Own" ON assessment_sessions FOR SELECT TO authenticated USING (auth.uid()::text = client_id);`)

  for (const t of tables) {
    await run(`CREATE POLICY "Server Full Access ${t.replace(/\"/g,'')}" ON ${t} FOR ALL TO postgres USING (true) WITH CHECK (true);`)
  }

  const rls = await prisma.$queryRawUnsafe<any[]>(
    `SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname IN ('User','Project','Document','Account','Session','VerificationToken','assessment_sessions') ORDER BY relname;`
  )
  const policies = await prisma.$queryRawUnsafe<any[]>(
    `SELECT policyname, schemaname, tablename, roles, cmd FROM pg_policies WHERE tablename IN ('User','Project','Document','Account','Session','VerificationToken','assessment_sessions') ORDER BY tablename, policyname;`
  )
  console.log(JSON.stringify({ rls, policies }, null, 2))
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
