import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

console.log("EmailProvider customized for dev magic link logging")

export const authOptions: AuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    // CRITICAL OVERRIDE: Update the user's name upon first sign-in
    // Note: For EmailProvider, 'createUser' is called when a new user is verified.
    createUser: async (data: any) => {
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
      return user as any
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
      name: "Enterprise Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) {
          // For security, do not reveal if user exists
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        
        return user as any;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
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
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
