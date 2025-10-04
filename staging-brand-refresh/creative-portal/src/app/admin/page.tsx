"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Redirect clients to client dashboard
    if (session.user.role === "CLIENT") {
      router.push("/dashboard")
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

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_MEMBER")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Creative Portal Management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {session.user.name} ({session.user.role})
              </div>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">P</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Projects
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">A</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">C</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">T</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Tasks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Administrative tools and project management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex-col">
                  <div className="text-lg mb-2">➕</div>
                  <div>New Project</div>
                </Button>
                <Button variant="secondary" className="h-auto p-4 flex-col">
                  <div className="text-lg mb-2">👥</div>
                  <div>Manage Clients</div>
                </Button>
                <Button variant="secondary" className="h-auto p-4 flex-col">
                  <div className="text-lg mb-2">📊</div>
                  <div>Analytics</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <div className="text-lg mb-2">⚙️</div>
                  <div>Settings</div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Latest project activity and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No projects yet. Create your first project to get started.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  System events and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No recent activity to display.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}