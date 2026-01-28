import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/auth")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    const role = (token?.role as string) || "CLIENT"

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (role === "ADMIN" || role === "TEAM_MEMBER") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "ADMIN" && role !== "TEAM_MEMBER") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/auth/:path*", "/projects/:path*", "/documents/:path*", "/messages/:path*"],
}
