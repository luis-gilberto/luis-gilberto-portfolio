import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const emailArg = process.argv[2]
  const email = emailArg || "hello@luis-gilberto.com"
  const tokens = await prisma.verificationToken.findMany({
    where: { identifier: email },
    orderBy: { expires: "desc" },
    take: 5,
  })
  console.log(tokens)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

