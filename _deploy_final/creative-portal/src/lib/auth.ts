import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

console.log("EmailProvider customized for dev magic link logging")

export const authOptions: AuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    // CRITICAL OVERRIDE: Update the user's name upon first sign-in
    // Note: For EmailProvider, 'createUser' is called when a new user is verified.
    createUser: async (data) => {
      // Determine role based on email pattern
      let role = 'CLIENT';
      if (data.email.includes("admin")) {
          role = "ADMIN";
      } else if (data.email.includes("consultant")) {
          role = "CONSULTANT";
      }

      const user = await prisma.user.create({
        data: {
          ...data,
          name: data.name || 'New Client Partner', 
          role: role as any
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
    CredentialsProvider({
      name: "Dev Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        let role = 'CLIENT';
        if (credentials.email.includes("admin")) {
            role = "ADMIN";
        } else if (credentials.email.includes("consultant")) {
            role = "CONSULTANT";
        } else {
            role = "CLIENT";
        }

        // Upsert user to ensure they exist in DB with correct role
        const user = await prisma.user.upsert({
          where: { email: credentials.email },
          update: { role: role as any },
          create: {
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: role as any
          }
        });
        
        return user;
      }
    })
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
}
