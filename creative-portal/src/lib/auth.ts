import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            company: true,
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        if (!user.isActive) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.firstName || user.email,
          role: user.role,
          image: user.avatarUrl,
          companyId: user.companyId,
          companyName: user.company?.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
        token.companyName = user.companyName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.companyId = token.companyId as string | null
        session.user.companyName = token.companyName as string | null
      }
      return session
    },
  },
}

// Helper functions for role-based access control
export const hasRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole)
}

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN
}

export const isTeamMember = (userRole: UserRole): boolean => {
  return userRole === UserRole.TEAM_MEMBER || userRole === UserRole.ADMIN
}

export const isClient = (userRole: UserRole): boolean => {
  return userRole === UserRole.CLIENT
}

export const canAccessProject = (
  userRole: UserRole,
  userId: string,
  project: { clientId: string | null; companyId: string | null },
  userCompanyId: string | null
): boolean => {
  // Admins and team members can access all projects
  if (isTeamMember(userRole)) {
    return true
  }

  // Clients can only access their own projects or company projects
  if (isClient(userRole)) {
    return (
      project.clientId === userId ||
      (userCompanyId && project.companyId === userCompanyId)
    )
  }

  return false
}