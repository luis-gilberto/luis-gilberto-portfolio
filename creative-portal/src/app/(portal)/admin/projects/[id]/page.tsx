"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ThemeToggle from "@/components/ui/ThemeToggle"

// Mock Data
const PROJECT_DATA = {
  id: "1",
  name: "Web Revamp",
  client: "Acme Corp",
  status: "In Progress",
  objective: "Complete overhaul of the corporate website to align with new brand guidelines and improve conversion rates by 20%.",
  recentActivity: [
    { id: 1, action: "Design System Approved", date: "2 days ago", user: "Sarah (Designer)" },
    { id: 2, action: "Wireframes Completed", date: "4 days ago", user: "Luis Gilberto" },
    { id: 3, action: "Project Kickoff", date: "1 week ago", user: "Luis Gilberto" },
  ],
  roadmap: [
    { phase: "Phase 1: Discovery", status: "Completed", date: "Oct 1 - Oct 15" },
    { phase: "Phase 2: Strategy", status: "Completed", date: "Oct 16 - Oct 30" },
    { phase: "Phase 3: Design", status: "In Progress", date: "Nov 1 - Nov 30" },
    { phase: "Phase 4: Development", status: "Pending", date: "Dec 1 - Dec 20" },
    { phase: "Phase 5: Launch", status: "Pending", date: "Jan 5" },
  ],
  deliverables: [
    { name: "Brand_Guidelines_v2.pdf", size: "4.2 MB", status: "Approved" },
    { name: "Homepage_Mockup_v3.fig", size: "12 MB", status: "Pending Review" },
    { name: "Content_Strategy_Doc.docx", size: "1.5 MB", status: "Draft" },
  ],
  team: [
    { name: "Luis Gilberto", role: "Lead Consultant" },
    { name: "Sarah Jenkins", role: "Lead Designer" },
    { name: "Mike Ross", role: "Tech Lead" },
  ]
}

export default function ProjectDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEAM_MEMBER")) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#F96F6E] selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white p-0 mr-2 h-auto hover:bg-transparent">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </Button>
             <div>
               <div className="flex items-center gap-3">
                 <h1 className="text-2xl font-bold font-big-shoulders tracking-wide">{PROJECT_DATA.name}</h1>
                 <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/20">{PROJECT_DATA.status}</Badge>
               </div>
               <p className="text-sm text-gray-400">Client: <span className="text-white">{PROJECT_DATA.client}</span></p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-transparent p-0 border-b border-white/10 rounded-none h-auto gap-6">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--teal)] data-[state=active]:bg-transparent px-0 pb-3 pt-0 text-gray-400 data-[state=active]:text-[var(--teal)] data-[state=active]:shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="roadmap" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--teal)] data-[state=active]:bg-transparent px-0 pb-3 pt-0 text-gray-400 data-[state=active]:text-[var(--teal)] data-[state=active]:shadow-none">Roadmap</TabsTrigger>
                <TabsTrigger value="deliverables" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--teal)] data-[state=active]:bg-transparent px-0 pb-3 pt-0 text-gray-400 data-[state=active]:text-[var(--teal)] data-[state=active]:shadow-none">Deliverables</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Objective Card */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Project Objective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {PROJECT_DATA.objective}
                    </p>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {PROJECT_DATA.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 border-b border-white/5 last:border-0 pb-3 last:pb-0">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--teal)] shrink-0"></div>
                          <div>
                            <p className="text-white font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.user} • {activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Phase Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l border-white/10 ml-3 space-y-8 pl-8 py-2">
                      {PROJECT_DATA.roadmap.map((phase, index) => (
                        <div key={index} className="relative">
                          <span className={`absolute -left-[39px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-[#0a0a0a] ${
                            phase.status === 'Completed' ? 'bg-green-500' :
                            phase.status === 'In Progress' ? 'bg-[var(--teal)] animate-pulse' : 'bg-gray-700'
                          }`}>
                            {phase.status === 'Completed' && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                          </span>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <h3 className={`font-bold text-lg ${phase.status === 'Pending' ? 'text-gray-500' : 'text-white'}`}>{phase.phase}</h3>
                            <span className="text-xs font-mono text-gray-500">{phase.date}</span>
                          </div>
                          <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${
                             phase.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                             phase.status === 'In Progress' ? 'bg-[var(--teal)]/10 text-[var(--teal)]' : 'bg-gray-700/20 text-gray-500'
                          }`}>
                            {phase.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deliverables" className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                   {PROJECT_DATA.deliverables.map((file, index) => (
                     <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors group">
                       <CardContent className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xl">📄</div>
                           <div>
                             <div className="text-white font-medium group-hover:text-[var(--teal)] transition-colors">{file.name}</div>
                             <div className="text-xs text-gray-500">{file.size} • <span className={file.status === 'Approved' ? 'text-green-400' : 'text-yellow-400'}>{file.status}</span></div>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">Download</Button>
                           {file.status !== 'Approved' && (
                             <Button size="sm" className="bg-[var(--teal)] text-black hover:bg-[#25b2a7]">Approve</Button>
                           )}
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[var(--coral)]/10 border-[var(--coral)]/20">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-[var(--coral)] uppercase tracking-wider">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[var(--coral)] hover:bg-[#e05e5d] text-white">Upload Asset</Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">Send Update</Button>
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white">Edit Scope</Button>
              </CardContent>
            </Card>

            {/* Team Bench */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-wider">Team Bench</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PROJECT_DATA.team.map((member, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Meta */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date</span>
                  <span className="text-gray-300">Oct 1, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date</span>
                  <span className="text-gray-300">Jan 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="text-gray-300">$25,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}