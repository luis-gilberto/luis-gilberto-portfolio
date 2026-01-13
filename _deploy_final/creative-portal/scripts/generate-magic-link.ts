import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

async function main() {
  const emailArg = process.argv[2]
  const email = emailArg || "hello@luis-gilberto.com"

  const envLocalPath = path.join(process.cwd(), ".env.local")
  const envPath = path.join(process.cwd(), ".env")
  const loadedEnv: Record<string, string> = {}
  for (const p of [envLocalPath, envPath]) {
    try {
      const content = fs.readFileSync(p, "utf-8")
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^([A-Z0-9_]+)=("?)(.*)\2$/)
        if (m) {
          loadedEnv[m[1]] = m[3]
        }
      }
    } catch {}
  }

  const nextauthUrl = process.env.NEXTAUTH_URL || loadedEnv["NEXTAUTH_URL"] || "http://localhost:3000"
  const callbackUrl = `${nextauthUrl}/dashboard`

  const rawToken = crypto.randomBytes(32).toString("hex")
  const secret = process.env.NEXTAUTH_SECRET || loadedEnv["NEXTAUTH_SECRET"] || ""
  const hashedToken = crypto
    .createHash("sha256")
    .update(`${rawToken}${secret}`)
    .digest("hex")
  const expires = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires,
    },
  })

  const link = `${nextauthUrl}/api/auth/callback/email?token=${rawToken}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
  console.log(`Login Link: ${link}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
