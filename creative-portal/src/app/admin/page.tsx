"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ThemeToggle from "@/components/ui/ThemeToggle"
import StatusBadge from "@/components/ui/StatusBadge"

// Mock Data for Search
const MOCK_DATA = [
  { id: 1, type: 'Project', name: 'Brand Redesign', client: 'Acme Corp' },
  { id: 2, type: 'Project', name: 'Q4 Strategy', client: 'Globex Inc' },
  { id: 3, type: 'Client', name: 'Acme Corp', client: 'Acme Corp' },
  { id: 4, type: 'Client', name: 'Stark Ind', client: 'Stark Ind' },
  { id: 5, type: 'Assessment', name: 'Initial Audit', client: 'Wayne Ent' },
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return 
    if (!session) {
      router.push("/auth/signin")
      return
    }
    if (session.user.role === "CLIENT") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-lg animate-pulse">Loading Command Center...</div>
      </div>
    )
  }

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_MEMBER")) {
    return null
  }

  // Filter Logic
  const filteredResults = MOCK_DATA.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#F96F6E] selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div>
              <h1 className="text-3xl font-bold font-big-shoulders tracking-wider text-white">
                COMMAND CENTER
              </h1>
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mt-1">
                Strategic Operations
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold text-white">{session.user.name}</div>
                 <div className="text-xs text-[var(--teal)] uppercase tracking-wider">{session.user.role}</div>
              </div>
              <ThemeToggle />
              <Button
                variant="outline"
                className="border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-white/5 transition-all"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Global Search */}
        <div className="mb-10 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input 
            type="text" 
            placeholder="SEARCH CLIENTS, PROJECTS, OR DATA..." 
            className="w-full h-16 pl-12 bg-white/5 border-white/10 rounded-xl text-lg text-white placeholder:text-gray-600 focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm ? (
          /* Search Results View */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-big-shoulders tracking-wide text-gray-400">
              SEARCH RESULTS ({filteredResults.length})
            </h2>
            {filteredResults.length > 0 ? (
              <div className="grid gap-4">
                {filteredResults.map(item => (
                  <Card key={item.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-white">{item.name}</div>
                        <div className="text-sm text-gray-400">{item.client}</div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                        {item.type}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No results found matching "{searchTerm}"
              </div>
            )}
          </div>
        ) : (
          /* Default Dashboard View */
          <div className="space-y-10 animate-in fade-in duration-700">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Projects", value: "12", color: "text-[var(--teal)]", icon: "P" },
                { label: "Active Projects", value: "5", color: "text-white", icon: "A" },
                { label: "Total Clients", value: "8", color: "text-[var(--coral)]", icon: "C" },
                { label: "Pending Tasks", value: "3", color: "text-yellow-400", icon: "T" },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:border-white/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                      </div>
                      <span className={`text-3xl font-bold font-big-shoulders ${stat.color}`}>
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold font-big-shoulders tracking-wide text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--teal)]"></span>
                QUICK ACTIONS
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button className="h-24 flex-col bg-white/5 border border-white/10 hover:bg-[var(--teal)] hover:text-black hover:border-[var(--teal)] transition-all group">
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">➕</span>
                  <span className="text-xs font-bold uppercase tracking-widest">New Project</span>
                </Button>
                <Button 
                  className="h-24 flex-col bg-white/5 border border-white/10 hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] transition-all group"
                  onClick={() => router.push('/admin/clients')}
                >
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">👥</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Manage Leads</span>
                </Button>
                <Button className="h-24 flex-col bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group pointer-events-none opacity-75 relative">
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant="dev" />
                  </div>
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">📊</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Analytics</span>
                </Button>
                <Button className="h-24 flex-col bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group pointer-events-none opacity-75 relative">
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant="dev" />
                  </div>
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">⚙️</span>
                  <span className="text-xs font-bold uppercase tracking-widest">System</span>
                </Button>
              </div>
            </div>

            {/* Recent Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Projects */}
              <Card className="bg-black/60 backdrop-blur-md border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Recent Projects</CardTitle>
                    <CardDescription className="text-gray-500">Latest active workflows</CardDescription>
                  </div>
                  <Button variant="link" className="text-[var(--teal)] hover:text-white" onClick={() => router.push('/admin/projects')}>
                    View All →
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <div className="text-sm font-bold text-white">Brand Strategy Q4</div>
                            <div className="text-xs text-gray-500">Acme Corp</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-gray-400">2h ago</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health / Activity */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">System Feed</CardTitle>
                    <CardDescription className="text-gray-500">Live operational status</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <div className="flex items-start gap-3 text-sm text-gray-400">
                        <span className="text-[var(--coral)]">●</span>
                        <span>New user registration: <span className="text-white">consultant@example.com</span></span>
                     </div>
                     <div className="flex items-start gap-3 text-sm text-gray-400">
                        <span className="text-[var(--teal)]">●</span>
                        <span>Project "Alpha" status updated to <span className="text-white">Review</span></span>
                     </div>
                     <div className="flex items-start gap-3 text-sm text-gray-400">
                        <span className="text-gray-500">●</span>
                        <span>System backup completed successfully</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}