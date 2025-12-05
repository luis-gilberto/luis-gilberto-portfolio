import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

console.log("EmailProvider customized for dev magic link logging")

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ url }) {
        console.log(`Login Link: ${url}`)
        try {
          const filePath = path.join(process.cwd(), ".magic-link.txt")
          fs.appendFileSync(filePath, `${url}\n`)
        } catch {}
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ;(token as any).role = (user as any).role || 'CLIENT'
        ;(token as any).id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).role = (token as any).role || 'CLIENT'
        ;(session.user as any).id = (token as any).sub || (token as any).id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard'
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
