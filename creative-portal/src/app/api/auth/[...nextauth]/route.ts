import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

console.log("EmailProvider customized for dev magic link logging")

const handler = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    // CRITICAL OVERRIDE: Update the user's name upon first sign-in
    // Note: For EmailProvider, 'createUser' is called when a new user is verified.
    createUser: async (data) => {
      // Hardcoded fallback as requested. 
      // In a production app, we would use cookies to pass the name from client to server.
      const user = await prisma.user.create({
        data: {
          ...data,
          name: 'New Client Partner', 
          role: 'CLIENT'
        }
      })
      return user
    }
  },
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
        (token as any).role = (user as any).role || 'CLIENT';
        (token as any).id = (user as any).id;
        (token as any).name = (user as any).name;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = (token as any).role || 'CLIENT';
        (session.user as any).id = (token as any).sub || (token as any).id;
        if ((token as any).name) {
            (session.user as any).name = (token as any).name;
        }
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
