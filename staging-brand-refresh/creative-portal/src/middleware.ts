import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicPage = ["/", "/about", "/services", "/contact"].includes(
      req.nextUrl.pathname
    )

    // Allow access to API auth routes
    if (isApiAuthRoute) {
      return null
    }

    // Allow access to public pages
    if (isPublicPage) {
      return null
    }

    // Redirect to signin if not authenticated and trying to access protected routes
    if (!isAuth && !isAuthPage) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      const role = token?.role as UserRole
      
      // Redirect based on role
      if (role === UserRole.ADMIN || role === UserRole.TEAM_MEMBER) {
        return NextResponse.redirect(new URL("/admin", req.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Role-based route protection
    if (isAuth) {
      const role = token?.role as UserRole
      const pathname = req.nextUrl.pathname

      // Admin routes - only admins and team members
      if (pathname.startsWith("/admin")) {
        if (role !== UserRole.ADMIN && role !== UserRole.TEAM_MEMBER) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      // Client dashboard - only clients (admins/team members use /admin)
      if (pathname.startsWith("/dashboard")) {
        if (role === UserRole.ADMIN || role === UserRole.TEAM_MEMBER) {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This callback is called for every request
        // Return true to allow the request, false to deny
        return true // We handle authorization in the middleware function above
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}