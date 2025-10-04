"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Redirect admins and team members to admin dashboard
    if (session.user.role === "ADMIN" || session.user.role === "TEAM_MEMBER") {
      router.push("/admin")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session || session.user.role !== "CLIENT") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-red/5 to-warm-cream/20 pt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-black font-big-shoulders mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-cool-gray-600 font-general-sans">
            Here's an overview of your projects and recent activity.
          </p>
        </div>
        
        {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="col-span-full bg-white/80 backdrop-blur-sm border-cool-gray-200">
              <CardHeader>
                <CardTitle className="text-deep-black font-big-shoulders">Your Project Hub</CardTitle>
                <CardDescription className="text-cool-gray-600 font-general-sans">
                  Track project progress, communicate with our team, and access all your project files in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Projects Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-cool-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-deep-black font-big-shoulders">Active Projects</h3>
                <div className="text-3xl font-bold text-coral-red mb-2 font-poppins">0</div>
                <p className="text-sm text-cool-gray-600 font-general-sans">Projects in progress</p>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="bg-white/80 backdrop-blur-sm border-cool-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-deep-black font-big-shoulders">Messages</h3>
                <div className="text-3xl font-bold text-coral-red mb-2 font-poppins">0</div>
                <p className="text-sm text-cool-gray-600 font-general-sans">Unread messages</p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-cool-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-deep-black font-big-shoulders">Recent Activity</h3>
                <div className="text-sm text-cool-gray-600 font-general-sans">
                  No recent activity
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-cool-gray-200">
            <CardHeader>
              <CardTitle className="text-deep-black font-big-shoulders">Quick Actions</CardTitle>
              <CardDescription className="text-cool-gray-600 font-general-sans">
                Common tasks to help you get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-cool-gray-300 hover:bg-coral-red hover:text-white hover:border-coral-red transition-all">
                  <div className="text-lg mb-2">📋</div>
                  <div className="font-general-sans">View Projects</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-cool-gray-300 hover:bg-coral-red hover:text-white hover:border-coral-red transition-all">
                  <div className="text-lg mb-2">💬</div>
                  <div className="font-general-sans">Messages</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-cool-gray-300 hover:bg-coral-red hover:text-white hover:border-coral-red transition-all">
                  <div className="text-lg mb-2">📁</div>
                  <div className="font-general-sans">Files</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center border-cool-gray-300 hover:bg-coral-red hover:text-white hover:border-coral-red transition-all">
                  <div className="text-lg mb-2">📊</div>
                  <div className="font-general-sans">Reports</div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
    </div>
  )
}