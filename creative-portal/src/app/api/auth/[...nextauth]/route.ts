import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT as any,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,

      // --- DEVELOPMENT MODE: LOG LINK TO TERMINAL ---
      sendVerificationRequest: ({ identifier: email, url }) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`\n\n--- AUTH LINK (DEV MODE) ---`)
          console.log(`To: ${email}`)
          console.log(`Login Link: ${url}`)
          console.log(`-----------------------------\n`)
        }
        // You would typically send the email here in a real production environment
      },
      // ----------------------------------------------------
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, name: true, email: true },
        })
        if (dbUser) {
          ;(session.user as any).role = dbUser.role as string
          ;(session.user as any).id = user.id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
